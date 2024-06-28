import { Pixel } from "../engine/renderer.js";
import Core from "./Core.js";

class GameObject extends Core {
	/**
	 * A core object that can have its runtime methods managed by the runtime itself, or another object.
	 * @param {Runtime} runtime The main runtime object.
	 * @param {boolean} selfContained When true, this object's __onTick and __onStartup methods are not called by the runtime object, as it becomes self contained. Default: `false`.
	 */
	constructor(runtime, selfContained = false) {
		super(runtime);
		this.selfContained = selfContained;

		if (!this.selfContained) this.runtime.gameObjects.push(this);
	}
}

export default GameObject;
