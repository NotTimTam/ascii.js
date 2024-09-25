import Pixel, { PixelMesh } from "../core/Pixel.js";
import Scene from "../engine/Scene.js";

class TextInput extends Text {
	/**
	 * A string of text that can be rendered on screen.
	 * @param {Scene} scene The scene this Object is a part of.
	 * @param {Object} config The `Text`'s config object.
	 * @param {number} config.x This `Text` object's x-coordinate.
	 * @param {number} config.y This `Text` object's y-coordinate.
	 * @param {string} config.value The text to display. (use `"\n"` for newlines)
	 * @param {string} config.color Option text color.
	 * @param {string} config.backgroundColor Optional background color.
	 * @param {string} config.fontWeight Optional font weight.
	 * @param {string} config.autoFocus Automatically focus on element once it is instantiated.
	 */
	constructor(scene, config) {
		config.wrap = false;

		super(scene, config);

		this.focused = Boolean(config.autoFocus);

		scene.inputManager.onClick(this, this.onClick.bind(this));
	}

	/**
	 * Listens to input events.
	 */
	onClick(event) {
		console.log(event);
	}

	get renderable() {
		const {
			wrap,
			value,
			scene: {
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

export default TextInput;
