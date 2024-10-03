import GameObject from "../core/GameObject.js";
import Pixel, { PixelMesh } from "../core/Pixel.js";
import Scene from "../engine/Scene.js";
import { isPlainObject } from "../util/data.js";
import { clamp } from "../util/math.js";
import Box from "./Box.js";

class Item {
	onLoad() {
		console.log(
			"Overwrite extended \"Menu.Item\" class's 'onLoad' method."
		);
	}
	get renderable() {
		return Pixel.fromString("#");
	}

	get index() {
		return this.menu.items.indexOf(this);
	}

	onKeyDown() {
		console.warn("overwrite Menu.Item.onKeyDown");
	}
	onClick() {
		console.warn("overwrite Menu.Item.onKeyDown");
	}
}

class Button extends Item {
	/**
	 * A string of text that can be rendered on screen.
	 * @param {Object} config The `Button`'s config object.
	 * @param {string} config.label The `Button`'s display label.
	 * @param {function} config.callback The function to call when this item is clicked/activated. This callback is passed the `Menu` instance as an argument.
	 */
	constructor(config) {
		super();

		const { label, callback } = config;

		if (typeof label !== "string")
			throw new TypeError(
				"Menu.Button config.label property must be a string."
			);

		this.label = label && label.trim();
		this.callback = callback;
	}

	onKeyDown(event) {
		if (event.keys.enter) this.callback(this.menu);
	}
	onClick() {
		this.callback(this.menu);
	}

	onLoad() {}

	get renderable() {
		const {
			menu: { index: activeIndex },
			index,
		} = this;

		const display = PixelMesh.fromString(this.label);

		if (activeIndex === index) display.setColor("white");
		else display.setColor("grey");

		return display;
	}
}

class Slider extends Item {
	/**
	 * A string of text that can be rendered on screen.
	 * @param {Object} config The `Slider`'s config object.
	 * @param {string} config.label An optional `Slider` display label.
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

	onKeyDown(event) {
		const {
			keys: { enter, left, right },
		} = event;

		if (enter) this.callback(this.value);
		if (left) this.value -= this.step;
		if (right) this.value += this.step;
	}

	onClick() {
		this.callback(this.value);
	}

	onLoad() {}

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
		} = this;

		const active = activeIndex === index;

		let data = [];

		if (label) {
			const labelMesh = PixelMesh.fromString(this.label + " ");
			if (!active) labelMesh.setColor("grey");
			data.push(labelMesh.data[0]);
		}

		const sliderWidth = 10;
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

class Menu extends GameObject {
	static Item = Item;
	static Button = Button;
	static Slider = Slider;

	static horizontalSpacing = 1;
	static borderWidth = 1;

	/**
	 * A menu of various items that can be rendered on screen.
	 * @param {Scene} scene The scene this Object is a part of.
	 * @param {Object} config The `Menu`'s config object.
	 * @param {number} config.x This `Menu` object's x-coordinate.
	 * @param {number} config.y This `Menu` object's y-coordinate.
	 * @param {Object} config.items An array of `Menu.Item` instances. You can extend the `Menu.Item` class to make your own items.
	 * @param {string} config.title Optional menu title.
	 * @param {string} config.layer The label of the layer to start the `Menu` on.
	 * @param {boolean} config.autoFocus Whether to automatically focus on the `Menu` after it has been instantiated. Default `true`.
	 * @param {boolean} config.maintainFocus Forces the menu to stay focused. Default `true`.
	 * @param {boolean} config.deleteOnBlur Whether to delete the menu when it becomes unfocused. Default `false`. **NOTE:** If `config.autoFocus` is set to false, the `Menu` will be deleted immediately!
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
			items = [],
			layer,
			autoFocus = true,
			deleteOnBlur = false,
			maintainFocus = true,
		} = config;
		super(scene, x, y, layer);

		this.deleteOnBlur = Boolean(deleteOnBlur);
		this.maintainFocus = Boolean(maintainFocus);

		if (!(items instanceof Array))
			throw new TypeError(
				`"Menu" constructor config.items object should be an array of "Menu.Item" instances.`
			);

		for (const item of items) {
			if (!(item instanceof Menu.Item))
				throw new TypeError(
					'Each item in the "Menu" constructor config.items array must be an instance of "Menu.Item".'
				);

			item.menu = this;

			scene.runtime.__runOnLoad(item);
		}

		this.items = items;

		this.__rawIndex = 0;
		this.focused = Boolean(autoFocus);

		if (title && typeof title !== "string")
			throw new Error(
				`Provided menu title "${title}" is not of type "string".`
			);

		this.title = title;

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

	get index() {
		return this.__rawIndex;
	}

	set index(n) {
		if (typeof n !== "number" || !Number.isInteger(n))
			throw new TypeError("Menu index must be an integer.");

		const topIndex = this.items.length - 1;
		if (n < 0) n = topIndex;
		if (n > topIndex) n = 0;

		this.__rawIndex = n;
	}

	/**
	 * Get the screen-space available to the menu.
	 * Return format: `[width, height]`
	 */
	get availableScreenSpace() {
		const {
			scene: {
				runtime: {
					renderer: { width, height },
				},
			},
			positionOnScreen: [x, y],
		} = this;

		return [width - x, height - y];
	}

