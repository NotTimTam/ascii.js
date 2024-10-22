import Pixel, { PixelMesh } from "../core/Pixel.js";
import Renderer from "./Renderer.js";

class Frame {
	/**
	 * A display frame.
	 * @param {Array<Pixel>} data The frame's 1-dimensional (left-to-right, top-to-bottom) data array.
	 * Any index after `Screen Width * Screen Height` will not be displayed, no max size is enforced.
	 */
	constructor(data) {
		this.data = data;
	}

	/**
	 * Convert a string to a frame.
	 * @param {string} string The string to convert.
	 * @returns {Frame} the generated Frame.
	 */
	static fromString = (string) =>
		new Frame(string.split("").map((item) => new Pixel({ value: item })));

	/**
	 * Convert a 2D array of `Pixel`s to a Frame.
	 * @param {Pixel[][]} array The array to convert.
	 * @returns {Frame} the generated Frame.
	 */
	static from2DArray = (array) => new Frame(array.flat());
}

export default Frame;
