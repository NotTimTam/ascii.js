import { isPlainObject } from "../util/data.js";

export class PixelMesh {
	/**
	 * A pixel mesh stores a 2-dimensional array of `Pixels`.
	 * @param {Object} config The config for this `PixelMesh` instance.
	 * @param {Array<Pixel>} config.data The frame's 2-dimensional (array of row arrays of `Pixels`) (left-to-right, top-to-bottom) data array.
	 * @param {Array<number>} config.origin An array of display offsets to apply when rendering this pixel.
	 */
	constructor(config) {
		if (!isPlainObject(config))
			throw new TypeError(
				"Expected a plain object for PixelMesh constructor config parameter."
			);

		const { data, origin } = config;

		if (!data || !(data instanceof Array))
			throw new TypeError(
				`Expected an array for "PixelMesh" config.data property.`
			);

		this.data = data;
		this.origin = origin;
	}

	get origin() {
		return this.__rawOrigin;
	}

	set origin(arr) {
		if (arr) {
			if (!(arr instanceof Array))
				throw new SyntaxError(
					'Invalid origin provided to "PixelMesh". Expected: [<xOffset>, <yOffset>]'
				);

			if (!Number.isInteger(arr[0]) || !Number.isInteger(arr[0]))
				throw new SyntaxError(
					"PixelMesh origin must be an array of integers."
				);
		}

		this.__rawOrigin = arr;
	}

	/**
	 * Get the `PixelMesh`'s width.
	 */
	get width() {
		let length = -1;

		for (const row of this.data.filter((row) => row))
			if (row.length > length) length = row.length;

		return length === -1 ? undefined : length;
	}

	/**
	 * Get the `PixelMesh`'s height.
	 */
	get height() {
		return this.data.length;
	}
}

class Pixel {
	/**
	 * Pixel data for a frame coordinate.
	 * @param {Object} config The pixel config object.
	 * @param {string} config.value The text-value of this spixel.
	 * @param {string} config.color The CSS color value of this pixel.
	 * @param {string|number} config.fontWeight The CSS font weight value of this pixel.
	 * @param {string} config.backgroundColor An optional background color for the pixel.
	 * @param {boolean} config.solid Whether or not this pixel is solid. This parameter is used for collision detection.
	 * @param {Array<number>} config.origin An array of display offsets to apply when rendering this pixel.
	 */
	constructor(config) {
		if (!isPlainObject(config))
			throw new TypeError(
				"Expected a plain object for Pixel constructor config parameter."
			);

		const {
			value,
			color = "#ffffff",
			fontWeight = "normal",
			backgroundColor,
			solid = false,
			origin,
		} = config;

		if (typeof value !== "string" || value.length !== 1)
			throw new Error(
				"The value of this pixel can only be a 1-character long string."
			);

		if (origin && !(origin instanceof Array))
			throw new Error(
				'Invalid origin provided to "Pixel". Expected: [<xOffset>, <yOffset>]'
			);

		this.value = value;
		this.color = color;
		this.fontWeight = fontWeight;
		this.backgroundColor = backgroundColor;
		this.solid = solid;
		this.origin = origin;
	}

	get origin() {
		return this.__rawOrigin;
	}

	set origin(arr) {
		if (arr) {
			if (!(arr instanceof Array))
				throw new SyntaxError(
					'Invalid origin provided to "Pixel". Expected: [<xOffset>, <yOffset>]'
				);

			if (!Number.isInteger(arr[0]) || !Number.isInteger(arr[0]))
				throw new SyntaxError(
					"Pixel origin must be an array of integers."
				);
		}

		this.__rawOrigin = arr;
	}

	/**
	 * Create a `Pixel` object from a string.
	 * @param {string} string The string to convert to a `Pixel`.
	 * @returns {Pixel} the newly created `Pixel` object.
	 */
	static fromString = (string) => new Pixel({ value: string });
}

export default Pixel;
