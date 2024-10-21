import GameObject from "../core/GameObject.js";
import Pixel, { PixelMesh } from "../core/Pixel.js";
import { displayArray, isPlainObject } from "../util/data.js";

// ┌─┬┐  ╔═╦╗  ╓─╥╖  ╒═╤╕
// │ ││  ║ ║║  ║ ║║  │ ││
// ├─┼┤  ╠═╬╣  ╟─╫╢  ╞═╪╡
// └─┴┘  ╚═╩╝  ╙─╨╜  ╘═╧╛

const lineSource = {
	line: [
		["┌", "─", "┐"],
		["│", null, "│"],
		["└", "─", "┘"],
	],
	double: [
		["╔", "═", "╗"],
		["║", null, "║"],
		["╚", "═", "╝"],
	],
};

class Box extends GameObject {
	/**
	 * A box that can be rendered on screen.
	 * @param {Scene} scene The scene this Object is a part of.
	 * @param {Object} config The `Box`'s config object.
	 * @param {number} config.x This `Box` object's x-coordinate.
	 * @param {number} config.y This `Box` object's y-coordinate.
	 * @param {number} config.width This `Box` object's width.
	 * @param {number} config.height This `Box` object's height.
	 * @param {string} config.color Option Box color.
	 * @param {?string} config.backgroundColor Optional background color.
	 * @param {string} config.style The box line style. `"line" || "double"`
	 * @param {string} config.layer The label of the layer to start the `Box` on.
	 */
	constructor(scene, config) {
		if (!isPlainObject(config))
			throw new TypeError(
				"Expected a plain object for Box constructor config parameter."
			);

		const {
			width,
			height,
			color = "#ffffff",
			backgroundColor,
			style = "double",
		} = config;
		super(scene, config);

		this.__rawWidth = width;
		this.__rawHeight = height;
		this.color = color;

		this.backgroundColor = backgroundColor;

		if (!Object.keys(lineSource).includes(style))
			throw new Error(
				`Invalid box style "${style}" provided. Must be one of: ${displayArray(
					Object.keys(lineSource)
				)}`
			);

		this.style = style;
	}

	get width() {
		return Math.round(this.__rawWidth);
	}
	set width(n) {
		if (typeof n !== "number")
			throw new Error("Box width value must be of type 'number'.");
		this.__rawWidth = n;
	}

	get height() {
		return Math.round(this.__rawHeight);
	}
	set height(n) {
		if (typeof n !== "number")
			throw new Error("Box height value must be of type 'number'.");
		this.__rawHeight = n;
	}

	get renderable() {
		const { width, height, color, backgroundColor, style } = this;
		return Box.asPixelMesh(width, height, color, backgroundColor, style);
	}

	set renderable(_) {
		return;
	}

	/**
	 * Get just the renderable `PixelMesh` portion of a `Box` instance.
	 * @param {number} width This `Box` object's width.
	 * @param {number} height This `Box` object's height.
	 * @param {string} color Option Box color.
	 * @param {?string} backgroundColor Optional background color.
	 * @param {string} style The box line style. `"line" || "double"`
	 * @returns {PixelMesh} The generated `PixelMesh`.
	 */
	static asPixelMesh(width, height, color, backgroundColor, style) {
		const styleSet = lineSource[style];

		const data = [];

		for (let y = 0; y < height; y++) {
			const row = [];

			for (let x = 0; x < width; x++) {
				let inX = 0,
					inY = 0;

				if (x === width - 1) inX = 2;
				else if (x > 0) inX = 1;

				if (y === height - 1) inY = 2;
				else if (y > 0) inY = 1;

				let char = styleSet[inY][inX];

				row.push(
					char
						? new Pixel({
								value: char,
								color,
								backgroundColor,
								solid: false,
						  })
						: char
				);
			}

			data.push(row);
		}

		return new PixelMesh({ data });
	}
}

export default Box;
