import { aabb } from "../util/math.js";
import GameObject from "../core/GameObject.js";
import Pixel, { PixelMesh } from "../core/Pixel.js";
import Frame from "./Frame.js";
import Scene from "./Scene.js";
import { isPlainObject } from "../util/data.js";

export class Layer {
	/**
	 * A layer is a construct of other objects. The layer manages these objects and can optionally render them to the screen.
	 * @param {LayerManager} layerManager The `LayerManager` parent object.
	 * @param {Object} config The `Layer`'s config object.
	 * @param {string} config.label This layer's label.
	 * @param {Array<Number>} config.parallax This layer's parallax array. `[x, y]` Numbers 0-1 determine how much this layer moves with the camera. `[0, 0]` for layers that do not move.
	 * @param {Array<function>} config.gameObjectConstructors An array of functions that return game objects.
	 */
	constructor(layerManager, config) {
		if (!isPlainObject(config))
			throw new TypeError(
				"Expected a plain object for Layer constructor config parameter."
			);

		const { label, parallax = [1, 1], gameObjectConstructors } = config;

		this.layerManager = layerManager;
		this.label = label;

		this.layerManager.layers.push(this);

		this.gameObjects = [];

		if (gameObjectConstructors)
			this.__populateGameObjects(gameObjectConstructors);

		this.paused = false;

		this.parallax = parallax;

		this.__rawVisible = true;
	}

	/**
	 * Converts the config array of gameObjects into active `GameObject`s.
	 * @param {Array<Function|GameObject>} gameObjectConstructors The array of `GameObject` population functions to run. Each function is passed the current `Scene` instance.
	 * @returns {Array<GameObject>} The new array of `GameObject`s.
	 */
	__populateGameObjects(gameObjectConstructors) {
		for (const gameObjectConstructor of gameObjectConstructors)
			if (typeof gameObjectConstructor !== "function")
				throw new TypeError(
					'Each value provided to a Layer\'s "configuration.gameObjects"'
				);

		this.gameObjects = gameObjectConstructors
			.map((gameObjectConstructor) => {
				const gameObject = gameObjectConstructor(
					this.layerManager.scene
				);

				if (!(gameObject instanceof GameObject))
					throw new TypeError(
						'Each gameObjectConstructor function must return an object of type "GameObject".'
					);

				return gameObject;
			})
			.filter(
				(gameObject) => gameObject && gameObject instanceof GameObject
			);

		for (const gameObject of this.gameObjects)
			gameObject.layer = this.label; // Put game object on this layer.
	}

	/**
	 * Get the `Layer`'s visibility status.
	 */
	get visible() {
		return this.__rawVisible;
	}

	/**
	 * Set the `Layer`'s visibility status.
	 */
	set visible(value) {
		this.__rawVisible = Boolean(value);
	}

	/**
	 * Returns a frame composed of a layer's objects.
	 */
	get frame() {
		const {
			layerManager: {
				scene: {
					camera,
					runtime: { renderer },
				},
			},
			parallax: [pX, pY],
		} = this;

		const [adjustedCameraX, adjustedCameraY] = [
			Math.round(camera.x * pX),
			Math.round(camera.y * pY),
		];

		const renderPixel = (pixel, x, y) => {
			// Invalid passthoughs, and pixels that are not on screen are not added to the buffer.
			if (
				!pixel ||
				!(pixel instanceof Pixel) ||
				!camera.isOnScreen(x, y, 1, 1, pX, pY)
			)
				return;

			// Pixel that would not be displayed are not added to the buffer.
			if (
				(!pixel.value || pixel.value.trim() === "") &&
				(!pixel.backgroundColor ||
					pixel.backgroundColor === "transparent")
			)
				return;

			// Get position relative to the camera, and then index in the buffer from that position.
			const [xOS, yOS] = [x - adjustedCameraX, y - adjustedCameraY];
			const index = renderer.coordinatesToIndex(xOS, yOS);

			// Add pixel at that position.
			frameData[index] = pixel;
		};

		const frameData = [];

		for (const gameObject of this.gameObjects.filter(
			({ visible, parent }) => visible && !parent
		)) {
			const { renderable } = gameObject;
			let { x, y } = gameObject;

			if (!renderable) continue;
			else {
				if (renderable.origin) {
					const [oX, oY] = renderable.origin;

					x -= oX;
					y -= oY;

					x = Math.round(x);
					y = Math.round(y);
				}

				if (renderable instanceof Pixel) {
					renderPixel(renderable, x, y);
				} else if (renderable instanceof PixelMesh) {
					if (
						!camera.isOnScreen(
							x,
							y,
							renderable.width,
							renderable.height,
							pX,
							pY
						)
					)
						continue;

					for (
						let pixelY = 0;
						pixelY < renderable.data.length;
						pixelY++
					) {
						const row = renderable.data[pixelY];

						if (!row || row.length === 0) continue;

						for (let pixelX = 0; pixelX < row.length; pixelX++) {
							const pixel = row[pixelX];

							renderPixel(pixel, x + pixelX, y + pixelY);
						}
					}
				}
			}
		}

		return new Frame(frameData);
	}

