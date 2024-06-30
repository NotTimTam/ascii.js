import GameObject from "../core/GameObject.js";
import { Pixel, PixelMesh } from "../engine/renderer.js";

class Text extends GameObject {
	/**
	 * A string of text that can be rendered on screen.
	 * @param {Runtime} runtime The main runtime object.
	 * @param {number} x This `Text` object's x-coordinate.
	 * @param {number} y This `Text` object's y-coordinate.
	 * @param {string} text The text to display. (use `"\n"` for newlines)
	 * @param {boolean} wrap Whether to wrap the text if it overflows the screen.
	 */
	constructor(runtime, x, y, text = "Hello, world!", wrap = true) {
		super(runtime, x, y);

		this.text = text;
		this.wrap = wrap;
	}

	get renderable() {
		const { wrap, text } = this;

		const lines = text.split("\n");

		if (lines.length > 1 && wrap)
			throw new Error(
				"Text object has wrap turned on, but multi-line text cannot wrap."
			);

		const data = [];

		for (const line of lines) {
			data.push(line.split("").map((char) => new Pixel({ value: char })));
		}

		return new PixelMesh(data);
	}
}

export default Text;
