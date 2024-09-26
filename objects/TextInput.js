import Pixel, { PixelMesh } from "../core/Pixel.js";
import Scene from "../engine/Scene.js";
import Text from "./Text.js";

class TextInput extends Text {
	/**
	 * A text input that can be rendered on screen.
	 * @param {Scene} scene The scene this Object is a part of.
	 * @param {Object} config The `TextInput`'s config object.
	 * @param {number} config.x This `TextInput` object's x-coordinate.
	 * @param {number} config.y This `TextInput` object's y-coordinate.
	 * @param {number} config.width The maximum width of the `TextInput`.
	 * @param {string} config.value The text to display. (use `"\n"` for newlines)
	 * @param {string} config.color Optional text color.
	 * @param {string} config.activeColor Optional text color for active character.
	 * @param {string} config.backgroundColor Optional background color.
	 * @param {string} config.backgroundColorActive Optional background color for active key.
	 * @param {string} config.fontWeight Optional font weight.
	 * @param {string} config.autoFocus Automatically focus on element once it is instantiated.
	 * @param {function} config.onChange Callback that runs when the input's value changes.
	 * @param {function} config.onKeyDown Callback that runs when the input recieves a keypress.
	 * @param {number} config.maxLength An optional maximum input length.
	 */
	constructor(scene, config) {
		config.wrap = false;

		super(scene, config);

		if (!config.width) config.width = 8;

		const {
			activeColor = "black",
			backgroundColor = "transparent",
			backgroundColorActive = "white",
			onChange,
			onKeyDown,
			maxLength,
		} = config;

		if (activeColor) {
			if (typeof activeColor !== "string")
				return new TypeError(
					"Expected a string for Text config.activeColor value."
				);
			this.activeColor = activeColor;
		}

		if (backgroundColor) {
			if (typeof backgroundColor !== "string")
				return new TypeError(
					"Expected a string for Text config.backgroundColor value."
				);
			this.backgroundColor = backgroundColor;
		}

		if (backgroundColorActive) {
			if (typeof backgroundColorActive !== "string")
				return new TypeError(
					"Expected a string for Text config.backgroundColorActive value."
				);
			this.backgroundColorActive = backgroundColorActive;
		}

		if (onChange) {
			if (typeof onChange !== "function")
				throw new TypeError(
					"Expected a function for TextInput config.onChange value."
				);

			this.onChange = onChange;
		}

		if (onKeyDown) {
			if (typeof onKeyDown !== "function")
				throw new TypeError(
					"Expected a function for TextInput config.onKeyDown value."
				);

			this.onKeyDown = onKeyDown;
		}

		if (maxLength) {
			if (
				typeof maxLength !== "number" ||
				!Number.isInteger(maxLength) ||
				maxLength < 0
			)
				throw new TypeError(
					"Invalid config.maxLength value provided to TextInput. Expected an integer greater than or equal to 0."
				);

			this.maxLength = maxLength;
		}

		this.__inputWidth = config.width;
		this.scroll = 0;

		this.focused = Boolean(config.autoFocus);
		this.__rawCaret = 0;

		scene.inputManager.addOnClick(this, this.onClick.bind(this));
		scene.inputManager.addEventListener(this.eventListener.bind(this));
	}

	/**
	 * Listens to click events.
	 */
	onClick() {
		this.focused = true;
	}

	/**
	 * Listen to other input events.
	 */
	eventListener(event) {
		const { caret } = this;

		if (
			event.type === "click" &&
			!event.target
				.map(({ gameObject }) => gameObject.id)
				.includes(this.id)
		) {
			// Defocus when not clicking on this input.
			this.focused = false;
		} else if (event.type === "keydown" && this.focused) {
			const { key } = event;

			// Only allow ASCII range typeable keys.
			if (
				/^[\x20-\x7E]$/.test(key) &&
				(typeof this.maxLength !== "number" ||
					this.value.length < this.maxLength)
			) {
				this.value =
					this.value.slice(0, this.caret) +
					key +
					this.value.slice(this.caret);
				this.caret++;
			} else if (key === "Backspace") {
				this.value =
					this.value.slice(0, caret - 1) + this.value.slice(caret);

				if (this.caret !== this.value.length) this.caret--;
			} else if (key === "Delete") {
				this.value =
					this.value.slice(0, caret) + this.value.slice(caret + 1);
			} else if (key === "Tab") {
				this.value += "    ";
				this.caret += 4;
			} else if (key === "Escape") this.focused = false;
			else if (key === "ArrowLeft") this.caret--;
			else if (key === "ArrowRight") this.caret++;

			while (this.caret < this.scroll) this.scroll--;
			while (this.caret > this.scroll + this.__inputWidth - 2)
				this.scroll++;

			this.onChange && this.onChange({ target: this });
			this.onKeyDown && this.onKeyDown({ target: this, key });
		}
	}

	get caret() {
		if (this.__rawCaret < 0) this.__rawCaret = 0;
		if (this.__rawCaret > this.value.length)
			this.__rawCaret = this.value.length;

		return this.__rawCaret;
	}

	set caret(n) {
		if (typeof n !== "number" || !Number.isInteger(n))
			throw new TypeError("TextInput caret value should be an integer.");

		if (n < 0) n = 0;
		if (n > this.value.length) n = this.value.length;

		this.__rawCaret = n;
	}

	get renderable() {
		const {
			value,
			scene: {
				renderer: { width },
			},
			fontWeight,
			__inputWidth,
			caret,
			color,
			activeColor,
			backgroundColor,
			backgroundColorActive,
			focused,
		} = this;

		const data = [];

		const maxScroll = value.length - __inputWidth + 1;
		if (this.scroll > maxScroll) this.scroll = maxScroll;
		if (this.scroll < 0) this.scroll = 0;

		const { scroll } = this;

		const display = value
			.substring(scroll, scroll + __inputWidth)
			.padEnd(__inputWidth, " ")
			.split("");

		for (let i = 0; i < display.length; i++) {
			const char = display[i];
			const active = i + scroll === caret && focused;
			data.push(
				new Pixel({
					value: char,
					color: active ? activeColor : color,
					backgroundColor: active
						? backgroundColorActive
						: backgroundColor,
					fontWeight,
				})
			);
		}

		// Push the remaining characters in the current line

		return new PixelMesh({ data: [data] });
	}
}

export default TextInput;
