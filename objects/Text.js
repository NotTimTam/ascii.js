import GameObject from "../core/GameObject.js";
import Pixel, { PixelMesh } from "../core/Pixel.js";
import Style from "../core/Style.js";
import { isPlainObject } from "../util/data.js";

class Text extends GameObject {
	/**
	 * Configuration data for the `Text`'s `configuration.style` property.
	 * @typedef {Object} TextStyleConfig
	 * @property {?string} color The color of the `Text`.
	 * @property {?string} backgroundColor The background color of the `Text`.
	 */
	static style = {
		color: new Style.Parameter("color", "white"),
		backgroundColor: new Style.Parameter("backgroundColor", null),
	};

	/**
	 * Configuration data for the `Text` class.
	 * @typedef {Object} TextConfig
	 * @property {number} x This `Text` object's x-coordinate.
	 * @property {number} y This `Text` object's y-coordinate.
	 * @property {number} zIndex A numeric value determining the rendering heirarchy position this `Text` should fall in.
	 *
	 * `Text`s with higher z-indeces will be drawn on top of those with lower z-indeces. Default `0`.
	 * @property {?string} layer The (optional) label of the layer to initialize the `Text` on.
	 * @property {?number} maxWidth The optional maximum width of the `Text`.
	 * @property {string} value The text to display. (use `"\n"` for newlines)
	 * @property {boolean} wrap Whether to wrap the text if it overflows the screen.
	 * @property {?string} fontWeight Optional font weight.
	 * @property {?TextStyleConfig} style Optional style configuration object.
	 */

	/**
	 * A string of text that can be rendered on screen.
	 * @param {Scene} scene The scene this Object is a part of.
	 * @param {TextConfig} config The `Text`'s config object.
	 */
	constructor(scene, config) {
		const {
			value = "Hello, world!",
			wrap = true,
			fontWeight = 400,
			maxWidth = Infinity,
			style = {},
		} = config;
		super(scene, config);

		if (maxWidth) {
			if (
				!(
					maxWidth === Infinity ||
					(typeof maxWidth === "number" &&
						Number.isInteger(maxWidth) &&
						maxWidth >= 1)
				)
			)
				throw new TypeError(
					"Invalid config.maxWidth value provided to Text. Expected an integer greater than 0."
				);
			this.maxWidth = maxWidth;
		}

		this.__rawValue = value;
		this.wrap = wrap;
		this.fontWeight = fontWeight;
		this.style = new Style(Text.style).hydrate(style);
	}

	/**
	 * Get the value of the text object.
	 */
	get value() {
		return String(this.__rawValue);
	}

	/**
	 * Set the value of the text object.
	 */
	set value(value) {
		if (typeof value !== "string")
			throw new Error(
				`Provided text value "${value}" is not of type "string".`
			);

		this.__rawValue = value;
	}

	get renderable() {
		const { wrap, value, maxWidth, style, fontWeight } = this;

		return Text.asPixelMesh(
			value,
			maxWidth,
			wrap,
			style.color,
			style.backgroundColor,
			fontWeight
		);
	}

	/**
	 * Get just the renderable `PixelMesh` portion of a `Text` instance.
	 * @param {string} config.value The text to display. (use `"\n"` for newlines)
	 * @param {number} config.maxWidth The maximum width of the `Text`. Defaults to `Renderer.width`.
	 * @param {boolean} config.wrap Whether to wrap the text if it overflows the screen.
	 * @param {string} config.color Option text color.
	 * @param {?string} config.backgroundColor Optional background color.
	 * @param {?string} config.fontWeight Optional font weight.
	 * @returns {PixelMesh} The generated `PixelMesh`.
	 */
	static asPixelMesh(
		value,
		maxWidth,
		wrap,
		color,
		backgroundColor,
		fontWeight
	) {
		const lines = value.split("\n");

		const data = [];

		for (const line of lines) {
			if (!wrap && line.length > maxWidth) {
				// If wrap is false and line length exceeds maxWidth, ignore overflowing text
				data.push(
					line === ""
						? []
						: line
								.substring(0, maxWidth)
								.split("")
								.map(
									(char) =>
										new Pixel({
											value: char,
											color,
											backgroundColor,
											fontWeight,
										})
								)
				);
			} else {
				// Handle wrapping or normal behavior
				let currentLine = [];
				let currentLength = 0;

				if (line === "") data.push([]);
				else
					for (const char of line) {
						if (currentLength >= maxWidth) {
							if (wrap) {
								// If wrap is true, move to the next line
								data.push(
									currentLine.map(
										(char) =>
											new Pixel({
												value: char,
												color,
												backgroundColor,
												fontWeight,
											})
									)
								);
								currentLine = [];
								currentLength = 0;
							} else {
								// If wrap is false, break the loop as we ignore overflow
								break;
							}
						}

						currentLine.push(char);
						currentLength++;
					}

				// Push the remaining characters in the current line
				if (currentLine.length > 0) {
					data.push(
						currentLine.map(
							(char) =>
								new Pixel({
									value: char,
									color,
									backgroundColor,
									fontWeight,
								})
						)
					);
				}
			}
		}

		return new PixelMesh({ data });
	}

	set renderable(_) {
		return;
	}
}

export default Text;
