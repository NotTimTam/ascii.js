import { Pixel } from "../engine/Renderer.js";
import Core from "./Core.js";

class GameObject extends Core {
	/**
	 * A core object that can have its runtime methods managed by the runtime itself, or another object.
	 *
	 * `GameObject`s can have a `get renderable()` get method that returns a `Pixel` or `PixelMesh` object for rendering purposes.
	 * `GameObject`s do not always need to be rendered, and a `get renderable()` method is not indicative of whether the `GameObject`'s logic will function.
	 * `GameObject`s will not be rendered unless they are added to a layer.
	 *
	 * @param {Runtime} runtime The main runtime object.
	 * @param {number} x This entity's x-coordinate.
	 * @param {number} y This entity's y-coordinate.
	 */
	constructor(runtime, x = 0, y = 0) {
		super(runtime);

		if (typeof x !== "number")
			throw new Error(
				"Entity x-coordinate value must be of type 'number'."
			);

		if (typeof y !== "number")
			throw new Error(
				"Entity y-coordinate value must be of type 'number'."
			);

		this.__rawX = x;
		this.__rawY = y;
		this.__rawVisible = true;

		this.behaviors = [];
	}

	/**
	 * Get whether the game object is on-screen.
	 */
	get isOnScreen() {
		const {
			runtime: {
				renderer: { camera },
			},
			x,
			y,
		} = this;

		if (!this.renderable) return false;

		const { width, height } = this.renderable;
		const [pX, pY] = this.layer.parallax;

		return camera.isOnScreen(x, y, width, height, pX, pY);
	}

	/**
	 * Get the `GameObject`'s visibility status.
	 */
	get visible() {
		return this.__rawVisible;
	}

	/**
	 * Set the `GameObject`'s visibility status.
	 */
	set visible(value) {
		this.__rawVisible = Boolean(value);
	}

	/**
	 * Get the game object's adjusted x-coordinate.
	 */
	get x() {
		return Math.round(this.__rawX);
	}

	/**
	 * Set the game object's x-coordinate.
	 */
	set x(n) {
		if (typeof n !== "number")
			throw new Error(
				"Entity x-coordinate value must be of type 'number'."
			);
		this.__rawX = n;
	}

	/**
	 * Get the game object's adjusted y-coordinate.
	 */
	get y() {
		return Math.round(this.__rawY);
	}

	/**
	 * Set the game object's y-coordinate.
	 */
	set y(n) {
		if (typeof n !== "number")
			throw new Error(
				"Entity y-coordinate value must be of type 'number'."
			);
		this.__rawY = n;
	}

	/**
	 * Get the `GameObject`'s current layer.
	 */
	get layer() {
		const {
			runtime: {
				renderer: {
					layerManager: { layers },
				},
			},
		} = this;

		return layers.find(({ gameObjects }) => gameObjects.includes(this));
	}

	/**
	 * Get the label of the `GameObject`'s current layer.
	 */
	get layerLabel() {
		return this.layer && this.layer.label;
	}

	/**
	 * Change the `GameObject`'s layer. Set to a falsey value to remove from any active layers.
	 * @param {string} layer The name of the layer to move to.
	 */
	set layer(label) {
		// Remove from its current layer.
		if (this.layer) {
			// Filter this object from its layer.
			this.layer.gameObjects = this.layer.gameObjects.filter(
				(gameObject) => gameObject !== this
			);
		}

		// If the label was undefined, we don't add to a new layer, if it was defined, we do.
		if (label) {
			if (typeof label !== "string")
				throw new Error("Provided layer label is not a string.");

			const {
				runtime: {
					renderer: {
						layerManager: { layers },
					},
				},
			} = this;

			const layer = layers.find((layer) => layer.label === label);

			if (!layer)
				throw new Error(`No layer exists with label "${label}"`);

			layer.gameObjects.push(this);
		}
	}

	/**
	 * The object's renderable element.
	 */
	get renderable() {
		return new Pixel({ value: "#", color: "red" });
	}

	/**
	 * Whether the object is on a paused layer or the runtime is paused.
	 *
	 * This should be checked when input and logic functions are called, to ensure they do not run when the `GameObject` is paused.
	 *
	 * This **does not** need to be checked in the `GameObject`s `__onTick()` method, as the `__onTick()` method is not called by its parent layer when that layer is paused.
	 */
	get paused() {
		const { runtime, layer } = this;

		if ((layer && layer.paused) || runtime.paused) return true;
		else return false;
	}

	/**
	 * Run the events of each object behavior.
	 *
	 * Runs before this `GameObject`'s `__onTick` method.
	 */
	__behave() {
		for (const behavior of this.behaviors)
			behavior.enabled && behavior.__onTick && behavior.__onTick();
	}

	/**
	 * Filter this `GameObject` out of an array.
	 * @param {Array<GameObject>} array The array of game objects. The items in the array can either be `GameObject`s or an object with a `gameObject` key set to a `GameObject` instance.
	 * @returns {Array<GameObject>} An array without this `GameObject`.
	 */
	filterThis = (array) =>
		array.filter((item) =>
			item instanceof GameObject
				? item !== this
				: item.gameObject !== this
		);
}

export default GameObject;
