import GameObject from "../core/GameObject.js";
import { aabb } from "../util/math.js";

class Camera extends GameObject {
	/**
	 * The layer manager contains variable layers and compiles them into one frame to render to the screen.
	 * @param {Renderer} renderer The main runtime's renderer object.
	 */
	constructor(renderer) {
		super(renderer.runtime, 0, 0);
		this.renderer = renderer;

		this.config = this.renderer.config && this.renderer.config.camera;
	}

	get renderable() {
		return undefined;
	}

	/**
	 * Check if a bounding box is on screen.
	 * @param {number} x The x-coordinate to check.
	 * @param {number} y The y-coordinate to check.
	 * @param {number} width The width to check.
	 * @param {number} height The height to check.
	 */
	isOnScreen = (x, y, width, height) =>
		aabb(
			x,
			y,
			width,
			height,
			this.x,
			this.y,
			this.renderer.width,
			this.renderer.height
		);
}

export default Camera;
