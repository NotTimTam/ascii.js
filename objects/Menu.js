import UIObject from "../core/UIObject.js";
import Pixel, { PixelMesh } from "../core/Pixel.js";
import Scene from "../engine/Scene.js";
import { wrapString } from "../util/data.js";
import { clamp } from "../util/math.js";
import Box from "./Box.js";

class Item {
	get renderable() {
		return Pixel.fromString(" ");
	}

	get index() {
		return this.menu.items.indexOf(this);
	}

	onLoad() {}
	onKeyDown() {}
	onClick() {}
	onGamepadButton() {}
	onMouseMove() {}
}

class Button extends Item {
	/**
	 * A string of text that triggers an event when clicked.
	 * @param {Object} config The `Button`'s config object.
	 * @param {string} config.label The `Button`'s display label.
	 * @param {function} config.callback The function to call when this item is clicked/activated. This callback is passed the `Menu` instance as an argument.
	 * @param {boolean} config.wrap Whether or not to wrap the text if it overflows the container. Will break words. Default `false`.
	 */
	constructor(config) {
		super();

		const { label, callback, wrap } = config;

		if (typeof label !== "string")
			throw new TypeError(
				"Menu.Button config.label property must be a string."
			);

		this.label = label && label.trim();
		this.callback = callback;
		this.wrap = Boolean(wrap);
	}

	onKeyDown(event) {
		if (event.keys.enter) this.callback && this.callback(this.menu);
	}
	onGamepadButton(event) {
		if (event.buttons.a) this.callback && this.callback(this.menu);
	}
	onClick() {
		this.callback && this.callback(this.menu);
	}

	get renderable() {
		const {
			menu: {
				index: activeIndex,
				availableContentSpace: [width],
			},
			index,
			label,
			wrap,
		} = this;

		const display = PixelMesh.fromString(
			wrap ? wrapString(label, width, true) : label.slice(0, width)
		);

		if (activeIndex === index) display.setColor("white");
		else display.setColor("grey");

		return display;
	}
}

class Slider extends Item {
	/**
	 * A slider that allows value selection.
	 * @param {Object} config The `Slider`'s config object.
	 * @param {?string} config.label An optional `Slider` display label.
	 * @param {boolean} config.showValue Whether to show the value of the `Slider` after it. Default: `false`.
	 * @param {boolean} config.showPercentage Whether to show the value (in percentage format) of the `Slider` after it. Default: `true`.
	 * @param {number} config.value The starting value of the `Slider`.
	 * @param {number} config.min The minimum value for the `Slider`.
	 * @param {number} config.max The maximum value for the `Slider`.
	 * @param {number} config.step The amount the value will change by each input.
	 * @param {function} config.onChange The function to call when the value of this `Slider` changes.
	 * @param {function} config.callback The function to call when "enter" is pressed on the `Slider`. This callback is passed the current `Menu.Slider` value as an argument.
	 */
	constructor(config) {
		super();

		const {
			label,
			value = 0,
			min = 0,
			max = 100,
			step = 1,
			onChange,
			callback,
			showValue = true,
			showPercentage = true,
		} = config;

		if (label && typeof label !== "string")
			throw new TypeError(
				"Menu.Button config.label property must be a string."
			);
		if (typeof value !== "number")
			throw new TypeError(
				`Menu.Slider config.value property must be a number.`
			);
		if (typeof min !== "number")
			throw new TypeError(
				`Menu.Slider config.min property must be a number.`
			);
		if (typeof max !== "number")
			throw new TypeError(
				`Menu.Slider max.value property must be a number.`
			);
		if (typeof step !== "number")
			throw new TypeError(
				`Menu.Slider config.step property must be a number.`
			);
		if (min > max)
			throw new Error(
				"Menu.Slider config.min cannot be greater than config.max."
			);

		this.showValue = Boolean(showValue);
		this.showPercentage = Boolean(showPercentage);

		this.label = label && label.trim();
		this.min = min;
		this.max = max;
		this.value = value;
		this.step = step;
		this.callback = callback;
		this.onChange = onChange;
	}

	/**
	 * Get the value of this `Slider`.
	 */
	get value() {
		return this.__rawValue;
	}

	set value(n) {
		n = clamp(n, this.min, this.max);

		let changed = n !== this.__rawValue;
		this.__rawValue = n;

		this.onChange && changed && this.onChange(this.value);
	}

