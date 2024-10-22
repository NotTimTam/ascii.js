import Core from "./Core.js";
import Pixel, { PixelMesh } from "./Pixel.js";

class GameObject extends Core {
	/**
	 * Configuration data for the `GameObject` class.
	 * @typedef {Object} GameObjectConfig
	 * @property {number} x This `GameObject` object's x-coordinate.
	 * @property {number} y This `GameObject` object's y-coordinate.
	 * @property {number} zIndex A numeric value determining the rendering heirarchy position this `GameObject` should fall in.
	 *
	 * `GameObject`s with higher z-indeces will be drawn on top of those with lower z-indeces. Default `0`.
	 * @property {?string} layer The (optional) label of the layer to initialize the `GameObject` on.
	 */

	/**
	 * A core object that can have its runtime methods managed by the runtime itself, or another object.
	 *
	 * `GameObject`s can have a `get renderable()` get method that returns a `Pixel` or `PixelMesh` object for rendering purposes.
	 * `GameObject`s do not always need to be rendered, and a `get renderable()` method is not indicative of whether the `GameObject`'s logic will function.
	 * `GameObject`s will not be rendered unless they are added to a layer.
	 *
	 * @param {Scene} scene The scene this `GameObject` is a part of.
	 * @param {GameObjectConfig} config This `GameObject`'s configuration object.
	 */
	constructor(scene, config) {
		super(scene);

		const { x = 0, y = 0, zIndex = 0, layer = "system" } = config;

		this.x = x;
		this.y = y;
		this.zIndex = zIndex;
		this.__rawVisible = true;
		this.__rawRenderable = new Pixel({ value: "#", color: "magenta" });

		this.behaviors = [];

		if (layer) this.layer = layer;
	}

	/**
	 * Get this object's tab index.
	 */
	get zIndex() {
		return this.hasOwnProperty("__rawZIndex")
			? this.__rawZIndex
			: this.layer.gameObjects.indexOf(this);
	}

	/**
	 * Set this object's tab index.
	 */
	set zIndex(n) {
		if (typeof n !== "number" || !Number.isInteger(n))
			throw new TypeError(
				"GameObject instance zIndex property must be an integer."
			);

		this.__rawZIndex = n;
	}

	/**
	 * Get this `GameObject`'s position on the screen, relative to the camera and the layer parallax.
	 * Return format: `[x, y]`
	 */
	get positionOnScreen() {
		if (!this.layer) return undefined;

		const {
			scene: { camera },
			layer: {
				parallax: [pX, pY],
			},
		} = this;

		// Camera position based on parallax.
		const [adjustedCameraX, adjustedCameraY] = [
			Math.round(camera.x * pX),
			Math.round(camera.y * pY),
		];

		return [this.relX - adjustedCameraX, this.relY - adjustedCameraY]; // Position relative to camera.
	}

	/**
	 * Get whether the game object is on-screen.
	 */
	get isOnScreen() {
		if (!this.scene) return false;
		return this.scene.camera.isGameObjectOnScreen(this);
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
	 * Get the `GameObject`s relative x-position. Automatically returns the object's global position relative its parent if it has one.
	 */
	get relX() {
		if (this.positionInParent)
			return this.parent.relX + this.positionInParent[0];
		else return this.x;
	}

	/**
	 * Get the `GameObject`s relative y-position. Automatically returns the object's global position relative in its parent if it has one.
	 */
	get relY() {
		if (this.positionInParent)
			return this.parent.relY + this.positionInParent[1];
		else return this.y;
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
		if (!this.renderable) return 0;

		return this.renderable.width;
	}

	/**
	 * Get the height of this `GameObject`'s renderable.
	 */
	get height() {
		if (!this.renderable) return 0;

		return this.renderable.height;
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
	 * Get this `GameObject`'s child `GameObject`s.
	 */
	get children() {
		return this.__rawChildren || [];
	}

	/**
	 * Set this `GameObject`'s child `GameObject`s.
	 */
	set children(arr) {
		if (!arr) arr = [];

		if (!(arr instanceof Array))
			throw new TypeError(
				`A GameObject's "children" property must be an array.`
			);

		for (const gA of arr) {
			if (!(gA instanceof GameObject))
				throw new TypeError(
					`Each object in a GameObject's "children" array must be an instance of GameObject.`
				);
		}

		this.__rawChildren = arr;
	}

	/**
	 * Get this child's position in its parent.
	 */
	get positionInParent() {
		if (
			!this.parent ||
			!this.parent.getChildPosition ||
			typeof this.parent.getChildPosition !== "function"
		)
			return undefined;

		const pos = this.parent.getChildPosition(this);

		if (
			!(pos instanceof Array) ||
			pos.length !== 2 ||
			pos.find((v) => typeof v !== "number" || isNaN(v))
		)
			throw new TypeError(
				`A GameObject's "getChildPosition" method must return an array in format: [x, y]`
			);

		return pos;
	}

	/**
	 * Get this `GameObject`'s parent `GameObject`.
	 */
	get parent() {
		return this.scene.gameObjects.find(({ children }) =>
			children.includes(this)
		);
	}

	/**
	 * Set this `GameObject`'s parent `GameObject`.
	 */
	set parent(gameObject) {
		if (gameObject) {
			if (!(gameObject instanceof GameObject) || gameObject === this)
				throw new TypeError(
					`A GameObject's "parent" property must be an instance of GameObject, or null. The GameObject cannot parent itself.`
				);

			if (gameObject.children.includes(this)) return;

			gameObject.children.push(this);
		} else {
			gameObject.children = gameObject.children.filter(
				(gA) => gA !== this
			);
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
