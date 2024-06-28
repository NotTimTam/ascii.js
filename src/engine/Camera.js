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

	/**
	 * Check if a bounding box is on screen.
	 * @param {number} x The x-coordinate to check.
	 * @param {number} y The y-coordinate to check.
	 * @param {number} width The width to check.
	 * @param {number} height The height to check.
	 */
	isOnScreen(x, y, width, height) {
		const {
			x: camX,
			y: camY,
			renderer: {
				resolution: [screenWidth, screenHeight],
			},
		} = this;

		return aabb(x, y, width, height, camX, camY, screenWidth, screenHeight);
	}
}

export default Camera;
