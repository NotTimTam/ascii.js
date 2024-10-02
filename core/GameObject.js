import Core from "./Core.js";
import Pixel, { PixelMesh } from "./Pixel.js";

class GameObject extends Core {
	/**
	 * A core object that can have its runtime methods managed by the runtime itself, or another object.
	 *
	 * `GameObject`s can have a `get renderable()` get method that returns a `Pixel` or `PixelMesh` object for rendering purposes.
	 * `GameObject`s do not always need to be rendered, and a `get renderable()` method is not indicative of whether the `GameObject`'s logic will function.
	 * `GameObject`s will not be rendered unless they are added to a layer.
	 *
	 * @param {Scene} scene The scene this `GameObject` is a part of.
	 * @param {number} x This `GameObject`'s x-coordinate.
	 * @param {number} y This  `GameObject`'s y-coordinate.
	 *@param {string} layer The label of the layer to start the `GameObject` on.
	 */
	constructor(scene, x = 0, y = 0, layer) {
		super(scene);

		if (typeof x !== "number")
			throw new Error(
				"GameObject x-coordinate value must be of type 'number'."
			);

		if (typeof y !== "number")
			throw new Error(
				"GameObject y-coordinate value must be of type 'number'."
			);

		this.__rawX = x;
		this.__rawY = y;
		this.__rawVisible = true;
		this.__rawRenderable = new Pixel({ value: "#", color: "magenta" });

		this.behaviors = [];

		if (layer) this.layer = layer;
	}

	/**
	 * Get whether the game object is on-screen.
	 */
	get isOnScreen() {
		if (!this.scene || !this.layer) return false;

		const {
			scene: { camera },
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
	 * If the `GameObject` is not part of a layer,
	 * or is in a `Layer` whose `visible` parameter is false,
	 * it will also be false.
	 */
	get visible() {
		return this.__rawVisible && this.layer && this.layer.visible;
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
				"GameObject x-coordinate value must be of type 'number'."
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
				"GameObject y-coordinate value must be of type 'number'."
			);
		this.__rawY = n;
	}

	/**
	 * Get the width of this `GameObject`'s renderable.
	 */
	get width() {
		return (this.renderable && this.renderable.width) || 0;
	}

	/**
	 * Get the height of this `GameObject`'s renderable.
	 */
	get height() {
		return (this.renderable && this.renderable.height) || 0;
	}

	/**
	 * Get the origin of this `GameObject`'s renderable.
	 */
	get origin() {
		return (this.renderable && this.renderable.origin) || [0, 0];
	}

	/**
	 * Get the `GameObject`'s current layer.
	 */
	get layer() {
		return this.scene.layerManager.layers.find(({ gameObjects }) =>
			gameObjects.includes(this)
		);
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
				scene: {
					layerManager: { layers },
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
		return this.__rawRenderable;
	}

	/**
	 * Set this `GameObject`'s renderable.
	 */
	set renderable(value) {
		if (value && !(value instanceof Pixel) && !(value instanceof PixelMesh))
			throw new TypeError(
				"A GameObject's renderable property must be an instance of Pixel, an instance of PixelMesh, or falsey."
			);

		this.__rawRenderable = value;
	}

	/**
	 * Restore the initial getter/setter functionality for this `GameObject` instance's `renderable` property.
	 */
	__resetRenderable() {
		Object.defineProperty(this, "renderable", {
			get() {
				return this.__rawRenderable;
			},

			set(value) {
				if (
					value &&
					!(value instanceof Pixel) &&
					!(value instanceof PixelMesh)
				)
					throw new TypeError(
						"A GameObject's renderable property must be an instance of Pixel, an instance of PixelMesh, or falsey."
					);

				this.__rawRenderable = value;
			},

			configurable: true,
			enumerable: true,
		});
	}

	/**
	 * Whether the object is on a paused layer or the runtime is paused.
	 *
	 * This should be checked when input and logic functions are called, to ensure they do not run when the `GameObject` is paused.
	 *
	 * This **does not** need to be checked in the `GameObject`s `onTick()` method, as the `onTick()` method is not called by its parent layer when that layer is paused.
	 */
	get paused() {
		const { runtime, layer } = this;

		if ((layer && layer.paused) || runtime.paused) return true;
		else return false;
	}

	/**
	 * Run the events of each object behavior.
	 *
	 * Runs before this `GameObject`'s `onTick` method.
	 */
	__behave() {
		if (!this.paused)
			for (const behavior of this.behaviors)
				behavior.enabled && behavior.onTick && behavior.onTick();
	}

	/**
	 * Delete this `GameObject`.
	 *
	 * **NOTE:** JavaScript has an automatic garbage collector, which means as long as an object is not referenced anywhere, it will be removed from memory.
	 * This method will remove references to the object from engine-created runtime objects. Custom objects or variables that reference this object must stop referencing it before it is fully removed from memory.
	 *
	 *
	 * At minimum, this functions behaviors and tick methods will stop when `GameObject.delete()` is executed. Unless they are called from somewhere other than its parent `Layer`.
	 */
	delete() {
		if (this.layer) this.layer = undefined;
		delete this;
	}
}

export default GameObject;