	snapToStep(n) {
		return Math.round((n - this.min) / this.step) * this.step + this.min;
	}

	onKeyDown(event) {
		const {
			keys: { enter, left, right },
		} = event;

		if (enter) this.callback(this.value);
		if (left) this.value -= this.step;
		if (right) this.value += this.step;
	}
	onGamepadButton(event) {
		const {
			buttons: { a, left, right },
		} = event;

		if (a) this.callback(this.value);
		if (left) this.value -= this.step;
		if (right) this.value += this.step;
	}

	__positionByMouse(event) {
		let [x] = event.onLayer[this.menu.layerLabel];

		x -= Menu.borderWidth + Menu.horizontalSpacing;

		if (this.label) x -= this.label.length + 0.5;

		const value = this.snapToStep(
			clamp((x / this.sliderWidth) * this.max, this.min, this.max)
		);

		this.value = value;
	}

	onClick(event) {
		this.__positionByMouse(event);
		this.callback(this.value);
	}

	onMouseMove(event) {
		if (!event.buttons.left) return;

		this.__positionByMouse(event);
	}

	/**
	 * Get the width of the slider portion of the renderable.
	 */
	get sliderWidth() {
		const potentialInputs = (this.max - this.min) / this.step + 1;

		if (potentialInputs <= 10) return Math.round(potentialInputs);
		else
			return clamp(
				potentialInputs,
				10,
				this.menu.runtime.renderer.width / 4
			);
	}

	get renderable() {
		const {
			menu: { index: activeIndex },
			index,
			value,
			min,
			max,
			step,
			label,
			showValue,
			showPercentage,
			sliderWidth,
		} = this;

		const active = activeIndex === index;

		let data = [];

		if (label) {
			const labelMesh = PixelMesh.fromString(this.label + " ");
			if (!active) labelMesh.setColor("grey");
			data.push(labelMesh.data[0]);
		}

		const sliderWidthWithoutThumb = sliderWidth - 1;

		const positionOnSlider = Math.floor(
			((value - min) / (max - min)) * sliderWidthWithoutThumb
		);

		const track = new Pixel({
			value: "─",
			color: active ? "white" : "grey",
		});

		const [leftSide, rightSide] = [
			new Array(positionOnSlider).fill(track),
			new Array(sliderWidthWithoutThumb - positionOnSlider).fill(track),
		];

		const sliderMesh = new PixelMesh({
			data: [
				...leftSide,
				new Pixel({ value: "█", color: active ? "green" : "grey" }),
				...rightSide,
			],
		});

		data[0] = [...data[0], ...sliderMesh.data];

		if (showValue) {
			const valueMesh = PixelMesh.fromString(
				" " +
					String(value).padEnd(
						Math.max(
							String(max - max / step + (step < 1 ? step : 0))
								.length - 1,
							1
						),
						" "
					)
			);
			if (!active) valueMesh.setColor("grey");
			data[0].push(...valueMesh.data[0]);
		}

		if (showValue && showPercentage)
			data[0].push(
				null,
				new Pixel({ value: "-", color: active ? "white" : "grey" })
			);

		if (showPercentage) {
			const percentageMesh = PixelMesh.fromString(
				(" " + Math.round((value / max) * 100) + "%").padEnd(5, " ")
			);
			if (!active) percentageMesh.setColor("grey");
			data[0].push(...percentageMesh.data[0]);
		}

		return new PixelMesh({ data });
	}
}

class Toggle extends Item {
	/**
	 * A checkbox that can be toggled.
	 * @param {Object} config The `Toggle`'s config object.
	 * @param {string} config.label The `Toggle`'s display label.
	 * @param {boolean} config.checked The initial status of the `Toggle`. Default: `false`.
	 * @param {boolean} config.prepend Whether to put the checkbox icon at the start or end of the label. Default: `true`.
	 * @param {function} config.callback The function to call when this item is toggled. This callback is passed the current `checked` state as an argument.
	 */
	constructor(config) {
		super();

		const { label, callback, checked = false, prepend = true } = config;

		if (typeof label !== "string")
			throw new TypeError(
				"Menu.Button config.label property must be a string."
			);

		this.label = label && label.trim();
		this.prepend = Boolean(prepend);
		this.checked = Boolean(checked);
		this.callback = callback;
	}

	get checked() {
		return this.__rawChecked;
	}

	set checked(bool) {
		this.__rawChecked = Boolean(bool);
	}

