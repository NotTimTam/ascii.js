import GameObject from "../core/GameObject.js";
import { PixelMesh } from "../core/Pixel.js";
import Scene from "../engine/Scene.js";
import { isPlainObject } from "../util/data.js";
import Box from "./Box.js";
import Text from "./Text.js";

class Menu extends GameObject {
	/**
	 * A list of user input options that can be rendered on screen.
	 * @param {Scene} scene The scene this Object is a part of.
	 * @param {Object} config The `Menu`'s config object.
	 * @param {number} config.x This `Menu` object's x-coordinate.
	 * @param {number} config.y This `Menu` object's y-coordinate.
	 * @param {Object} config.options An object of key value pairs, the values representing option labels, and the keys being what is returned when an object is selected.
	 * @param {function} config.callback A callback function that is called when a menu option is selected. Passed the key of the selected option.
	 * @param {string} config.title Optional menu title.
	 * @param {string} config.layer The label of the layer to start the `Menu` on.
	 */
	constructor(scene, config) {
		if (!isPlainObject(config))
			throw new TypeError(
				"Expected a plain object for Menu constructor config parameter."
			);

		const {
			x,
			y,
			title,
			options,
			callback = (option) => console.log(option),
			layer,
		} = config;
		super(scene, x, y, layer);

		this.options = options;
		this.callback = callback;

		this.index = 0;

		this.longestOption = this.determineLongestOption();

		if (title && typeof title !== "string")
			throw new Error(
				`Provided menu title "${title}" is not of type "string".`
			);

		this.title = title;

		scene.inputManager.addEventListener("all", this.handleInput.bind(this));

		this.__inputMode = "keyboard";
	}

	handleInput(event) {
		if (!this.isOnScreen || !this.visible) return;

		if (event.type === "keydown") {
			this.__inputMode = "keyboard";

			const {
				keys: { up, down, enter },
			} = event;

			if (down) this.index++;
			if (up) this.index--;
			if (enter) this.callback(Object.keys(this.options)[this.index]);

			const topIndex = Object.keys(this.options).length - 1;

			if (this.index < 0) this.index = topIndex;
			if (this.index > topIndex) this.index = 0;
		} else if (event.type === "mousemove") {
			const { onLayer } = event;

			const [x, y] = onLayer[this.layer.label];

			const [menuX, menuY] = [x - this.x, y - this.y];

			const mouseMenuIndex = Math.floor(menuY - 1.5);

			if (
				mouseMenuIndex >= 0 &&
				mouseMenuIndex < Object.keys(this.options).length &&
				menuX >= 0 &&
				menuX <= this.width
			) {
				this.__inputMode = "mouse";
				this.index = mouseMenuIndex;
			}
		} else if (
			event.type === "mousedown" &&
			this.__inputMode === "mouse" &&
			this.index >= 0 &&
			this.index < Object.keys(this.options).length
		) {
			this.callback(Object.keys(this.options)[this.index]);
		}
	}

	get width() {
		const {
			runtime: {
				renderer: { width },
			},
		} = this;

		const optionsWidth = Math.round(this.longestOption + 2);
		const titleWidth = this.title ? this.title.length + 4 : 0;

		return Math.max(optionsWidth, titleWidth, width / 4);
	}

	get height() {
		const {
			runtime: {
				renderer: { height },
			},
		} = this;

		return Math.min(
			Math.round(Object.keys(this.options).length + 4),
			height
		);
	}

	determineLongestOption() {
		const { options } = this;

		let longestOption = 0;

		Object.values(options).forEach((value) => {
			const optionDisplay = value;
			if (optionDisplay.length > longestOption)
				longestOption = optionDisplay.length;
		});

		return longestOption;
	}

	get renderable() {
		const {
			options,
			scene,
			runtime: {
				renderer: { width, height },
			},
			title,
		} = this;

		const maxWidth = width - 2;

		const data = [];

		if (options) {
			const optionValues = Object.values(options);

			let displayOptions = optionValues;
			if (optionValues.length + 4 > height) {
				const toDisplay = Math.min(optionValues.length, height - 4);

				if (this.index < Math.floor(toDisplay / 2))
					displayOptions = optionValues.slice(0, toDisplay);
				else if (
					this.index >
					optionValues.length - Math.ceil(toDisplay / 2)
				)
					displayOptions = optionValues.slice(
						optionValues.length - toDisplay
					);
				else if (this.index >= Math.floor(toDisplay / 2))
					displayOptions = optionValues.slice(
						this.index - Math.floor(toDisplay / 2),
						this.index + Math.ceil(toDisplay / 2)
					);
				// displayOptions = optionValues.slice(startIndex, endIndex + 1);
			}

			displayOptions.forEach((value) => {
				if (!value || typeof value !== "string") return;

				const str = value.slice(0, maxWidth);
				const remainingSpace = this.width - 1 - str.length;

				const index = optionValues.indexOf(value);

				const text = new Text(scene, {
					x: 0,
					y: 0,
					value: `${" ".repeat(
						Math.floor(remainingSpace) / 2
					)}${str}${" ".repeat(Math.ceil(remainingSpace) / 2)}`,
					wrap: false,
					// color: index === this.index ? "#000000" : "#ffffff",
					// backgroundColor:
					// 	index === this.index ? "#ffffff" : "#000000",
					// fontWeight: index === this.index ? "800" : "400",
					color: index === this.index ? "#ffffff" : "grey",
					fontWeight: index === this.index ? "800" : "100",
					backgroundColor: "#000000",
				}).renderable.data[0];

				data.push(text);
			});
		}

		const box = new Box(scene, {
			x: 0,
			y: 0,
			width: this.width,
			height: Object.keys(options).length + 4,
			backgroundColor: "#000000",
		}).renderable.data;

		data.unshift(box[1]); // Add top padding.
		data.unshift(box[0]); // Add top bar.
		data.push(box[1]); // Add bottom padding.
		data.push(box[box.length - 1]); // Add bottom bar.

		for (let column = 2; column < data.length - 2; column++) {
			data[column].unshift(box[column][0]);
			data[column][this.width - 1] = box[column][box[column].length - 1];
		}

		if (title) {
			const titleText = new Text(scene, {
				x: 0,
				y: 0,
				value: title.slice(0, maxWidth - 2),
				wrap: false,
				color: "#ffffff",
				backgroundColor: "#000000",
			}).renderable.data[0];

			const startIndex = Math.floor((this.width - titleText.length) / 2);

			for (let i = 0; i < titleText.length; i++) {
				data[0][i + startIndex] = titleText[i];
			}
		}

		return new PixelMesh({ data });
	}

	set renderable(_) {
		return;
	}
}

export default Menu;
