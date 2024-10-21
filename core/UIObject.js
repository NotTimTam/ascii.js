import { isPlainObject } from "../util/data.js";
import GameObject from "./GameObject.js";

/**
 * Configuration data for the `UIObject` class.
 * @typedef {Object} UIObjectConfig
 * @property {number} x This `UIObject` object's x-coordinate.
 * @property {number} y This `UIObject` object's y-coordinate.
 * @property {number} tabIndex A numeric value determining the index in the focus array this `UIObject` should fall at. The higher an instance's `tabIndex`, the further down the list it will be.
 *
 * A `tabIndex` of `-1` will mark the `UIObject` instance as "unfocusable", meaning focus-based events, such as `keydown` events specific to this `UIObject`, will not be triggered. Default `0`.
 * @property {string} layer The label of the layer to start the `UIObject` on.
 * @property {boolean} autoFocus Whether to automatically focus on this `UIObject` after its instantiation. Default `false`.
 * @property {boolean} maintainFocus Force the `InputManager` to keep this `UIObject` in focus, even if attempts are made to focus on other `UIObject`s. Default `false`.
 */

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
			console.log("TDEFAULT");

			if (uIObjectInstance.maintainFocus) return;

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
	 * @param {Scene} scene The scene this Object is a part of.
	 * @param {UIObjectConfig} config The `UIObject`'s config object.
	 */
	constructor(scene, config) {
		if (!isPlainObject(config))
			throw new TypeError(
				"Expected a plain object for UIObject constructor config parameter."
			);

		const {
			x,
			y,
			layer,
			tabIndex = 0,
			autoFocus = false,
			maintainFocus = false,
		} = config;

		super(scene, x, y, layer);

		this.inputManager = scene.inputManager;
		this.tabIndex = tabIndex || 0;
		this.maintainFocus = Boolean(maintainFocus);

		scene.inputManager.addUIObject(this);

		if (Boolean(autoFocus)) this.focus();
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
		const { uIObjects, focusTarget } = this.scene.inputManager;

		bool = Boolean(bool);

		if (!this.focusable)
			bool = false; // Always set focused to false if the instance cannot be focused on.
		else if (this.maintainFocus) bool = true; // Don't allow focus to be lost if maintainFocus is true.

		if (bool && focusTarget && focusTarget.maintainFocus) return; // Don't focus on this UIObject if one is focused on that has maintainFocus set to true.

		if (bool) this.scene.inputManager.focusIndex = uIObjects.indexOf(this);
		// Focus on this element.
		else if (this.focused) this.scene.inputManager.focusIndex = -1; // Otherwise blur this element if it is focused.
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