	onKeyDown(event) {
		if (event.keys.enter) this.checked = !this.checked;

		this.callback(this.checked);
	}
	onClick() {
		this.checked = !this.checked;

		this.callback(this.checked);
	}
	onGamepadButton(event) {
		if (event.buttons.a) this.checked = !this.checked;

		this.callback(this.checked);
	}

	get renderable() {
		const {
			menu: { index: activeIndex },
			index,
			checked,
			prepend,
		} = this;

		const icon = checked ? "☑" : "☐";

		const display = PixelMesh.fromString(
			`${prepend ? icon + " " : ""}${this.label}${
				!prepend ? " " + icon : ""
			}`
		);

		if (activeIndex === index) display.setColor("white");
		else display.setColor("grey");

		return display;
	}
}

/**
 * Configuration data for the `Menu` class.
 * @typedef {Object} MenuConfig
 * @property {Object} items An array of `Menu.Item` instances. You can extend the `Menu.Item` class to make your own items.
 * @property {?string} title Optional menu title.
 * @property {boolean} alignCenter Whether or not to align the content to the center of the menu. Default `true`.
 * @property {boolean} border Whether or not to create a border around the menu. Default `true`.
 * @property {string} layer The label of the layer to start the `Menu` on.
 * @property {boolean} deleteOnBlur Whether to delete the menu when it becomes unfocused. Default `false`. **NOTE:** If `config.autoFocus` is set to false, the `Menu` will be deleted immediately!
 * @property {?number} gamepad An optional number indicating the gamepad (0-based index) this menu should accept input from. Set to `-1` to accept input from all gamepads.
 */

class Menu extends UIObject {
	static Item = Item;
	static Button = Button;
	static Slider = Slider;
	static Toggle = Toggle;

	static horizontalSpacing = 1;
	static borderWidth = 1;

	/**
	 * A menu of various items that can be rendered on screen.
	 * @param {Scene} scene The scene this Object is a part of.
	 * @param {import("../core/UIObject.js").UIObjectConfig & MenuConfig} config The `Menu`'s config object.
	 */
	constructor(scene, config) {
		super(scene, config);

		const {
			title,
			items = [],
			gamepad,
			alignCenter = true,
			border = true,
		} = config;

		this.alignCenter = Boolean(alignCenter);
		this.border = Boolean(border);

		if (!(items instanceof Array))
			throw new TypeError(
				`"Menu" constructor config.items object should be an array of "Menu.Item" instances.`
			);

		this.items = items;

		this.__rawIndex = 0;

		if (title && typeof title !== "string")
			throw new Error(
				`Provided menu title "${title}" is not of type "string".`
			);

		this.title = title;

		this.gamepad = gamepad;

		scene.inputManager.addEventListener(
			"keydown",
			this.__onKeyDown.bind(this)
		);

		scene.inputManager.addEventListener(
			"mousemove",
			this.__onMouseMove.bind(this)
		);

		scene.inputManager.addEventListener("click", this.__onClick.bind(this));

		this.__inputMode = "keyboard";
	}

	/**
	 * Get the menu items instantiated in this `Menu`.
	 */
	get items() {
		return this.__rawItems;
	}

	/**
	 * Set the menu items instantiated in this `Menu`.
	 */
	set items(arr) {
		for (const item of arr) {
			if (!(item instanceof Menu.Item))
				throw new TypeError(
					'Each object in the Menu.items array must be an instance of "Menu.Item".'
				);

			item.menu = this;

			this.scene.runtime.__runOnLoad(item);
		}

		this.__rawItems = arr;
	}

	/**
	 * Get the index of the active gamepad.
	 */
	get gamepad() {
		return this.__rawGamepad;
	}

	/**
	 * Set the index of the gamepad whose inputs should be listened to.
	 */
	set gamepad(n) {
		if (typeof n !== "number") {
			this.__rawGamepad = undefined;

			this.scene.inputManager.removeEventListener(
				"gamepadbuttonpressed",
				this.__handleGamepadButtonPressed.bind(this)
			);

			return;
		}

		if (typeof n !== "number" || !Number.isInteger(n) || n < -1 || n > 3)
			throw new Error(
				`Menu gamepad property should be an integer at or between -1 and 3.`
			);

		this.scene.inputManager.addEventListener(
			"gamepadbuttonpressed",
			this.__handleGamepadButtonPressed.bind(this)
		);

		this.__rawGamepad = n;
	}

