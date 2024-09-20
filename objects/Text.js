import GameObject from "../core/GameObject.js";
import Pixel, { PixelMesh } from "../core/Pixel.js";

class Text extends GameObject {
	/**
	 * A string of text that can be rendered on screen.
	 * @param {Runtime} runtime The main runtime object.
	 * @param {Object} config The `Text`'s config object.
	 * @param {number} config.x This `Text` object's x-coordinate.
	 * @param {number} config.y This `Text` object's y-coordinate.
	 * @param {string} config.value The text to display. (use `"\n"` for newlines)
	 * @param {boolean} config.wrap Whether to wrap the text if it overflows the screen.
	 * @param {string} config.color Option text color.
	 * @param {string} config.backgroundColor Optional background color.
	 * @param {string} config.fontWeight Optional font weight.
	 */
	constructor(runtime, config) {
		const {
			x,
			y,
			value = "Hello, world!",
			wrap = true,
			color = "#ffffff",
			backgroundColor,
			fontWeight = 400,
		} = config;
		super(runtime, x, y);

		if (typeof value !== "string")
			throw new Error(
				`Provided text value "${value}" is not of type "string".`
			);

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
		this.__rawValue = value;
	}

	get renderable() {
		const {
			wrap,
			value,
			runtime: {
				renderer: { width },
			},
			color,
			backgroundColor,
			fontWeight,
		} = this;

		const lines = value.split("\n");

		const data = [];

		for (const line of lines) {
			if (!wrap && line.length > width) {
				// If wrap is false and line length exceeds width, ignore overflowing text
				data.push(
					line
						.substring(0, width)
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
					if (currentLength >= width) {
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
}

export default Text;
