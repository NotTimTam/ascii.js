import GameObject from "../core/GameObject.js";
import { Pixel, PixelMesh } from "../engine/renderer.js";
import { displayArray } from "../util/data.js";
import Box from "./Box.js";
import Text from "./Text.js";

class Menu extends GameObject {
	/**
	 * A box that can be rendered on screen.
	 * @param {Runtime} runtime The main runtime object.
	 * @param {*} config The `Box`'s config object.
	 * @param {number} config.x This `Box` object's x-coordinate.
	 * @param {number} config.y This `Box` object's y-coordinate.
	 * @param {*} config.options An object of key value pairs, the values representing option labels, and the keys being what is returned when an object is selected.
	 * @param {function} config.callback A callback function that is called when a menu option is selected. Passed the key of the selected option.
	 */
	constructor(runtime, config) {
		const {
			x,
			y,
			options,
			callback = (option) => console.log(option),
		} = config;
		super(runtime, x, y);

		this.options = options;
		this.callback = callback;

		this.index = 0;

		this.longestOption = this.determineLongestOption();

		runtime.inputManager.addEventListener(this.handleInput.bind(this));
	}

	handleInput(event) {
		if (event.type === "keydown") {
			const {
				keys: { up, down, enter },
			} = event;

			if (down) this.index++;
			if (up) this.index--;
			if (enter) this.callback(Object.keys(this.options)[this.index]);

			const topIndex = Object.keys(this.options).length - 1;

			if (this.index < 0) this.index = topIndex;
			if (this.index > topIndex) this.index = 0;
		}
	}

	get width() {
		return Math.round(this.longestOption + 2);
	}

	get height() {
		return Math.round(Object.keys(this.options).length + 2);
	}

	determineLongestOption() {
		const { options } = this;

		let longestOption = 0;

		Object.values(options).forEach((value, index) => {
			const optionDisplay = `> ${value}`;
			if (optionDisplay.length > longestOption)
				longestOption = optionDisplay.length;
		});

		return longestOption;
	}

	get renderable() {
		const {
			options,
			runtime,
			runtime: {
				renderer: { width, height },
			},
		} = this;

		const maxWidth = width - 2;

		const data = [];

		if (options)
			Object.values(options).forEach((value, index) => {
				const text = new Text(runtime, {
					x: 0,
					y: 0,
					value: `> ${value}`
						.padEnd(this.longestOption, " ")
						.slice(0, maxWidth),
					wrap: false,
					color: index === this.index ? "#000000" : "#ffffff",
					backgroundColor:
						index === this.index ? "#ffffff" : "#000000",
					fontWeight: index === this.index ? "800" : "400",
				}).renderable.data[0];

				data.push(text);
			});

		const box = new Box(runtime, {
			x: 0,
			y: 0,
			width: this.longestOption + 2,
			height: Object.keys(options).length + 2,
		}).renderable.data;

		data.unshift(box[0]);
		data.push(box[box.length - 1]);

		for (let column = 1; column < box.length - 1; column++) {
			data[column].unshift(box[column][0]);
			data[column].push(box[column][box[column].length - 1]);
		}

		return new PixelMesh(data);
	}
}

export default Menu;
