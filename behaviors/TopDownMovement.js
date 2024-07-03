import Behavior from "../core/Behavior.js";

class TopDownMovement extends Behavior {
	/**
	 * Move a `GameObject` from a top-down perspective.
	 * @param {Runtime} runtime The main runtime object.
	 * @param {GameObject} gameObject The game object to append this behavior to.
	 * @param {boolean} enabledByDefault Whether the Behavior starts out enabled. Default: `true`.
	 * @param {*} config The configuration for this `TopDownMovement`.
	 * @param {boolean} config.defaultControls Whether to automatically handle input using the arrow keys. Default: `true`.
	 */
	constructor(
		runtime,
		gameObject,
		enabledByDefault = true,
		config = { defaultControls: true }
	) {
		super(runtime, gameObject, enabledByDefault);

		TopDownMovement.validateConfig(config);

		const { defaultControls = true } = config;

		if (defaultControls)
			runtime.inputManager.addEventListener(this.handleInput.bind(this));
	}

	/**
	 * Validates a TopDownMovement configuration object and throws an error if it is invalid.
	 * @param {*} config The config object to validate.
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
		const {
			gameObject: { x, y },
		} = this;

		this.__tryToMoveToPosition(x, y - 1);
	};

	/**
	 * Attempt to move `GameObject` down.
	 */
	simulateControlDown = () => {
		const {
			gameObject: { x, y },
		} = this;

		this.__tryToMoveToPosition(x, y + 1);
	};

	/**
	 * Attempt to move `GameObject` left.
	 */
	simulateControlLeft = () => {
		const {
			gameObject: { x, y },
		} = this;

		this.__tryToMoveToPosition(x - 1, y);
	};

	/**
	 * Attempt to move `GameObject` right.
	 */
	simulateControlRight = () => {
		const {
			gameObject: { x, y },
		} = this;

		this.__tryToMoveToPosition(x + 1, y);
	};

	handleInput(event) {
		if (event.type === "keydown") {
			const {
				keys: { up, down, left, right },
			} = event;

			if (up) this.simulateControlUp();
			if (down) this.simulateControlDown();
			if (left) this.simulateControlLeft();
			if (right) this.simulateControlRight();
		}
	}

	/**
	 * Check if it is clear to move to a position, and then move there.
	 * @param {number} x The x-coordinate to check.
	 * @param {number} y The y-coordinate to check.
	 */
	__tryToMoveToPosition(x, y) {
		const {
			gameObject,
			runtime: {
				renderer: { layerManager },
			},
		} = this;

		const solidAt = layerManager.solidAtPosition(x, y);

		if (!solidAt || solidAt.gameObject === gameObject) {
			gameObject.x = x;
			gameObject.y = y;
		}
	}

	__onTick() {}
}

export default TopDownMovement;
