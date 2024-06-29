import { Pixel } from "../engine/renderer.js";
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
	constructor(runtime, x, y) {
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

		this.layer = "system";
	}

	get x() {
		return Math.round(this.__rawX);
	}
	set x(n) {
		if (typeof n !== "number")
			throw new Error(
				"Entity x-coordinate value must be of type 'number'."
			);
		this.__rawX = n;
	}

	get y() {
		return Math.round(this.__rawY);
	}
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
		if (!label) {
			if (this.layer) {
				// Filter this object from its layer.
				this.layer.gameObjects = this.layer.gameObjects.filter(
					(gameObject) => gameObject !== this
				);
			}
		} else {
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
		return new Pixel("#", "red");
	}
}

export default GameObject;
