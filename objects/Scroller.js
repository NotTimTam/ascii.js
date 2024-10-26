import UIObject from "../core/UIObject.js";
import Pixel, { PixelMesh } from "../core/Pixel.js";
import Scene from "../engine/Scene.js";
import { aabb, clamp } from "../util/math.js";
import Box from "./Box.js";
import GameObject from "../core/GameObject.js";
import Style from "../core/Style.js";

class Scroller extends UIObject {
	/**
	 * The width of the `Scroller` container's border.
	 */
	static borderWidth = 1;

	/**
	 * The width of the scrollbars.
	 */
	static scrollbarWidth = 1;

	/**
	 * Configuration data for the `Scroller`'s `configuration.style` property.
	 * @typedef {Object} ScrollerStyleConfig
	 * @property {boolean} border Whether or not to show a border around the content. Default `true`.
	 * @property {Object} focused Styles to use when the `Scroller` is focused.
	 * @property {?string} focused.thumbColor The color of the `Scroller`'s scrollbar thumbs when the `Scroller` is in focus.
	 * @property {?string} focused.trackColor The color of the `Scroller`'s scrollbar tracks when the `Scroller` is in focus.
	 * @property {?string} focused.borderColor The color of the `Scroller`'s border when the `Scroller` is in focus.
	 * @property {Object} blurred Styles to use when the `Scroller` is blurred.
	 * @property {?string} blurred.thumbColor The color of the `Scroller`'s scrollbar thumbs when the `Scroller` is blurred.
	 * @property {?string} blurred.trackColor The color of the `Scroller`'s scrollbar tracks when the `Scroller` is blurred.
	 * @property {?string} blurred.borderColor The color of the `Scroller`'s border when the `Scroller` is blurred.
	 */
	static style = {
		border: new Style.Parameter("bool", true),
		focused: new Style({
			thumbColor: new Style.Parameter("color", "white"),
			trackColor: new Style.Parameter("color", "gray"),
			borderColor: new Style.Parameter("color", "white"),
		}),
		blurred: new Style({
			thumbColor: new Style.Parameter("color", "grey"),
			trackColor: new Style.Parameter("color", "#3c3c3c"),
			borderColor: new Style.Parameter("color", "grey"),
		}),
	};

	/**
	 * Configuration data for the `Scroller` class.
	 * @typedef {Object} ScrollerConfig
	 * @property {number} x This `Scroller` object's x-coordinate.
	 * @property {number} y This `Scroller` object's y-coordinate.
	 * @property {number} zIndex A numeric value determining the rendering heirarchy position this `Scroller` should fall in.
	 *
	 * `Scroller`s with higher z-indeces will be drawn on top of those with lower z-indeces. Default `0`.
	 * @property {?string} layer The (optional) label of the layer to initialize the `Scroller` on.
	 * @property {number} tabIndex A numeric value determining the index in the focus array this `Scroller` should fall at. The higher an instance's `tabIndex`, the further down the list it will be.
	 *
	 * A `tabIndex` of `-1` will mark the `Scroller` instance as "unfocusable", meaning focus-based events, such as `keydown` events specific to this `Scroller`, will not be triggered. Default `0`.
	 * @property {boolean} autoFocus Whether to automatically focus on this `Scroller` after its instantiation. Default `false`.
	 * @property {boolean} maintainFocus Force the `InputManager` to keep this `Scroller` in focus, even if attempts are made to focus on other `Scroller`s. Default `false`.
	 * @property {number} width The width of the `Scroller`. Defaults to `8`. **Note:** This is the width of the `Scroller` "window", not the width of the view area.
	 * @property {number} height The height of the `Scroller`. Defaults to `8`. **Note:** This is the height of the `Scroller` "window", not the height of the view area.
	 * @property {?string} gameObjects The `GameObject`s to display in the `Scroller`.
	 * @property {?ScrollerStyleConfig} style Optional style configuration object.
	 */

