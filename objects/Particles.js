import { Pixel, PixelMesh } from "../engine/Renderer.js";
import GameObject from "../core/GameObject.js";
import { displayArray } from "../util/data.js";

class Particle {
	constructor() {}
}

class Particles extends GameObject {
	/**
	 * A `Particles` object is generally a non-static `GameObject`, that creates particles and renders them to the screen.
	 * @param {Runtime} runtime The main runtime object.
	 * @param {*} config The configuration for this `Animate`.
	 * @param {number} config.x This `Particles`'s x-coordinate.
	 * @param {number} config.y This `Particles`'s y-coordinate.
	 * @param {Pixel|PixelMesh} config.renderable The renderable from which individual particles will be generated.
	 * @param {number} config.rate The rate at which particles are generated. (in particles-per-second)
	 * @param {number} config.sprayCone The radius of the spray angle in degrees.
	 * @param {string} config.type The type of particle spray. `["continuous", "oneShot"]`
	 * @param {number} config.speed The desired speed of each particle.
	 * @param {number} config.xRandomizer The amount of pixels by which to adjust the x-coordinate of each particle randomly.
	 * @param {number} config.yRandomizer The amount of pixels by which to adjust the y-coordinate of each particle randomly.
	 * @param {number} config.speedRandomizer The rate at which particles are generated. (in particles-per-second)
	 * @param {number} config.acceleration The acceleration applied to a particle in pixels-per-second.
	 * @param {number} config.gravity The amount of gravity (in pixels-per-second) applied to a particle every second.
	 * @param {number} config.angleRandomizer The amount (in degrees) by which a particle's angle is randomized.
	 * @param {number} config.speedRandomizerLifeTime The amount (in pixels-per-second) by which particle speed is randomized every second.
	 * @param {string} config.destroyMode The condition under which a particle is destroyed. `["timeoutExpired", "particleStopped"]`
	 * @param {number} config.timeout The time in seconds before a particle is destroyed.
	 */
	constructor(
		runtime,
		config = {
			renderable: Pixel.fromString("P"),
			rate: 50,
			sprayCone: 60,
			type: "continuous",
			speed: 200,
			xRandomizer: 0,
			yRandomizer: 0,
			speedRandomizer: 0,
			acceleration: -150,
			gravity: 0,
			angleRandomizer: 0,
			speedRandomizerLifeTime: 800,
			destroyMode: "timeoutExpired",
			timeout: 1,
			maxParticles: 100,
		}
	) {
		Particles.validateConfig(config);

		const {
			x,
			y,
			renderable = Pixel.fromString("P"),
			rate = 50,
			sprayCone = 60,
			type = "continuous",
			speed = 200,
			xRandomizer = 0,
			yRandomizer = 0,
			speedRandomizer = 0,
			acceleration = -150,
			gravity = 0,
			angleRandomizer = 0,
			speedRandomizerLifeTime = 800,
			destroyMode = "timeoutExpired",
			timeout = 1,
			maxParticles = 100,
		} = config;
		super(runtime, x, y);

		this.particle = renderable;
		this.rate = rate;
		this.sprayCone = sprayCone;
		this.type = type;
		this.speed = speed;
		this.xRandomizer = xRandomizer;
		this.yRandomizer = yRandomizer;
		this.speedRandomizer = speedRandomizer;
		this.acceleration = acceleration;
		this.gravity = gravity;
		this.angleRandomizer = angleRandomizer;
		this.speedRandomizerLifeTime = speedRandomizerLifeTime;
		this.destroyMode = destroyMode;
		this.timeout = timeout;
		this.maxParticles = maxParticles;

		this.particles = [];
	}

	/**
	 * Validates a renderer configuration file and throws an error if it is invalid.
	 * @param {*} config The config object to validate.
	 */
	static validateConfig(config) {
		if (!config)
			throw new Error(
				`No "config" object provided to "Particles" constructor.`
			);

		if (
			!(config.renderable instanceof Pixel) &&
			!(config.renderable instanceof PixelMesh)
		)
			throw new Error(
				`Renderable provided to "Particles" object not an instance of "Pixel" or "PixelMesh".`
			);

		if (typeof config.rate !== "number" || config.rate <= 0)
			throw new Error(
				`Invalid "rate" value provided to "Particles" object: ${config.rate}. Must be of type "number" and greater than or equal to 0.`
			);

		if (
			typeof config.sprayCone !== "number" ||
			config.sprayCone < 0 ||
			config.sprayCone > 360
		)
			throw new Error(
				`Invalid "sprayCone" value provided to "Particles" object: ${config.sprayCone}. Must be of type "number", >=0, <=360.`
			);

		const typeEnum = ["continuous", "oneShot"];
		if (!config.type || !typeEnum.includes(config.type))
			throw new Error(
				`Invalid "type" value provided to "Particles" object: ${
					config.type
				}. Must be one of: ${displayArray(typeEnum)}`
			);

		if (typeof config.speed !== "number")
			throw new Error(
				`Invalid "speed" value provided to "Particles" object: ${config.speed}. Must be of type "number".`
			);

		if (typeof config.xRandomizer !== "number")
			throw new Error(
				`Invalid "xRandomizer" value provided to "Particles" object: ${config.xRandomizer}. Must be of type "number".`
			);

		if (typeof config.yRandomizer !== "number")
			throw new Error(
				`Invalid "yRandomizer" value provided to "Particles" object: ${config.yRandomizer}. Must be of type "number".`
			);

		if (typeof config.speedRandomizer !== "number")
			throw new Error(
				`Invalid "speedRandomizer" value provided to "Particles" object: ${config.speedRandomizer}. Must be of type "number".`
			);

		if (typeof config.acceleration !== "number")
			throw new Error(
				`Invalid "acceleration" value provided to "Particles" object: ${config.acceleration}. Must be of type "number".`
			);

		if (typeof config.gravity !== "number")
			throw new Error(
				`Invalid "gravity" value provided to "Particles" object: ${config.gravity}. Must be of type "number".`
			);

		if (typeof config.angleRandomizer !== "number")
			throw new Error(
				`Invalid "angleRandomizer" value provided to "Particles" object: ${config.angleRandomizer}. Must be of type "number".`
			);

		if (typeof config.speedRandomizerLifeTime !== "number")
			throw new Error(
				`Invalid "speedRandomizerLifeTime" value provided to "Particles" object: ${config.speedRandomizerLifeTime}. Must be of type "number".`
			);

		const destroyModeEnum = ["timeoutExpired", "particleStopped"];
		if (
			!config.destroyMode ||
			!destroyModeEnum.includes(config.destroyMode)
		)
			throw new Error(
				`Invalid "destroyMode" value provided to "Particles" object: ${
					config.destroyMode
				}. Must be one of: ${displayArray(destroyModeEnum)}`
			);

		if (typeof config.timeout !== "number")
			throw new Error(
				`Invalid "timeout" value provided to "Particles" object: ${config.timeout}. Must be of type "number".`
			);

		if (typeof config.maxParticles !== "number" || config.maxParticles < 1)
			throw new Error(
				`Invalid "maxParticles" value provided to "Particles" object: ${config.maxParticles}. Must be of type "number" and greater than or equal to 1.`
			);
	}

	get renderable() {
		return new PixelMesh([[this.particle, this.particle, this.particle]]);
	}

	__onTick() {
		const {
			particle,
			rate,
			sprayCone,
			type,
			speed,
			xRandomizer,
			yRandomizer,
			speedRandomizer,
			acceleration,
			gravity,
			angleRandomizer,
			speedRandomizerLifeTime,
			destroyMode,
			timeout,
		} = this;
	}
}

export default Particles;
