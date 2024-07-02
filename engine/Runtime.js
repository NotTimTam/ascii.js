import InputManager from "./InputManager.js";
import Noise from "./Noise.js";
import Renderer from "./Renderer.js";
import Scene from "./Scene.js";

class Runtime {
	/**
	 * The overall game state and management system.
	 * @param {*} config The game's config object.
	 */
	constructor(config) {
		this.config = config;

		this.validateConfig(config);

		this.noise = new Noise(config.seed || Date.now());

		this.renderer = new Renderer(this);
		this.inputManager = new InputManager(this);

		this.running = false;
		this.initialized = false;

		this.paused = false;
	}

	/**
	 * Validates a renderer configuration file and throws an error if it is invalid.
	 * @param {*} config The config object to validate.
	 */
	validateConfig(config) {
		if (
			config.seed &&
			typeof config.seed !== "number" &&
			typeof config.seed !== "string"
		)
			throw new Error(
				`Invalid random noise "seed" value provided to Runtime: "${config.seed}". String or number value required.`
			);

		if (!config.renderer)
			throw new Error("No 'renderer' config provided to config object.");
		Renderer.validateConfig(config.renderer);
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
	 * Run the __onStartup method of any object.
	 * @param {*} object The object whose method should be run.
	 * @param  {...any} passthrough The data to pass through to that method.
	 */
	__runOnStartup = (object, ...passthrough) =>
		object.__onStartup && object.__onStartup(...passthrough);

	/**
	 * Run the __onTick method of any object.
	 * @param {*} object The object whose method should be run.
	 * @param  {...any} passthrough The data to pass through to that method.
	 */
	__runOnTick = (object, ...passthrough) =>
		object.__onTick && object.__onTick(this, ...passthrough);

	/**
	 * Code that runs when the project starts.
	 */
	__onStartup() {
		this.start = performance.now();
		this.__lastFrame = 0;

		// Run renderer startup.
		this.__runOnStartup(this.renderer);
		this.__runOnStartup(this.inputManager);
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
		this.__runOnTick(this.scene);

		// Run renderer.
		this.__runOnTick(this.renderer);

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

		const { label, layers, __onLoad } = scene;

		this.scene = scene;

		this.renderer.layerManager.loadLayers(layers);

		__onLoad && __onLoad(this);
	}

	/**
	 * Start the game loop.
	 * @param {function} onInitialized An optional method to run when the runtime has been initialized.
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