	/**
	 * Get the current active index in the menu.
	 */
	get index() {
		return this.__rawIndex;
	}

	/**
	 * Set the current active index in the menu.
	 */
	set index(n) {
		if (typeof n !== "number" || !Number.isInteger(n))
			throw new TypeError("Menu index must be an integer.");

		const topIndex = this.items.length - 1;
		if (n < 0) n = topIndex;
		if (n > topIndex) n = 0;

		this.__rawIndex = n;
	}

	/**
	 * Get the screen-space available to the content of the menu.
	 * Return format: `[width, height]`
	 */
	get availableContentSpace() {
		const { width, height } = this.scene.runtime.renderer;

		return [
			width - Menu.horizontalSpacing * 2 - Menu.borderWidth * 2,
			height,
		];
	}

	/**
	 * Get the actual current width of the `Menu`.
	 */
	get width() {
		const { items, title } = this;

		const [width] = this.availableContentSpace;

		let itemsWidth = 0;

		for (const { renderable } of items) {
			if (!renderable) continue;

			const renderableWidth =
				renderable instanceof PixelMesh ? renderable.width : 1;
			if (renderableWidth > itemsWidth) {
				itemsWidth = renderableWidth;
			}
		}

		const titleWidth = title ? title.length : 0;

		// Nearest even number to actual width.
		return (
			Math.min(width, Math.max(itemsWidth, titleWidth)) +
			(this.border ? Menu.horizontalSpacing * 2 : 0) +
			(this.border ? Menu.borderWidth * 2 : 0)
		);
	}

	/**
	 * Get the actual current height of the `Menu`.
	 */
	get height() {
		const {
			runtime: {
				renderer: { height },
			},
		} = this;

		let itemsHeight = 0;

		for (const { renderable } of this.items) {
			if (!renderable) continue;
			if (renderable instanceof PixelMesh)
				itemsHeight += renderable.height;
			else itemsHeight++;
		}

		return Math.round(
			itemsHeight + (this.border ? Menu.borderWidth * 2 : 0)
		); // // 2 is added for the box borders on the top and bottom.
	}

	/**
	 * Get the screen-space currently used by the content of the menu.
	 * Return format: `[width, height]`
	 */
	get currentContentSpace() {
		const { width, height } = this;

		return this.border
			? [width - Menu.borderWidth * 2, height - Menu.borderWidth * 2]
			: [width, height];
	}

	/**
	 * Get the screen-space available to the content of the menu.
	 * Return format: `[width, height]`
	 */
	get availableContentSpace() {
		const { width, height } = this.scene.runtime.renderer;

		return [
			width - Menu.horizontalSpacing * 2 - Menu.borderWidth * 2,
			height,
		];
	}

	/**
	 * Get the item at the current menu index.
	 */
	get currentItem() {
		return this.items[this.index];
	}

	/**
	 * Unfocus the menu.
	 */
	blur() {
		if (this.maintainFocus) return;

		this.focused = false;
		this.__rawIndex = -1;

		if (this.deleteOnBlur) this.delete();
	}

	/**
	 * Get an item at a y-coordinate relative to the menu.
	 * @param {number} y The y-coordinate to check.
	 * @returns {Menu.Item|undefined} The item at that coordinate, or `undefined` if there is no item at the coordinate.
	 */
	itemAtCoordinate(y) {
		let cumulativeHeight = 0;

		for (const item of this.items) {
			const { renderable } = item;
			const itemHeight =
				renderable instanceof PixelMesh ? renderable.height : 1;

			const itemY = cumulativeHeight;

			if (y >= itemY && y <= itemY + itemHeight) return item;

			cumulativeHeight += itemHeight;
		}

		return undefined;
	}

	/**
	 * Handle a key being pressed.
	 * @param {Event} event The event that triggered this method.
	 */
	__onKeyDown(event) {
		if (!this.isOnScreen || !this.visible || !this.focused) return;

		this.__inputMode = "keyboard";

		const {
			keys: { up, down, escape },
		} = event;

		if (escape) return this.blur();
		else {
			this.focus = true;

			if (down) this.index++;
			else if (up) this.index--;
			else this.currentItem && this.currentItem.onKeyDown(event);
		}
	}

