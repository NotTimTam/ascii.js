import Core from "./Core.js";

class Behavior extends Core {
	/**
	 * A core object that modifies the behavior of a GameObject. Behaviors need an `onTick` method that will run every frame right before their `GameObject`'s `onTick`.
	 * @param {GameObject} gameObject The game object to append this behavior to.
	 * @param {boolean} enabledByDefault Whether the Behavior starts out enabled. Default: `true`.
	 */
	constructor(gameObject, enabledByDefault = true) {
		super(gameObject.scene);

		this.gameObject = gameObject;
		gameObject.behaviors.push(this);

		this.enabled = enabledByDefault;
	}
}

export default Behavior;
