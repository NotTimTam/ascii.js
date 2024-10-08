import Behavior from "../core/Behavior.js";

class TopDownMovement extends Behavior {
	/**
	 * Move a `GameObject` from a top-down perspective.
	 * @param {GameObject} gameObject The game object to append this behavior to.
	 * @param {boolean} enabledByDefault Whether the Behavior starts out enabled. Default: `true`.
	 * @param {Object} config The configuration for this `TopDownMovement`.
	 * @param {boolean} config.defaultControls Whether to automatically handle input using the arrow keys. Default: `true`.
	 */
	constructor(
		gameObject,
		enabledByDefault = true,
		config = { defaultControls: true }
	) {
		super(gameObject, enabledByDefault);

		TopDownMovement.validateConfig(config);

		const { defaultControls = true } = config;

		if (defaultControls)
			this.scene.inputManager.addEventListener(
				"keydown",
				this.__handleKeyDown.bind(this)
			);
	}

	/**
	 * Validates a TopDownMovement configuration object and throws an error if it is invalid.
	 * @param {Object} config The config object to validate.
	 */
	static validateConfig(config) {
		if (!config)
			throw new Error(
				`No configuration provided to "TopDownMovement" behavior.`
			);
	}

	/**
	 * Attempt to move `GameObject` up.
	 */
	simulateControlUp = () => {
		if (this.gameObject.paused) return;

		const {
			gameObject: { x, y },
		} = this;

		this.__tryToMoveToPosition(x, y - 1);
	};

	/**
	 * Attempt to move `GameObject` down.
	 */
	simulateControlDown = () => {
		if (this.gameObject.paused) return;

		const {
			gameObject: { x, y },
		} = this;

		this.__tryToMoveToPosition(x, y + 1);
	};

	/**
	 * Attempt to move `GameObject` left.
	 */
	simulateControlLeft = () => {
		if (this.gameObject.paused) return;

		const {
			gameObject: { x, y },
		} = this;

		this.__tryToMoveToPosition(x - 1, y);
	};

	/**
	 * Attempt to move `GameObject` right.
	 */
	simulateControlRight = () => {
		if (this.gameObject.paused) return;

		const {
			gameObject: { x, y },
		} = this;

		this.__tryToMoveToPosition(x + 1, y);
	};

	__handleKeyDown(event) {
		if (this.gameObject.paused) return;

		const {
			keys: { up, down, left, right },
		} = event;

		if (up) this.simulateControlUp();
		if (down) this.simulateControlDown();
		if (left) this.simulateControlLeft();
		if (right) this.simulateControlRight();
	}

	/**
	 * Check if it is clear to move to a position, and then move there.
	 * @param {number} x The x-coordinate to check.
	 * @param {number} y The y-coordinate to check.
	 */
	__tryToMoveToPosition(x, y) {
		if (this.gameObject.paused) return;

		const {
			gameObject,
			gameObject: {
				width,
				height,
				origin: [oX, oY],
			},
			scene: { layerManager },
		} = this;

		if (width <= 1 && height <= 1) {
			const solidAt = layerManager.solidAtPosition(x, y);

			if (!solidAt || solidAt.gameObject === gameObject) {
				gameObject.x = x;
				gameObject.y = y;
			}

			return;
		}

		let canMove = true;

		// Determine direction of movement
		const moveRight = x > gameObject.x;
		const moveLeft = x < gameObject.x;
		const moveDown = y > gameObject.y;
		const moveUp = y < gameObject.y;

		// Check collision along the direction of movement
		if (moveRight || moveLeft) {
			const startY = gameObject.y - oY;
			const endY = startY + height - 1;

			for (let posY = startY; posY <= endY; posY++) {
				const posX = moveRight ? x + width - 1 - oX : x - oX;
				const solidAt = layerManager.solidAtPosition(posX, posY);

				if (solidAt && solidAt.gameObject !== gameObject) {
					canMove = false;
					break;
				}
			}
		} else if (moveDown || moveUp) {
			const startX = gameObject.x - oX;
			const endX = startX + width - 1;

			for (let posX = startX; posX <= endX; posX++) {
				const posY = moveDown ? y + height - 1 - oY : y - oY;
				const solidAt = layerManager.solidAtPosition(posX, posY);

				if (solidAt && solidAt.gameObject !== gameObject) {
					canMove = false;
					break;
				}
			}
		}

		// If all pixels are clear, move the gameObject
		if (canMove) {
			gameObject.x = x;
			gameObject.y = y;
		}
	}

	onTick() {}
}

export default TopDownMovement;