	/**
	 * A box that can be scrolled.
	 * @param {Scene} scene The scene this Object is a part of.
	 * @param {?ScrollerConfig} config The `Scroller`'s config object.
	 */
	constructor(scene, config) {
		super(scene, config);

		const { width = 8, height = 8, gameObjects, style = {} } = config;

		this.style = new Style(Scroller.style).hydrate(style);

		if (typeof width !== "number" || !Number.isInteger(width) || width < 2)
			throw new TypeError(
				"Invalid config.width value provided to Scroller. Expected an integer greater than or equal to 2."
			);

		this.width = width;

		if (
			typeof height !== "number" ||
			!Number.isInteger(height) ||
			height < 2
		)
			throw new TypeError(
				"Invalid config.height value provided to Scroller. Expected an integer greater than or equal to 2."
			);

		this.height = height;

		this.children = gameObjects;

		this.addEventListener("mousemove", this.__handleMouse);
		this.addEventListener("mousedown", this.__handleMouse);
		this.addEventListener("keydown", this.__handleKeyDown);
		this.addEventListener("wheel", this.__handleMouseWheel);
		this.addEventListener(
			"gamepadbuttonpressed",
			this.__handleGamepadButtonPressed
		);
	}

	/**
	 * Get the width of this `Scroller`'s border.
	 */
	get borderWidth() {
		return this.style.border ? Scroller.borderWidth : 0;
	}

	getChildPosition(child) {
		if (
			!child ||
			!(child instanceof GameObject) ||
			!this.children.includes(child)
		)
			throw new TypeError(
				`"getChildPosition" method called on an object that is not a child of this GameObject.`
			);

		return [
			child.x + this.borderWidth - this.scrollX,
			child.y + this.borderWidth - this.scrollY,
		];
	}

	__handleMouse(event) {
		const {
			activeScrollbars: { horizontalScrollbar, verticalScrollbar },
			scrollBarRect: {
				verticalScrollbarY,
				horizontalScrollbarX,
				verticalScrollbarLength,
				horizontalScrollbarLength,
			},
		} = this;

		const {
			onLayer,
			buttons: { left },
		} = event;

		if (!left || !onLayer[this.layer.label]) return;

		const [x, y] = onLayer[this.layer.label];
		const [scrollerX, scrollerY] = [x - this.relX, y - this.relY];
		const [onHorizontalScrollbar, onVerticalScrollbar] = [
			horizontalScrollbar && scrollerY >= this.height - 1,
			verticalScrollbar && scrollerX >= this.width - 1,
		];

		// Handle events for pointer capture.
		if (
			(onHorizontalScrollbar || onVerticalScrollbar) &&
			!this.capturedPointer
		)
			event.capturePointer(onVerticalScrollbar ? 0 : 1);

		if (this.capturedPointer) {
			const { captureMode } = event;

			if (captureMode === 0) {
				const thumbSize = Math.round(
					verticalScrollbarLength *
						(this.viewportSize[1] /
							(this.spans.down - this.spans.up))
				);
				const newThumbY = clamp(
					scrollerY - verticalScrollbarY,
					thumbSize / 2,
					verticalScrollbarLength - thumbSize / 2
				);

				// Adjust scrollY based on the new thumb position
				this.scrollY =
					((newThumbY - thumbSize / 2) *
						(this.spans.down - this.spans.up)) /
					(verticalScrollbarLength - thumbSize);
			} else if (captureMode === 1) {
				const thumbSize = Math.round(
					horizontalScrollbarLength *
						(this.viewportSize[0] /
							(this.spans.right - this.spans.left))
				);
				const newThumbX = clamp(
					scrollerX - horizontalScrollbarX,
					thumbSize / 2,
					horizontalScrollbarLength - thumbSize / 2
				);

				// Adjust scrollX based on the new thumb position
				this.scrollX =
					((newThumbX - thumbSize / 2) *
						(this.spans.right - this.spans.left)) /
					(horizontalScrollbarLength - thumbSize);
			}
		}
	}

	__handleKeyDown(event) {
		const {
			keys: { left, right, up, down },
		} = event;

		if (left) this.scrollX--;
		if (right) this.scrollX++;
		if (up) this.scrollY--;
		if (down) this.scrollY++;
	}

