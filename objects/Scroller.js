import UIObject from "../core/UIObject.js";
import Pixel, { PixelMesh } from "../core/Pixel.js";
import Scene from "../engine/Scene.js";
import { aabb, clamp } from "../util/math.js";
import Box from "./Box.js";
import GameObject from "../core/GameObject.js";

/**
 * @typedef {import("../core/UIObject.js").UIObjectConfig} UIObjectConfig
 */

/**
 * Configuration data for the `Scroller` class.
 * @typedef {Object} ScrollerConfig
 * @property {number} width The width of the `Scroller`. Defaults to `8`. **Note:** This is the width of the `Scroller` "window", not the width of the view area.
 * @property {number} height The height of the `Scroller`. Defaults to `8`. **Note:** This is the height of the `Scroller` "window", not the height of the view area.
 * @property {?string} gameObjects The `GameObject`s to display in the `Scroller`.
 * @property {?string} backgroundColor Optional background color.
 */

class Scroller extends UIObject {
	/**
	 * The color of the scrollbar track.
	 */
	static track = "grey";

	/**
	 * The color of the scrollbar thumb.
	 */
	static thumb = "white";

	/**
	 * The width of the `Scroller` container's border.
	 */
	static borderWidth = 1;

	/**
	 * The width of the scrollbars.
	 */
	static scrollbarWidth = 1;

	/**
	 * A box that can be scrolled.
	 * @param {Scene} scene The scene this Object is a part of.
	 * @param {UIObjectConfig & ScrollerConfig} config The `Scroller`'s config object.
	 */
	constructor(scene, config) {
		super(scene, config);

		const { width = 8, height = 8, gameObjects, backgroundColor } = config;

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

		if (backgroundColor) {
			if (typeof backgroundColor !== "string")
				return new TypeError(
					"Expected a string for Text config.backgroundColor value."
				);
			this.backgroundColor = backgroundColor;
		}

		this.addEventListener("mousemove", this.__handleMouse);
		this.addEventListener("mousedown", this.__handleMouse);
		this.addEventListener("keydown", this.__handleKeyDown);
		this.addEventListener("wheel", this.__handleMouseWheel);
		this.addEventListener(
			"gamepadbuttonpressed",
			this.__handleGamepadButtonPressed
		);
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
			child.x + Scroller.borderWidth - this.scrollX,
			child.y + Scroller.borderWidth - this.scrollY,
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

		if (verticalScrollbar && scrollerX >= this.width - 1) {
			const thumbSize = Math.round(
				verticalScrollbarLength *
					(this.viewportSize[1] / (this.spans.down - this.spans.up))
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
		}

		if (horizontalScrollbar && scrollerY >= this.height - 1) {
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
		const { width, height, spans } = this;
		const { borderWidth } = Scroller;

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
		const { width, height } = this;
		const { borderWidth } = Scroller;

		return [width - borderWidth * 2, height - borderWidth * 2];
	}

	/**
	 * Get the position and size of each scrollbar.
	 */
	get scrollBarRect() {
		return {
			verticalScrollbarY: 1,
			horizontalScrollbarX: 1,
			verticalScrollbarLength: this.height - 2,
			horizontalScrollbarLength: this.width - 2,
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
		} = this;
		let { track, thumb, borderWidth } = Scroller;

		if (!this.focused) {
			thumb = "grey";
			track = "#424242";
		}

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

		let data = Box.asPixelMesh(width, height, thumb, null, "line").data;

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
							? thumb
							: track,
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
							? thumb
							: track,
				});
			}
		}

		for (const go of children) {
			const { renderable, x, y } = go;

			if (renderable instanceof Pixel) {
				const [dspX, dspY] = [x + vX - scrollX, y + vY - scrollY];

				if (
					!aabb(dspX, dspY, 1, 1, vX, vY, vW, vH) ||
					dspX > vX + vW ||
					dspY > vY + vH
				)
					continue;

				if (!data[dspY]) data[dspY] = [];
				data[dspY][dspX] = renderable;
			} else if (renderable instanceof PixelMesh) {
				if (!aabb(x, y, go.width, go.height, vX, vY, vW, vH)) continue;

				for (
					let pixelY = 0;
					pixelY < renderable.data.length;
					pixelY++
				) {
					const row = renderable.data[pixelY];

					if (!row || row.length === 0) continue;

					for (let pixelX = 0; pixelX < row.length; pixelX++) {
						const pixel = row[pixelX];

						const [dspX, dspY] = [
							x + vX + pixelX - scrollX,
							y + vY + pixelY - scrollY,
						];

						if (!aabb(dspX, dspY, 1, 1, vX, vY, vW, vH)) continue;

						if (!data[dspY]) data[dspY] = [];

						data[dspY][dspX] = pixel;
					}
				}
			}
		}

		return new PixelMesh({ data });
	}
}

export default Scroller;
