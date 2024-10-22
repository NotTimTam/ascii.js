import Pixel, { PixelMesh } from "../core/Pixel.js";
import { isPlainObject } from "../util/data.js";
import AudioManager from "./AudioManager.js";
import Renderer from "./Renderer.js";
import Scene from "./Scene.js";

class Runtime {
	/**
	 * A default configuration object that a `Runtime` instance will fall back to when a custom config is not provided.
	 */
	static defaultConfig = {
		renderer: {
			resolution: [96, 32],
			canvas: document.querySelector("canvas"),
			fontSize: "24px",
			scaling: "letterbox",
			renderMode: "stacked",
			useWebWorkers: true,
			forceParentStyles: true,
		},
	};

	/**
	 * The overall game state and management system.
	 * @param {Object} config The game's config object.
	 * @param {Object} config.renderer Configuration for the `Renderer` class.
	 * @param {Array<Number>} config.renderer.resolution Determines the resolution (in characters) of the renderer. Format: `[integer width, integer height]`
	 * @param {Element|string} config.renderer.canvas A DOM `<canvas/>` element, or a CSS selector string that targets one. This element will be used for rendering.
	 * @param {Boolean} config.renderer.forceParentStyles A boolean indicating whether the parent of the `config.renderer.canvas` element should have styles applied for properly containing the canvas. Ideally, the canvas' parent element is a wrapper with no other elements in it. Default `true`.
	 * @param {string} config.renderer.fontSize A string CSS `font-size` value that will be used for text displayed in the renderer. Defaults to `"32px"`. An increased font size does not increase the size of characters on the screen, but their resolution quality instead. (smaller font sizes will result in blurrier characters)
	 * @param {"off"|"letterbox"} config.renderer.scaling The scaling mode for the canvas. Should be one of: `"off"`, `"letterbox"`.
	 * - "letterbox" &mdash; Scales the canvas element to fit the viewport without changing its aspect ratio.
	 * - "off" &mdash; Does not modify the scale of the canvas element.
	 * @param {boolean} config.renderer.useWebWorkers Whether or not to use web workers for rendering. Default `true`.
	 * @param {"stacked"|"merged"} config.renderer.renderMode Should be one of: `"stacked"`, `"merged"`.
	 * #### Stacked Mode
	 *
	 * -   **Description:** Draws each layer in order, stacked on top of each other.
	 * -   **Behavior:** Layers are drawn one on top of the other, allowing characters to overlap.
	 * -   **Performance:** More expensive due to multiple render calls, but offers higher quality graphics.
	 *
	 * #### Merged Mode
	 *
	 * -   **Description:** Compiles all layer frames into a single frame before rendering.
	 * -   **Behavior:** Characters cannot overlap as all layers are combined into one frame.
	 * -   **Performance:** Faster rendering compared to stacked mode due to the compilation of all frames. Additionally, identifies and skips rendering frames that are identical to the currently drawn frame, saving processing time when the screen is static. Due to the nature of this rendering mode, some graphical issues can occur, and it should only be used on lower-end devices.
	 */
	constructor(config = Runtime.defaultConfig) {
		this.config = config;

		this.validateConfig(config);

		this.audioManager = new AudioManager(this);
		this.renderer = new Renderer(this);

		this.running = false;
		this.initialized = false;

		this.paused = false;
	}

	get webGLSupported() {
		// Check if the browser supports WebGL
		try {
			const canvas = document.createElement("canvas");
			return !!(
				window.WebGLRenderingContext &&
				(canvas.getContext("webgl") ||
					canvas.getContext("experimental-webgl"))
			);
		} catch (e) {
			return false;
		}
	}

	/**
	 * Validates a renderer configuration file and throws an error if it is invalid.
	 * @param {Object} config The config object to validate.
	 */
	validateConfig(config) {
		if (!isPlainObject(config))
			throw new TypeError(
				"Expected a plain object for Runtime constructor config parameter."
			);

		if (!config.renderer)
			throw new Error("No 'renderer' config provided to config object.");
	}

	/**
	 * Get the time since the game was initialized, in milliseconds.
	 */
	get walltime() {
		return this.initialized ? performance.now() - this.running : 0;
	}

	get dt() {
		return this.__dtm / 1000;
	}

	/**
	 * Get the current frames-per-second value.
	 */
	get fps() {
		return this.initialized ? 1000 / this.__dtm : 0;
	}

	/**
	 * Run the onStartup method of any object.
	 * @param {Object} object The object whose method should be run.
	 * @param  {...any} passthrough The data to pass through to that method.
	 */
	__runOnStartup = (object, ...passthrough) =>
		object.onStartup && object.onStartup(...passthrough);

	/**
	 * Run the onTick method of any object.
	 * @param {Object} object The object whose method should be run.
	 * @param  {...any} passthrough The data to pass through to that method.
	 */
	__runOnTick = (object, ...passthrough) =>
		object.onTick && object.onTick(this, ...passthrough);

	/**
	 * Run the onLoad method of any object.
	 * @param {Object} object The object whose method should be run.
	 * @param  {...any} passthrough The data to pass through to that method.
	 */
	__runOnLoad = (object, ...passthrough) =>
		object.onLoad && object.onLoad(...passthrough);

	/**
	 * Code that runs when the project starts.
	 */
	__onStartup() {
		this.start = performance.now();
		this.__lastFrame = 0;
	}

	/**
	 * Code that runs on every frame.
	 */
	__onTick(currentTime) {
		if (!this.running) return; // End the game loop.

		// Run delta time calculation loop.
		this.__dtm = currentTime - this.__lastFrame;
		this.__lastFrame = currentTime;

		// Run scene logic.
		if (this.scene) this.scene.__onTick();

		// Trigger next loop.
		requestAnimationFrame((currentTime) => this.__onTick(currentTime));
	}

	/**
	 * Load a scene into the runtime. This will replace all `GameObject` and `Layer` instances.
	 * @param {Scene} scene The scene to load.
	 */
	loadScene(scene) {
		if (!this.running)
			throw new Error(
				`A scene loading attempt was made, but the Runtime's "start" method has not yet been called.`
			);

		if (!(scene instanceof Scene))
			throw new Error(`Provided scene is not a "Scene" object`);

		if (this.scene) this.scene.__unLoad();

		this.scene = scene;
	}

	/**
	 * Start the game loop.
	 * @param {?function} onInitialized An optional method to run when the runtime has been initialized.
	 */
	start(onInitialized) {
		this.running = true;

		// Trigger the onStartup code if this is the first time the render loop has been started.
		if (!this.initialized) {
			this.__onStartup();

			// Run initialization code.
			this.initialized = true;
			onInitialized &&
				typeof onInitialized === "function" &&
				onInitialized(this);
		}

		requestAnimationFrame((currentTime) => this.__onTick(currentTime));
	}
}

export default Runtime;