	/**
	 * Get the screen-space available to the content of the menu.
	 * Return format: `[width, height]`
	 */
	get availableContentSpace() {
		const [width, height] = this.availableScreenSpace;

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
			Menu.horizontalSpacing * 2 +
			Menu.borderWidth * 2
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

		return Math.round(itemsHeight + Menu.borderWidth * 2); // // 2 is added for the box borders on the top and bottom.
	}

	/**
	 * Get the screen-space currently used by the content of the menu.
	 * Return format: `[width, height]`
	 */
	get currentContentSpace() {
		const { width, height } = this;

		return [width - Menu.borderWidth * 2, height - Menu.borderWidth * 2];
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
		this.index = -1;

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
			else this.currentItem.onKeyDown(event);
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
	}

	__determineMouseOverInput(event) {
		if (this.__inputMode !== "mouse") return;

		const { onLayer } = event;
		const [x, y] = onLayer[this.layer.label];
		const [menuX, menuY] = [x - this.x, y - this.y];

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
			this.index = -1;
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

			this.currentItem.onClick(event);
		}
	}

	get renderable() {
		const {
			title,
			items,
			width,
			height,
			availableContentSpace: [
				availableContentWidth,
				availableContentHeight,
			],
			availableScreenSpace: [availableScreenWidth, availableScreenHeight],
			currentContentSpace: [currentContentWidth, currentContentHeight],
		} = this;

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

		let data = box;

		if (items) {
			let y = Menu.borderWidth;
			for (const { renderable } of items) {
				if (!renderable) continue;

				if (renderable instanceof PixelMesh) {
					if (renderable.width > availableContentWidth)
						throw new Error(
							`Menu.Item renderable.width is greater than the Menu's maximum content width of ${availableContentWidth}.`
						);

					renderable.data.forEach((row) => {
						data[y].splice(
							currentContentWidth / 2 -
								row.length / 2 +
								Menu.horizontalSpacing,
							row.length,
							...row
						);
						y++;
					});
				} else {
					data[y].splice(
						currentContentWidth % 2 === 0
							? Menu.horizontalSpacing + Menu.borderWidth
							: Math.round(currentContentWidth / 2),
						1,
						renderable
					); // Put the Pixel in its own row in the new data.

					y++;
				}
			}
		}

		if (title) {
			const {
				data: [titleText],
			} = PixelMesh.fromString(
				title.slice(0, this.availableContentSpace[0])
			);

			const startIndex = Math.floor(
				(currentContentWidth - titleText.length) / 2
			);
			for (let i = 0; i < titleText.length; i++) {
				data[0][i + startIndex + Menu.horizontalSpacing] = titleText[i];
			}
		}

		return new PixelMesh({ data });
	}

	set renderable(_) {
		return;
	}
}

export default Menu;
