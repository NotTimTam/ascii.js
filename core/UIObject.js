import { isPlainObject } from "../util/data.js";
import GameObject from "./GameObject.js";

class UIObject extends GameObject {
	/**
	 * A collection of default methods for input handling.
	 */
	static eventDefaults = {};

	/**
	 * Extends the `GameObject` class to include several methods and properties for treating the object as a UI element.
	 * @param {Scene} scene The scene this Object is a part of.
	 * @param {Object} config The `UIObject`'s config object.
	 * @param {number} config.x This `UIObject` object's x-coordinate.
	 * @param {number} config.y This `UIObject` object's y-coordinate.
	 * @param {string} config.layer The label of the layer to start the `UIObject` on.
	 */
	constructor(scene, config) {
		if (!isPlainObject(config))
			throw new TypeError(
				"Expected a plain object for UIObject constructor config parameter."
			);

		const { x, y, layer } = config;

		super(scene, x, y, layer);

		scene.inputManager.addUIObject(this);

		console.log(this);
	}

	/**
	 * Check if this instance is currently in focus.
	 */
	get focused() {
		const { focusTarget } = this.scene.inputManager;

		return Boolean(focusTarget && focusTarget === this);
	}

	/**
	 * Set the focus state of this instance.
	 */
	set focused(bool) {
		const { uIObjects } = this.scene.inputManager;

		bool = Boolean(bool);

		if (bool) {
			this.scene.inputManager.__focusIndex = uIObjects.indexOf(this); // Focus on this element.
			this.onFocus && this.onFocus(); // Trigger focus event.
		} else if (this.focused) {
			this.scene.inputManager.__focusIndex = -1; // Otherwise blur this element if it is focused.
			this.onBlur && this.onBlur(); // Trigger blur event.
		}
	}

	/**
	 * Focus on this element.
	 */
	focus() {
		this.focused = true;
	}

	/**
	 * Blur this element if it is focused.
	 */
	blur() {
		this.focused = false;
	}
}

export default UIObject;
