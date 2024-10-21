import GameObject from "../core/GameObject.js";
import Pixel, { PixelMesh } from "../core/Pixel.js";
import { isPlainObject } from "../util/data.js";

class Text extends GameObject {
	/**
	 * A string of text that can be rendered on screen.
	 * @param {Scene} scene The scene this Object is a part of.
	 * @param {Object} config The `Text`'s config object.
	 * @param {number} config.x This `Text` object's x-coordinate.
	 * @param {number} config.y This `Text` object's y-coordinate.
	 * @param {number} config.maxWidth The maximum width of the `Text`. Defaults to `Renderer.width`.
	 * @param {string} config.value The text to display. (use `"\n"` for newlines)
	 * @param {boolean} config.wrap Whether to wrap the text if it overflows the screen.
	 * @param {string} config.color Option text color.
	 * @param {?string} config.backgroundColor Optional background color.
	 * @param {?string} config.fontWeight Optional font weight.
	 * @param {string} config.layer The label of the layer to start the `Text` on.
	 */
	constructor(scene, config) {
		if (!isPlainObject(config))
			throw new TypeError(
				"Expected a plain object for Text constructor config parameter."
			);

		const {
			value = "Hello, world!",
			wrap = true,
			color = "#ffffff",
			backgroundColor,
			fontWeight = 400,
			maxWidth = scene.runtime.renderer.width,
		} = config;
		super(scene, config);

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

		this.__rawValue = value;
		this.wrap = wrap;
		this.color = color;
		this.backgroundColor = backgroundColor;
		this.fontWeight = fontWeight;
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
		const { wrap, value, maxWidth, color, backgroundColor, fontWeight } =
			this;

		return Text.asPixelMesh(
			value,
			maxWidth,
			wrap,
			color,
			backgroundColor,
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
					line
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
