import Core from "./Core.js";

class Behavior extends Core {
	/**
	 * A core object that modifies the behavior of a GameObject. Behaviors need an `__onTick` method that will run every frame right before their `GameObject`'s `__onTick`.
	 * @param {Runtime} runtime The main runtime object.
	 * @param {GameObject} gameObject The game object to append this behavior to.
	 * @param {boolean} enabledByDefault Whether the Behavior starts out enabled. Default: `true`.
	 */
	constructor(runtime, gameObject, enabledByDefault = true) {
		super(runtime);

		this.gameObject = gameObject;
		gameObject.behaviors.push(this);

		this.enabled = enabledByDefault;
	}
}

export default Behavior;
