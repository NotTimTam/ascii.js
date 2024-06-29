import { Pixel } from "../engine/renderer.js";
import Entity from "./Entity.js";

class Player extends Entity {
	/**
	 * The player entity.
	 * @param {Runtime} runtime The main runtime object.
	 * @param {number} x This entity's x-coordinate.
	 * @param {number} y This entity's y-coordinate.
	 */
	constructor(runtime, x, y) {
		super(runtime, x, y);

		runtime.inputManager.addEventListener(this.handleInput.bind(this));
	}

	get renderable() {
		return new Pixel("☺", "cyan", "800", "blue");
	}

	handleInput(event) {
		if (event.type === "keydown") {
			const {
				keys: { up, down, left, right },
			} = event;

			if (up) this.y--;
			if (down) this.y++;
			if (left) this.x--;
			if (right) this.x++;
		}
	}

	__onTick() {
		const {
			runtime,
			runtime: {
				renderer: { camera, width, height },
			},
		} = this;

		camera.x = this.x - width / 2;
		camera.y = this.y - height / 2;
	}
}

export default Player;
