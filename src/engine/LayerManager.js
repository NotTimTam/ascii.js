import Renderer, { Frame, Pixel, PixelMesh } from "./renderer.js";
import Core from "../core/Core.js";
import { aabb } from "../util/math.js";

export class Layer extends Core {
	/**
	 * A layer is a construct of other objects. The layer manages these objects and can optionally render them to the screen.
	 * @param {LayerManager} layerManager The `LayerManager` parent object.
	 * @param {*} config The `Layer`'s config object.
	 * @param {string} config.label This layer's label.
	 * @param {Array<Number>} config.parallax This layer's parallax array. `[x, y]` Numbers 0-1 determine how much this layer moves with the camera. `[0, 0]` for layers that do not move.
	 */
	constructor(layerManager, config) {
		super(layerManager.runtime);

		const { label, parallax = [1, 1] } = config;

		this.layerManager = layerManager;
		this.label = label;

		this.layerManager.layers.push(this);

		this.gameObjects = [];

		this.paused = false;

		this.parallax = parallax;
	}

	/**
	 * Returns a frame composed of a layer's objects.
	 */
	get frame() {
		const {
			layerManager: {
				renderer,
				renderer: { camera },
			},
			parallax: [pX, pY],
		} = this;

		const [adjustedCameraX, adjustedCameraY] = [
			Math.round(camera.x * pX),
			Math.round(camera.y * pY),
		];

		const frameData = [];

		for (const { renderable, x, y } of this.gameObjects) {
			if (!renderable) continue;
			else if (renderable instanceof Pixel) {
				if (!camera.isOnScreen(x, y, 1, 1, pX, pY)) continue;

				const [xOS, yOS] = [x - adjustedCameraX, y - adjustedCameraY];
				const index = renderer.coordinatesToIndex(xOS, yOS);

				frameData[index] = renderable;
			} else if (renderable instanceof PixelMesh) {
				if (
					!camera.isOnScreen(
						x,
						y,
						renderable.width,
						renderable.height
					)
				)
					continue;

				for (
					let pixelY = 0;
					pixelY < renderable.data.length;
					pixelY++
				) {
					const row = renderable.data[pixelY];

					if (row.length === 0 || !row) continue;

					for (let pixelX = 0; pixelX < row.length; pixelX++) {
						const pixel = row[pixelX];
						if (
							!pixel ||
							!(pixel instanceof Pixel) ||
							!camera.isOnScreen(
								x + pixelX,
								y + pixelY,
								1,
								1,
								pX,
								pY
							)
						)
							continue;

						const [xOS, yOS] = [
							x + pixelX - adjustedCameraX,
							y + pixelY - adjustedCameraY,
						];

						// Why are things that are off screen by one point considered on screen.
						if (
							xOS < 0 ||
							yOS < 0 ||
							xOS >= renderer.width ||
							yOS >= renderer.height
						)
							continue;

						const index = renderer.coordinatesToIndex(xOS, yOS);

						frameData[index] = pixel;
					}
				}
			}
		}

		return new Frame(frameData);
	}

	__onTick() {
		const { runtime, gameObjects, paused } = this;

		if (paused || runtime.paused) return; // Don't run this layer's code if it or the runtime is paused.

		for (const gameObject of gameObjects) runtime.__runOnTick(gameObject);
	}
}

class LayerManager {
	/**
	 * The layer manager contains variable layers and compiles them into one frame to render to the screen.
	 * @param {Renderer} renderer The main runtime's renderer object.
	 */
	constructor(renderer) {
		this.renderer = renderer;
		this.runtime = renderer.runtime;
		this.config = this.renderer.config && this.renderer.config.layerManager;

		LayerManager.validateConfig(this.config);

		this.layers = [];
	}

	/**
	 * Validates a renderer configuration file and throws an error if it is invalid.
	 * @param {*} config The config object to validate.
	 */
	static validateConfig(config) {
		if (!config.layers || config.layers.length === 0)
			throw new Error(
				"No 'layers' configuration provided to LayerManager config."
			);

		for (const { label } of config.layers)
			if (typeof label !== "string")
				throw new Error(
					`Provided layer name <${layerName}> is not of type 'string'.`
				);
	}

	/**
	 * Check for content at a location.
	 * @param {number} x The x-coordinate to check.
	 * @param {number} y The y-coordinate to check.
	 * @param {string} layer An optional layer to check. If no layer is provided, all layer's are checked.
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
	 * @param {string} layer An optional layer to check. If no layer is provided, all layer's are checked.
	 */
	solidAtPosition(x, y, layer) {
		const thingsAt = this.getAtPosition(x, y, layer);

		for (const thing of thingsAt) if (thing.pixel.solid) return thing;
		return false;
	}

	__onStartup() {
		const { layers } = this.config;

		if (!layers.includes("system")) new Layer(this, { label: "system" });
		for (const config of layers) new Layer(this, config);
	}

	__mergedRender() {
		const {
			runtime: { renderer },
		} = this;

		const frame = renderer.compileFrames(
			...this.layers.map((layer) => layer.frame)
		);

		if (JSON.stringify(frame) === this.lastFrame && renderer.hasDrawn)
			return;

		this.lastFrame = JSON.stringify(frame);

		renderer.clearDisplay();

		renderer.drawFrame(frame);
	}

	__stackedRender() {
		const {
			runtime: { renderer },
		} = this;

		const frames = this.layers.map((layer) => layer.frame);

		renderer.clearDisplay();

		for (const frame of frames) renderer.drawFrame(frame);
	}

	__onTick() {
		const {
			runtime,
			renderer: {
				config: { renderMode },
			},
		} = this;

		// Logic
		if (!runtime.paused) {
			for (const layer of this.layers) runtime.__runOnTick(layer);
		}

		// Render
		if (renderMode === "stacked") this.__stackedRender();
		else this.__mergedRender();
	}
}

export default LayerManager;