	__handleMouseWheel(event) {
		const {
			deltas: { x, y },
		} = event;

		if (x < 0) this.scrollX--;
		if (x > 0) this.scrollX++;
		if (y < 0) this.scrollY--;
		if (y > 0) this.scrollY++;
	}

	__handleGamepadButtonPressed(event) {
		const {
			buttons: { up, down, left, right },
		} = event;
		if (up) this.scrollY--;
		else if (down) this.scrollY++;
		if (left) this.scrollX--;
		else if (right) this.scrollX++;
	}

	/**
	 * Get the `Scroller`'s scroll x position.
	 */
	get scrollX() {
		return Math.round(this.__rawScrollX || 0);
	}

	/**
	 * Set the `Scroller`'s scroll x position.
	 */
	set scrollX(n) {
		const {
			spans: { left, right },
			viewportSize: [vW],
		} = this;

		this.__rawScrollX = clamp(n, left, right - vW);
	}

	/**
	 * Get the `Scroller`'s scroll y position.
	 */
	get scrollY() {
		return Math.round(this.__rawScrollY || 0);
	}

	/**
	 * Set the `Scroller`'s scroll y position.
	 */
	set scrollY(n) {
		const {
			spans: { up, down },
			viewportSize: [_, vH],
		} = this;

		this.__rawScrollY = clamp(n, up, down - vH);
	}

	/**
	 * Get the `Scroller`'s width.
	 */
	get width() {
		return this.__rawWidth;
	}

	/**
	 * Set the `Scroller`'s width.
	 */
	set width(n) {
		this.__rawWidth = Math.round(n);
	}

	/**
	 * Get the `Scroller`'s height.
	 */
	get height() {
		return this.__rawHeight;
	}

	/**
	 * Set the `Scroller`'s height.
	 */
	set height(n) {
		this.__rawHeight = Math.round(n);
	}

	/**
	 * Get the dimensions displayed inside the scroller.
	 */
	get spans() {
		let spans = {
			left: 0,
			right: 0,
			up: 0,
			down: 0,
		};

		for (let { x, y, renderable } of this.children) {
			const { origin } = renderable;
			const { width, height } =
				renderable instanceof PixelMesh
					? renderable
					: { width: 1, height: 1 };

			if (origin) {
				const [oX, oY] = origin;

				x -= oX;
				y -= oY;

				x = Math.round(x);
				y = Math.round(y);
			}

			if (x < spans.left) spans.left = x;
			if (y < spans.up) spans.up = y;
			if (x + width > spans.right) spans.right = x + width;
			if (y + height > spans.down) spans.down = y + height;
		}

		return spans;
	}

	/**
	 * Get the scrollbars that are currently usable. This is determined by what content is overflowing.
	 */
	get activeScrollbars() {
		const { width, height, spans, borderWidth } = this;

		return {
			horizontalScrollbar:
				spans.right - spans.left > width - borderWidth * 2,
			verticalScrollbar: spans.down - spans.up > height - borderWidth * 2,
		};
	}

	/**
	 * Get the x, y, width, and height of the content area.
	 */
	get viewportSize() {
		const {
			width,
			height,
			borderSizes: { borderWidthHorizontal, borderWidthVertical },
		} = this;

		return [width - borderWidthHorizontal, height - borderWidthVertical];
	}

	/**
	 * Get the size of the border horizontally and vertically.
	 */
	get borderSizes() {
		const {
			style: { border },
			activeScrollbars: { horizontalScrollbar, verticalScrollbar },
		} = this;

		return {
			borderWidthHorizontal: border ? 2 : horizontalScrollbar ? 1 : 0,
			borderWidthVertical: border ? 2 : verticalScrollbar ? 1 : 0,
		};
	}

	/**
	 * Get the position and size of each scrollbar.
	 */
	get scrollBarRect() {
		const {
			style: { border },
		} = this;

		return {
			verticalScrollbarY: border ? 1 : 0,
			horizontalScrollbarX: border ? 1 : 0,
			verticalScrollbarLength: this.height - (border ? 2 : 1),
			horizontalScrollbarLength: this.width - (border ? 2 : 1),
		};
	}

