import GameObject from "../core/GameObject.js";
import Pixel, { PixelMesh } from "../core/Pixel.js";
import { displayArray } from "../util/data.js";

// ┌─┬┐  ╔═╦╗  ╓─╥╖  ╒═╤╕
// │ ││  ║ ║║  ║ ║║  │ ││
// ├─┼┤  ╠═╬╣  ╟─╫╢  ╞═╪╡
// └─┴┘  ╚═╩╝  ╙─╨╜  ╘═╧╛

const lineSource = {
	line: [
		["┌", "─", "┐"],
		["│", " ", "│"],
		["└", "─", "┘"],
	],
	double: [
		["╔", "═", "╗"],
		["║", " ", "║"],
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
	 * @param {string} config.backgroundColor Optional background color.
	 * @param {string} config.style The box line style. `"line" || "double"`
	 */
	constructor(scene, config) {
		const {
			x,
			y,
			width,
			height,
			color = "#ffffff",
			backgroundColor,
			style = "double",
		} = config;
		super(scene, x, y);

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
					new Pixel({
						value: char,
						color,
						backgroundColor,
						solid: false,
					})
				);
			}

			data.push(row);
		}

		return new PixelMesh({ data });
	}

	set renderable(_) {
		return;
	}
}

export default Box;
