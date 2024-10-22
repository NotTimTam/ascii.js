import UIObject from "../core/UIObject.js";
import Pixel, { PixelMesh } from "../core/Pixel.js";
import Scene from "../engine/Scene.js";

/** @typedef {import("../core/UIObject.js").UIObjectConfig} UIObjectConfig */

/**
 * Configuration data for the `TextInput` class.
 * @typedef {Object} TextInputConfig
 * @property {number} maxWidth The maximum width of the `TextInput`. Defaults to the viewport width.
 * @property {string} value The text to display. (use `"\n"` for newlines)
 * @property {?string} color Optional text color for when the input is focused.
 * @property {?string} blurColor Optional text color for when the input is blurred.
 * @property {?string} activeColor Optional text color for active character.
 * @property {?string} backgroundColor Optional background color.
 * @property {?string} backgroundColorActive Optional background color for active key.
 * @property {?string} fontWeight Optional font weight.
 * @property {function} onChange Callback that runs when the input's value changes.
 * @property {function} onKeyDown Callback that runs when the input recieves a keypress.
 * @property {?number} maxLength An optional maximum input length.
 * @property {?string} placeholder An optional placeholder text value to display when the `value` property is "".
 */

class TextInput extends UIObject {
	/**
	 * A text input that can be rendered on screen.
	 * @param {Scene} scene The scene this Object is a part of.
	 * @param {UIObjectConfig & TextInputConfig} config The `TextInput`'s config object.
	 */
	constructor(scene, config) {
		config.wrap = false;
		if (!config.maxWidth) config.maxWidth = scene.runtime.renderer.width;

		super(scene, config);

		const {
			color = "white",
			activeColor = "black",
			blurColor = "grey",
			backgroundColor = "transparent",
			backgroundColorActive = "white",
			onChange,
			onKeyDown,
			maxLength,
			wrap,
			fontWeight = 400,
			maxWidth,
			value = "",
			placeholder,
		} = config;

		if (placeholder) {
			if (typeof placeholder !== "string")
				return new TypeError(
					"Expected a string for TextInput config.placeholder value."
				);
			this.placeholder = placeholder;
		}

		if (color) {
			if (typeof color !== "string")
				return new TypeError(
					"Expected a string for TextInput config.color value."
				);
			this.color = color;
		}

		if (activeColor) {
			if (typeof activeColor !== "string")
				return new TypeError(
					"Expected a string for TextInput config.activeColor value."
				);
			this.activeColor = activeColor;
		}

		if (blurColor) {
			if (typeof blurColor !== "string")
				return new TypeError(
					"Expected a string for TextInput config.blurColor value."
				);
			this.blurColor = blurColor;
		}

		if (backgroundColor) {
			if (typeof backgroundColor !== "string")
				return new TypeError(
					"Expected a string for TextInput config.backgroundColor value."
				);
			this.backgroundColor = backgroundColor;
		}

		if (backgroundColorActive) {
			if (typeof backgroundColorActive !== "string")
				return new TypeError(
					"Expected a string for TextInput config.backgroundColorActive value."
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

		if (maxWidth) {
			if (
				typeof maxWidth !== "number" ||
				!Number.isInteger(maxWidth) ||
				maxWidth < 1
			)
				throw new TypeError(
					"Invalid config.maxWidth value provided to Text. Expected an integer greater than 0."
				);
			this.maxWidth = maxWidth;
		}

		this.scroll = 0;

		this.value = value;

		this.caret = this.value ? this.value.length : 0;

		this.wrap = wrap;
		this.backgroundColor = backgroundColor;
		this.fontWeight = fontWeight;

		this.addEventListener("click", this.__onClick);
		this.addEventListener("keydown", this.__onKeyDown);
		this.addEventListener("focus", () => {
			this.caret = this.value.length;
		});
	}

	/**
	 * Get the value of the `TextInput` object.
	 */
	get value() {
		return String(this.__rawValue);
	}

	/**
	 * Set the value of the `TextInput` object.
	 */
	set value(value) {
		if (typeof value !== "string")
			throw new Error(
				`TextInput "value" property must be of type "string".`
			);

		this.__rawValue = value;
	}

	/**
	 * Renderable setter override.
	 */
	set renderable(_) {
		return;
	}

	/**
	 * Listens to click events.
	 */
	__onClick() {
		this.caret = this.value.length;
		this.__updateScrollPosition();
	}

	/**
	 * Listen to other input events.
	 */
	__onKeyDown(event) {
		const { caret } = this;

		const { key, rawKey } = event;

		const startValue = this.value;

		// Only allow ASCII range typeable keys.
		if (key === "backspace") {
			this.value =
				this.value.slice(0, caret - 1) + this.value.slice(caret);

			if (this.caret !== this.value.length) this.caret--;
		} else if (key === "delete") {
			this.value =
				this.value.slice(0, caret) + this.value.slice(caret + 1);
		} else if (key === "escape") this.focused = false;
		else if (key === "left") this.caret--;
		else if (key === "right") this.caret++;
		else if (key === "end" || key === "down")
			this.caret = this.value.length;
		else if (key === "home" || key === "up") this.caret = 0;
		else if (
			/^[\x20-\x7E]$/.test(rawKey) &&
			(typeof this.maxLength !== "number" ||
				this.value.length < this.maxLength)
		) {
			this.value =
				this.value.slice(0, this.caret) +
				rawKey +
				this.value.slice(this.caret);
			this.caret++;
		}

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
			placeholder,
		} = this;

		const data = [];

		const maxScroll = value.length - maxWidth + 1;
		if (this.scroll > maxScroll) this.scroll = maxScroll;
		if (this.scroll < 0) this.scroll = 0;

		const { scroll } = this;

		const display = (value === "" && placeholder ? placeholder : value)
			.substring(scroll, scroll + maxWidth)
			.padEnd(maxWidth, " ")
			.split("");

		for (let i = 0; i < display.length; i++) {
			const char = display[i];
			const active = i + scroll === caret && focused;
			data.push(
				new Pixel({
					value: char,
					color:
						this.focused && this.value !== ""
							? active
								? activeColor
								: color
							: this.blurColor,
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
