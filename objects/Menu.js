import GameObject from "../core/GameObject.js";
import Pixel, { PixelMesh } from "../core/Pixel.js";
import Scene from "../engine/Scene.js";
import { isPlainObject } from "../util/data.js";
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
}

class Button extends Item {
	/**
	 * A string of text that can be rendered on screen.
	 * @param {Object} config The `Button`'s config object.
	 * @param {string} config.label The `Button`'s display label.
	 * @param {string} config.color The color of the display label.
	 * @param {function} config.callback The function to call when this item is clicked/activated. This callback is passed the `Menu` instance as an argument.
	 */
	constructor(config) {
		super();

		const { label, color = "white", callback } = config;

		this.label = label;
		this.color = color;
		this.callback = callback;
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

class Menu extends GameObject {
	static Item = Item;
	static Button = Button;

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
		} = config;
		super(scene, x, y, layer);

		this.deleteOnBlur = Boolean(deleteOnBlur);

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
			item.index = items.indexOf(item);

			scene.runtime.__runOnLoad(item);
		}

		this.items = items;

		this.index = 0;
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
		this.focused = false;
		this.index = -1;
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
			keys: { up, down, enter, escape },
		} = event;

		if (escape) return this.blur();

		this.focus;

		if (down) this.index++;
		if (up) this.index--;

		const topIndex = this.items.length - 1;
		if (this.index < 0) this.index = topIndex;
		if (this.index > topIndex) this.index = 0;

		if (this.currentItem instanceof Menu.Button && enter)
			this.currentItem.callback(this);
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

			if (this.currentItem instanceof Menu.Button)
				this.currentItem.callback(this);
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
