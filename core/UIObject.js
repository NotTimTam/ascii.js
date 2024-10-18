import { isPlainObject } from "../util/data.js";
import GameObject from "./GameObject.js";

class UIObject extends GameObject {
	/**
	 * A collection of default methods for input handling.
	 */
	static eventDefaults = {
		keydown: (
			uIObjectInstance,
			inputManager,
			{ preventBrowserDefault, keys: { shift, tab } }
		) => {
			if (tab) preventBrowserDefault();
			else return;

			// Shift + Tab.
			if (shift) inputManager.focusPrevious();
			// Shift only.
			else inputManager.focusNext();
		},
	};

	/**
	 * Extends the `GameObject` class to include several methods and properties for treating the object as a UI element.
	 *
	 * Because `UIObject` contains all the features and expected functionality of a regular `GameObject`, this class can be used like a `GameObject`, just with more direct event listening.
	 *
	 * An instance's `tabIndex` can be set to `-1` to prevent focusing of the instance.
	 *
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

		this.inputManager = scene.inputManager;

		this.__rawTabIndex = 0;

		scene.inputManager.addUIObject(this);
	}

	/**
	 * Determine if this element is focusable.
	 */
	get focusable() {
		return Boolean(this.tabIndex !== -1);
	}

	/**
	 * Get this object's tab index.
	 */
	get tabIndex() {
		return this.__rawTabIndex;
	}

	/**
	 * Set this object's tab index.
	 */
	set tabIndex(n) {
		if (typeof n !== "number" || !Number.isInteger(n))
			throw new TypeError(
				"UIObject instance tabIndex property must be an integer."
			);

		if (n < -1) n = -1;

		this.__rawTabIndex = n;
	}

	/**
	 * Get all event listeners associated with this `UIObject`.
	 */
	get eventListeners() {
		return this.inputManager.getUIObjectEventListeners(this.id);
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

		if (!this.focusable) bool = false; // Always set focused to false if the instance cannot be focused on.

		if (bool) {
			this.scene.inputManager.focusIndex = uIObjects.indexOf(this); // Focus on this element.
			this.onFocus && this.onFocus(); // Trigger focus event.
		} else if (this.focused) {
			this.scene.inputManager.focusIndex = -1; // Otherwise blur this element if it is focused.
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

	/**
	 * Add an event listener to the `UIObject`.
	 * @param {string} type The type of event to add.
	 * @param {function} listener The event listener function.
	 */
	addEventListener = (type, listener) =>
		this.inputManager.addUIObjectEventListener(
			this.id,
			type,
			listener.bind(this)
		);

	/**
	 * Remove an event listener from the `UIObject`.
	 * @param {string} type The type of event to remove.
	 * @param {function} listener The event listener function that was added to the event listener.
	 */
	removeEventListener = (type, listener) =>
		this.inputManager.removeUIObjectEventListener(
			this.id,
			type,
			listener.bind(this)
		);
}

export default UIObject;
