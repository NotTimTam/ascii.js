import Noise from "./Noise.js";
import Renderer from "./renderer.js";

class Runtime {
	/**
	 * The overall game state and management system.
	 * @param {*} config The game's config object.
	 */
	constructor(config) {
		this.config = config;

		this.validateConfig(config);

		this.noise = new Noise(Date.now());
		this.renderer = new Renderer(this);

		this.running = false;
		this.initialized = false;
	}

	/**
	 * Validates a renderer configuration file and throws an error if it is invalid.
	 * @param {*} config The config object to validate.
	 */
	validateConfig(config) {
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

	/**
	 * Get the current frames-per-second value.
	 */
	get fps() {
		return this.initialized ? 1000 / this.dt : 0;
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
		object.__onTick && object.__onTick(...passthrough);

	/**
	 * Code that runs when the project starts.
	 */
	__onStartup() {
		this.start = performance.now();
		this.__lastFrame = 0;

		// Run renderer startup.
		this.__runOnStartup(this.renderer);
	}

	/**
	 * Code that runs on every frame.
	 */
	__onTick(currentTime) {
		if (!this.running) return; // End the game loop.

		// Run delta time calculation loop.
		this.dt = currentTime - this.__lastFrame;
		this.__lastFrame = currentTime;

		// Input

		// Logic

		// Render
		this.__runOnTick(this.renderer);

		// Trigger next loop.
		requestAnimationFrame((currentTime) => this.__onTick(currentTime));
	}

	/**
	 * Start the game loop.
	 */
	start() {
		this.running = true;

		// Trigger the onStartup code if this is the first time the render loop has been started.
		if (!this.initialized) {
			this.initialized = true;

			this.__onStartup();
		}

		requestAnimationFrame((currentTime) => this.__onTick(currentTime));
	}

	/**
	 * End the game loop. (triggers on the next frame)
	 */
	stop() {
		this.running = false;
	}
}

export default Runtime;