	/**
	 * Handle the mouse being moved.
	 * @param {Event} event The event that triggered this method.
	 */
	__onMouseMove(event) {
		if (!this.isOnScreen || !this.visible) return;

		// Determine if the mouse is moving over the menu.
		const { onLayer } = event;
		const [x, y] = onLayer[this.layer.label];
		const [menuX, menuY] = [x - this.x, y - this.y];

		if (
			menuX >= 0 &&
			menuX <= this.width &&
			menuY >= 0 &&
			menuY < this.height
		) {
			this.__inputMode = "mouse";
		}

		this.__determineMouseOverInput(event);

		if (this.__inputMode === "mouse")
			this.currentItem && this.currentItem.onMouseMove(event);
	}

	__determineMouseOverInput(event) {
		if (this.__inputMode !== "mouse") return;

		const { onLayer } = event;
		const [x, y] = onLayer[this.layer.label];
		const [menuX, menuY] = [
			x - this.x,
			y - this.y + (this.title || this.border ? 0 : 1),
		];

		const mouseMenuIndex = this.items.indexOf(this.itemAtCoordinate(menuY));

		if (
			mouseMenuIndex >= 0 &&
			mouseMenuIndex < this.items.length &&
			menuX >= 0 &&
			menuX <= this.width &&
			this.focused
		) {
			this.index = mouseMenuIndex;
		} else {
			this.__rawIndex = -1;
		}
	}

	/**
	 * Handle the mouse being clicked.
	 * @param {event} event The event that triggered this method.
	 */
	__onClick(event) {
		if (!this.isOnScreen || !this.visible) return;

		if (this.focused && !event.targets.includes(this.id))
			return this.blur();
		else if (event.targets.includes(this.id)) {
			this.focused = true;
			this.__inputMode = "mouse";
		}

		if (this.__inputMode === "mouse") {
			this.__determineMouseOverInput(event);

			this.currentItem && this.currentItem.onClick(event);
		}
	}

	__handleGamepadButtonPressed(event) {
		if (this.gamepad !== event.index && this.gamepad !== -1) return;
		const {
			buttons: { up, down },
		} = event;
		if (up) this.index--;
		else if (down) this.index++;
		else if (this.currentItem) {
			this.__lastGamepadClick = this.index;
			this.currentItem.onGamepadButton(event);
		}
	}

	get renderable() {
		const {
			title,
			items,
			width,
			height,
			currentContentSpace: [currentContentWidth],
		} = this;

		let data = [];

		if (this.border) {
			const {
				data: box,
				width: boxWidth,
				height: boxHeight,
			} = Box.asPixelMesh(
				width,
				height,
				this.focused ? "white" : "grey",
				undefined,
				"double"
			);

			data = box;
		}

		if (items) {
			let y = this.border || this.title ? Menu.borderWidth : 0;

			for (const { renderable } of items) {
				if (!renderable) continue;

				if (renderable instanceof PixelMesh) {
					if (renderable.width > this.availableContentSpace[0])
						throw new Error(
							`Menu.Item renderable.width is greater than the Menu's maximum content width of ${this.availableContentSpace[0]}.`
						);

					renderable.data.forEach((row) => {
						if (!data[y])
							data[y] = this.border
								? []
								: new Array(currentContentWidth).fill(null);

						data[y].splice(
							Math.round(
								this.alignCenter
									? currentContentWidth / 2 - row.length / 2
									: 0
							) + (this.border ? Menu.horizontalSpacing : 0),
							row.length,
							...row
						);
						y++;
					});
				} else {
					if (!data[y]) data[y] = [];

					data[y].splice(
						currentContentWidth % 2 === 0 && this.alignCenter
							? (this.border ? Menu.horizontalSpacing : 0) +
									(this.border ? Menu.borderWidth : 0)
							: Math.round(currentContentWidth / 2),
						1,
						renderable
					); // Put the Pixel in its own row in the new data.

					y++;
				}
			}
		}

		if (title) {
			const titleMesh = PixelMesh.fromString(
				title.slice(0, this.availableContentSpace[0])
			);

			if (!this.border) titleMesh.setFontWeight(800);

			const {
				data: [titleText],
			} = titleMesh;

			const startIndex =
				this.border || this.alignCenter
					? Math.floor((currentContentWidth - titleText.length) / 2)
					: 0;

			for (let i = 0; i < titleText.length; i++) {
				if (!data[0]) data[0] = [];
				data[0][
					i + startIndex + (this.border ? Menu.horizontalSpacing : 0)
				] = titleText[i];
			}
		}

		return new PixelMesh({ data });
	}

	set renderable(_) {
		return;
	}
}

export default Menu;
