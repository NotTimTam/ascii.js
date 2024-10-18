import Text from "../objects/Text.js";
import { isPlainObject } from "../util/data.js";
import GameObject from "./GameObject.js";

class Focusable extends GameObject {
	/**
	 * Extends the `GameObject` class to include several methods and properties for handling input focus.
	 * @param {Scene} scene The scene this Object is a part of.
	 * @param {Object} config The `Focusable`'s config object.
	 * @param {number} config.x This `Focusable` object's x-coordinate.
	 * @param {number} config.y This `Focusable` object's y-coordinate.
	 * @param {string} config.layer The label of the layer to start the `Focusable` on.
	 * @param {boolean} config.autoFocus Whether to automatically focus on the `Focusable` after it has been instantiated. Default `false`.
	 * @param {boolean} config.maintainFocus Forces the focusable to stay focused. Default `false`.
	 * @param {boolean} config.deleteOnBlur Whether to delete the focusable when it becomes unfocused. Default `false`. **NOTE:** If `config.autoFocus` is set to false, the `Focusable` will be deleted immediately!
	 * @param {function} config.onFocus A callback that triggers when this element gains focus.
	 * @param {function} config.onBlur A callback that triggers when this element loses focus.
	 */
	constructor(scene, config) {
		if (!isPlainObject(config))
			throw new TypeError(
				"Expected a plain object for Focusable constructor config parameter."
			);

		const {
			x,
			y,
			layer,
			autoFocus = false,
			maintainFocus = false,
			deleteOnBlur = false,
			onFocus,
			onBlur,
		} = config;

		super(scene, x, y, layer);

		this.autoFocus = Boolean(autoFocus);
		this.maintainFocus = Boolean(maintainFocus);
		this.deleteOnBlur = Boolean(deleteOnBlur);

		if (onFocus) {
			if (typeof onFocus !== "function")
				throw new TypeError(
					"Expected a function for Focusable.config.onFocus property."
				);

			this.onFocus = onFocus;
		}

		if (onBlur) {
			if (typeof onBlur !== "function")
				throw new TypeError(
					"Expected a function for Focusable.config.onBlur property."
				);

			this.onBlur = onBlur;
		}

		scene.inputManager.addFocusable(this);

		console.log(this);
	}

	__focusDefault() {}
	__blurDefault() {}
	__clickDefault() {}

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
		const { focusables } = this.scene.inputManager;

		bool = Boolean(bool);

		if (bool) {
			this.scene.inputManager.__focusIndex = focusables.indexOf(this); // Focus on this element.
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

export default Focusable;
