import { Pixel } from "../engine/renderer.js";
import Entity from "../core/Entity.js";

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
		return new Pixel({
			value: "☺",
			color: "cyan",
			fontWeight: "800",
			backgroundColor: "blue",
		});
	}

	tryToMoveToPosition(x, y) {
		const {
			runtime: {
				renderer: { layerManager },
			},
		} = this;

		const solidAt = layerManager.solidAtPosition(x, y);

		if (!solidAt || solidAt.gameObject === this) {
			this.x = x;
			this.y = y;
		}
	}

	handleInput(event) {
		if (event.type === "keydown") {
			const {
				keys: { up, down, left, right, escape },
			} = event;

			if (!this.paused) {
				if (up) this.tryToMoveToPosition(this.x, this.y - 1);
				if (down) this.tryToMoveToPosition(this.x, this.y + 1);
				if (left) this.tryToMoveToPosition(this.x - 1, this.y);
				if (right) this.tryToMoveToPosition(this.x + 1, this.y);
			}

			if (escape) this.runtime.paused = !this.runtime.paused;
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