	get renderable() {
		const {
			width,
			height,
			children,
			spans,
			scrollX,
			scrollY,
			activeScrollbars: { horizontalScrollbar, verticalScrollbar },
			viewportSize: [vW, vH],
			scrollBarRect: {
				verticalScrollbarY,
				horizontalScrollbarX,
				verticalScrollbarLength,
				horizontalScrollbarLength,
			},
			style,
			focused,
			borderWidth,
		} = this;

		const { trackColor, thumbColor, borderColor } =
			style[focused ? "focused" : "blurred"];

		const [vX, vY] = [borderWidth, borderWidth];

		const [verticalThumbLength, horizontalThumbLength] = [
			Math.max(
				1,
				Math.round(
					verticalScrollbarLength * (vH / (spans.down - spans.up))
				)
			),
			Math.max(
				1,
				Math.round(
					horizontalScrollbarLength *
						(vW / (spans.right - spans.left))
				)
			),
		];

		const [verticalTrackY, horizontalTrackX] = [
			(scrollY / (spans.down - spans.up - vH)) *
				(verticalScrollbarLength - verticalThumbLength),
			(scrollX / (spans.right - spans.left - vW)) *
				(horizontalScrollbarLength - horizontalThumbLength),
		];

		const [verticalThumbTop, verticalThumbBottom] = [
			verticalTrackY,
			verticalTrackY + verticalThumbLength,
		];

		const [horizontalThumbLeft, horizontalThumbRight] = [
			horizontalTrackX,
			horizontalTrackX + horizontalThumbLength,
		];

		let data = style.border
			? Box.asPixelMesh(width, height, borderColor, null, "line").data
			: [];

		// Drawing the vertical scrollbar
		if (verticalScrollbar) {
			for (
				let y = verticalScrollbarY;
				y < verticalScrollbarY + verticalScrollbarLength;
				y++
			) {
				if (!data[y]) data[y] = [];

				const adjustedY = y - verticalScrollbarY;

				data[y][this.width - 1] = new Pixel({
					value: "█",
					color:
						adjustedY >= verticalThumbTop &&
						adjustedY < verticalThumbBottom
							? thumbColor
							: trackColor,
				});
			}
		}

		// Drawing the horizontal scrollbar
		if (horizontalScrollbar) {
			if (!data[this.height - 1]) data[this.height - 1] = [];

			for (
				let x = horizontalScrollbarX;
				x < horizontalScrollbarX + horizontalScrollbarLength;
				x++
			) {
				const adjustedX = x - horizontalScrollbarX;

				data[this.height - 1][x] = new Pixel({
					value: "▀",
					color:
						adjustedX >= horizontalThumbLeft &&
						adjustedX < horizontalThumbRight
							? thumbColor
							: trackColor,
				});
			}
		}

		for (const go of children) {
			const { renderable, x, y } = go;

			/**
			 * Render a pixel within the Scroller.
			 * @param {Pixel} pixel The pixel to render.
			 * @param {number} x The x-offset to render at.
			 * @param {number} y The y-offset to render at.
			 */
			const renderPixel = (pixel, x = 0, y = 0) => {
				const [dspX, dspY] = [x + vX - scrollX, y + vY - scrollY];

				if (!aabb(dspX, dspY, 1, 1, vX, vY, vW, vH)) return;

				if (!data[dspY]) data[dspY] = [];

				data[dspY][dspX] = pixel;
			};

			if (renderable instanceof Pixel) {
				renderPixel(renderable, renderable.x, renderable.y);
			} else if (renderable instanceof PixelMesh) {
				if (!aabb(x, y, go.width, go.height, 0, 0, vW, vH)) continue;

				for (
					let pixelY = 0;
					pixelY < renderable.data.length;
					pixelY++
				) {
					const row = renderable.data[pixelY];

					if (!row || row.length === 0) continue;

					for (let pixelX = 0; pixelX < row.length; pixelX++) {
						const pixel = row[pixelX];

						renderPixel(pixel, x + pixelX, y + pixelY);
					}
				}
			}
		}

		return new PixelMesh({ data });
	}
}

export default Scroller;
