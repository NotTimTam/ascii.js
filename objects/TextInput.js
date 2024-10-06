import Pixel, { PixelMesh } from "../core/Pixel.js";
import Scene from "../engine/Scene.js";
import { isPlainObject } from "../util/data.js";
import { clamp } from "../util/math.js";
import Text from "./Text.js";

class TextInput extends Text {
	/**
	 * A text input that can be rendered on screen.
	 * @param {Scene} scene The scene this Object is a part of.
	 * @param {Object} config The `TextInput`'s config object.
	 * @param {number} config.x This `TextInput` object's x-coordinate.
	 * @param {number} config.y This `TextInput` object's y-coordinate.
	 * @param {number} config.maxWidth The maximum width of the `TextInput`. Defaults to `8`.
	 * @param {string} config.value The text to display. (use `"\n"` for newlines)
	 * @param {string} config.color Optional text color.
	 * @param {string} config.activeColor Optional text color for active character.
	 * @param {string} config.backgroundColor Optional background color.
	 * @param {string} config.backgroundColorActive Optional background color for active key.
	 * @param {string} config.fontWeight Optional font weight.
	 * @param {string} config.autoFocus Automatically focus on element once it is instantiated.
	 * @param {function} config.onChange Callback that runs when the input's value changes.
	 * @param {function} config.onKeyDown Callback that runs when the input recieves a keypress.
	 * @param {function} config.onFocus Callback that runs when focus on this input is gained.
	 * @param {function} config.onBlur Callback that runs when focus on this input is lost.
	 * @param {number} config.maxLength An optional maximum input length.
	 * @param {string} config.layer The label of the layer to start the `TextInput` on.
	 */
	constructor(scene, config) {
		if (!isPlainObject(config))
			throw new TypeError(
				"Expected a plain object for TextInput constructor config parameter."
			);

		config.wrap = false;
		if (!config.maxWidth) config.maxWidth = 8;

		super(scene, config);

		const {
			activeColor = "black",
			backgroundColor = "transparent",
			backgroundColorActive = "white",
			onChange,
			onKeyDown,
			onFocus,
			onBlur,
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

		if (onFocus) {
			if (typeof onFocus !== "function")
				throw new TypeError(
					"Expected a function for TextInput config.onFocus value."
				);

			this.onFocus = onFocus;
		}

		if (onBlur) {
			if (typeof onBlur !== "function")
				throw new TypeError(
					"Expected a function for TextInput config.onBlur value."
				);

			this.onBlur = onBlur;
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

		this.scroll = 0;

		this.focused = config.autoFocus;
		this.caret = config.value ? config.value.length : 0;

		scene.inputManager.watchObjectClick(this.id, this.__onClick.bind(this));
		scene.inputManager.addEventListener(
			"click",
			this.__onAnyClick.bind(this)
		);
		scene.inputManager.addEventListener(
			"keydown",
			this.__onKeyDown.bind(this)
		);

		scene.inputManager.addFocusable(this);
	}

	get focused() {
		return this.__rawFocused;
	}

	set focused(bool) {
		this.__rawFocused = Boolean(bool);

		if (bool) this.onFocus && this.onFocus(this);
		else this.onBlur && this.onBlur(this);
	}

	/**
	 * Listens to click events.
	 */
	__onClick() {
		if (!this.focused) {
			this.focused = true;
			this.caret = this.value.length;

			this.__updateScrollPosition();
		}
	}

	/**
	 * Trigger when anything is clicked.
	 */
	__onAnyClick(event) {
		// Defocus when not clicking on this input.
		if (!event.targets.includes(this.id)) this.focused = false;
	}

	/**
	 * Listen to other input events.
	 */
	__onKeyDown(event) {
		const { caret } = this;

		if (!this.focused) return;

		const { key } = event;

		const startValue = this.value;

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

		this.__updateScrollPosition();

		if (startValue !== this.value && this.onChange)
			this.onChange({ target: this, ...event });
		this.onKeyDown && this.onKeyDown({ target: this, ...event });
	}

	/**
	 * Update the position of this `TextInput`'s `scroll` property to properly scroll to the caret in the input.
	 */
	__updateScrollPosition() {
		while (this.caret < this.scroll) this.scroll--;
		while (this.caret > this.scroll + this.maxWidth - 2) this.scroll++;
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
			fontWeight,
			maxWidth,
			caret,
			color,
			activeColor,
			backgroundColor,
			backgroundColorActive,
			focused,
		} = this;

		const data = [];

		const maxScroll = value.length - maxWidth + 1;
		if (this.scroll > maxScroll) this.scroll = maxScroll;
		if (this.scroll < 0) this.scroll = 0;

		const { scroll } = this;

		const display = value
			.substring(scroll, scroll + maxWidth)
			.padEnd(maxWidth, " ")
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