	__onTick() {
		const {
			layerManager: {
				scene: { runtime },
			},
			gameObjects,
			paused,
		} = this;

		if (paused || runtime.paused) return; // Don't run this layer's code if it or the runtime is paused.

		for (const gameObject of gameObjects) {
			gameObject.__behave();
			runtime.__runOnTick(gameObject);
		}
	}
}

class LayerManager {
	/**
	 * The layer manager contains variable layers and compiles them into one frame to render to the screen.
	 * @param {Scene} scene The current loaded `Scene`.
	 * @param {Object[]} layers The layer configuration objects.
	 */
	constructor(scene, layers) {
		this.scene = scene;
		this.layers = layers;
	}

	/**
	 * Get all visible layers in this `LayerManager`.
	 */
	get visibleLayers() {
		return this.layers.filter((layer) => layer.visible);
	}

	/**
	 * Get a layer by its label.
	 * @param {string} label The label of the layer to get.
	 * @returns {Layer} A layer with the label provided. Or `undefined` if no layer was found.
	 */
	getLayerByLabel = (label) =>
		this.layers.find((layer) => layer.label === label);

	/**
	 * Check for content at a location.
	 * @param {number} x The x-coordinate to check.
	 * @param {number} y The y-coordinate to check.
	 * @param {?string} layer An optional layer to check. If no layer is provided, all layer's are checked.
	 */
	getAtPosition(x, y, layer) {
		const layerWithLabel = this.layers.find(({ label }) => label === layer);
		if (layer && !layerWithLabel)
			throw new Error(`No layer exists with label "${layer}".`);

		const layersToCheck = layer ? [layerWithLabel] : this.layers;

		const atPosition = [];

		for (const layer of layersToCheck) {
			const { gameObjects } = layer;

			for (const gameObject of gameObjects) {
				const { renderable, x: gX, y: gY } = gameObject;
				if (renderable instanceof Pixel && gX === x && gY === y)
					atPosition.push({ gameObject, pixel: renderable });
				else if (
					renderable instanceof PixelMesh &&
					aabb(
						x,
						y,
						1,
						1,
						gX,
						gY,
						renderable.width,
						renderable.height
					)
				) {
					const pixel =
						renderable.data[y - gY] &&
						renderable.data[y - gY][x - gX];

					if (!pixel) continue;

					atPosition.push({
						gameObject,
						pixel,
					});
				}
			}
		}

		return atPosition;
	}

	/**
	 * Check for a solid at a location.
	 * @param {number} x The x-coordinate to check.
	 * @param {number} y The y-coordinate to check.
	 * @param {?string} layer An optional layer to check. If no layer is provided, all layer's are checked.
	 */
	solidAtPosition(x, y, layer) {
		const thingsAt = this.getAtPosition(x, y, layer);

		for (const thing of thingsAt) if (thing.pixel.solid) return thing;
		return false;
	}

	/**
	 * Create layers from config.
	 * @param {Array<*>} layers The layer creation array.
	 */
	__createLayers(layers = []) {
		this.layers = [];

		if (!layers.includes("system")) new Layer(this, { label: "system" });
		for (const config of layers) {
			if (this.getLayerByLabel(config.label))
				throw new Error(
					`More than one layer is currently configured with the label: "${config.label}"`
				);
			new Layer(this, config);
		}
	}

	__mergedRender() {
		const {
			scene: {
				runtime: { renderer },
			},
		} = this;

		const frame = renderer.compileFrames(
			...this.visibleLayers.map((layer) => layer.frame)
		);

		if (JSON.stringify(frame) === this.lastFrame && renderer.hasDrawn)
			return;

		this.lastFrame = JSON.stringify(frame);

		renderer.drawFrames([frame]);
	}

	__stackedRender() {
		const {
			scene: {
				runtime: { renderer },
			},
		} = this;

		const frames = this.visibleLayers.map((layer) => layer.frame);

		renderer.drawFrames(frames);
	}

	__onLoad() {
		this.__createLayers(this.layers);
	}

	__onTick() {
		const {
			scene: {
				runtime,
				runtime: {
					renderer: {
						config: { renderMode },
					},
				},
			},
		} = this;

		// Logic
		if (!runtime.paused) {
			for (const layer of this.layers) layer.__onTick();
		}

		// Render
		if (renderMode === "stacked") this.__stackedRender();
		else this.__mergedRender();
	}
}

export default LayerManager;
