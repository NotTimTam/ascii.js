import Renderer, { Frame, Pixel, PixelMesh } from "./renderer.js";
import Core from "../core/Core.js";
import { aabb } from "../util/math.js";

export class Layer extends Core {
	/**
	 * A layer is a construct of other objects. The layer manages these objects and can optionally render them to the screen.
	 * @param {LayerManager} layerManager The `LayerManager` parent object.
	 * @param {string} label This layer's label.
	 */
	constructor(layerManager, label) {
		super(layerManager.runtime);

		this.layerManager = layerManager;
		this.label = label;

		this.layerManager.layers.push(this);

		this.gameObjects = [];
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
		} = this;

		const frameData = [];

		for (const { renderable, x, y } of this.gameObjects) {
			if (!renderable) continue;
			else if (renderable instanceof Pixel) {
				if (!camera.isOnScreen(x, y, 1, 1)) continue;

				const [xOS, yOS] = [x - camera.x, y - camera.y];
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
							!camera.isOnScreen(x + pixelX, y + pixelY, 1, 1)
						)
							continue;

						const [xOS, yOS] = [
							x + pixelX - camera.x,
							y + pixelY - camera.y,
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
		const { runtime, gameObjects } = this;

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

		for (const layerName of config.layers)
			if (typeof layerName !== "string")
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

		if (!layers.includes("system")) new Layer(this, "system");
		for (const layer of layers) new Layer(this, layer);
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
		for (const layer of this.layers) runtime.__runOnTick(layer);

		// Render
		if (renderMode === "stacked") this.__stackedRender();
		else this.__mergedRender();
	}
}

export default LayerManager;
