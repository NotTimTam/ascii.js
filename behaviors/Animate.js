import Behavior from "../core/Behavior.js";
import Pixel, { PixelMesh } from "../core/Pixel.js";

export class AnimationFrame {
	/**
	 * An animation frame. The `renderable` value of this Frame should return a `Pixel` or `PixelMesh` that will determine what is displayed on this frame.
	 * @param {Pixel|PixelMesh} renderable The renderable item to display for this frame.
	 * @param {number} duration The duration (in frames) of this frame. Example: a value of `2` will make this frame last twice as long as the rest.
	 */
	constructor(renderable = Pixel.fromString("#"), duration) {
		if (
			!renderable ||
			(!(renderable instanceof Pixel) &&
				!(renderable instanceof PixelMesh))
		)
			throw new Error(
				`Invalid renderable provided to "AnimationFrame": ${renderable}. Must be of type "Pixel" or "PixelMesh".`
			);

		if (duration && typeof duration !== "number")
			throw new Error(
				`Invalid duration provided to Frame: ${duration}. Must be of type "number".`
			);

		this.duration = duration;
		this.renderable = renderable;
	}
}

export class Animation {
	/**
	 * An animation. The `Animate` behavior operates on the data in this object.
	 * @param {Object} config The configuration for this `Animation`.
	 * @param {string} config.label This `Animation`'s label.
	 * @param {Array<AnimationFrame>} config.animationFrames An array of this `Animation`'s frames.
	 * @param {number} config.speed The speed at which this `Animation` should play. In frames per second.
	 * @param {boolean} config.loop Whether or not this animation should loop infinitely or end after `config.repeatCount` iterations.
	 * @param {number} config.repeatCount The number of times the `Animation` should repeat if `config.loop` is set to `false`.
	 * @param {boolean} config.pingPong When `true`, the animation will switch directions once it reaches its end and loop back and forth from start to end.
	 */
	constructor(
		config = {
			label: "Unnamed Animation",
			animationFrames,
			speed: 12,
			loop: false,
			repeatCount: 1,
			pingPong: false,
		}
	) {
		Animation.validateConfig(config);

		const {
			label = "Unnamed Animation",
			animationFrames,
			speed = 12,
			loop = false,
			repeatCount = 1,
			pingPong = false,
		} = config;

		this.label = label;
		this.animationFrames = animationFrames;
		this.speed = speed;
		this.loop = loop;
		this.repeatCount = repeatCount;
		this.pingPong = pingPong;
	}

	/**
	 * Validates a TopDownMovement configuration object and throws an error if it is invalid.
	 * @param {Object} config The config object to validate.
	 */
	static validateConfig(config) {
		if (!config)
			throw new Error(`No configuration provided to "Animation" object.`);

		if (!config.label || typeof config.label !== "string")
			throw new Error(
				`Invalid label provided to Animation: ${config.label}. Must be of type "string".`
			);

		if (!config.animationFrames)
			throw new Error(
				`Invalid label provided to Animation: ${config.label}. Must be of type "string".`
			);

		if (typeof config.speed !== "number" || config.speed < 0)
			throw new Error(
				`Invalid speed provided to Frame: ${config.speed}. Must be of type "number" and greater than 0.`
			);

		if (config.repeatCount && typeof config.repeatCount !== "number")
			throw new Error(
				`Invalid repeatCount provided to Frame: ${config.repeatCount}. Must be of type "number".`
			);
	}
}

class Animate extends Behavior {
	/**
	 * Animate a `GameObject`.
	 * @param {GameObject} gameObject The game object to append this behavior to.
	 * @param {Object} config The configuration for this `Animate`.
	 * @param {Array<Animation>} config.animations The animations for this behavior.
	 * @param {boolean} config.enabledByDefault Whether the Behavior starts out enabled. Default: `true`.
	 * @param {string} config.initialAnimation The label of the animation to start on.
	 * @param {number} config.initialFrame The frame of the animation to start on.
	 * @param {boolean} config.overwriteObjectRenderable Whether or not to force the GameObject's `renderable` property to return this `Animate` instance's `renderable` property. Default `false`.
	 */
	constructor(gameObject, config) {
		super(
			gameObject,
			config.hasOwnProperty("enabledByDefault")
				? config.enabledByDefault
				: true
		);

		Animate.validateConfig(config);

		const {
			animations,
			initialFrame = 0,
			initialAnimation,
			overwriteObjectRenderable = false,
		} = config;

		this.animations = animations;

		this.currentAnimationLabel = undefined;
		this.__rawCurrentAnimationFrameIndex = initialFrame;
		this.playing = false;
		this.repeats = 0;
		this.speed = 0;

		if (overwriteObjectRenderable) this.__overwriteObjectRenderable();

		if (initialAnimation) this.currentAnimation = initialAnimation;

		if (this.currentAnimation) this.playing = true;
	}

	/**
	 * Overwrite a `GameObject`'s `renderable` property with this `Animate` instance's `renderable` property.
	 */
	__overwriteObjectRenderable() {
		const animate = this;

		Object.defineProperty(this.gameObject, "renderable", {
			get() {
				return animate.renderable;
			},

			// Remove the ability to change the renderable.
			set(_) {
				return undefined;
			},

			configurable: true,
			enumerable: true,
		});
	}

	/**
	 * After overwriting a `GameObject`'s `renderable` property, this method will return to back to its original functionality.
	 */
	resetObjectRenderable() {
		this.gameObject.__resetRenderable();
	}

	get renderable() {
		return (
			this.currentAnimationFrame && this.currentAnimationFrame.renderable
		);
	}

	/**
	 * Get the current animation frame index.
	 */
	get currentAnimationFrameIndex() {
		return Math.floor(this.__rawCurrentAnimationFrameIndex);
	}

	/**
	 * Set the current animation frame index.
	 */
	set currentAnimationFrameIndex(value) {
		this.__rawCurrentAnimationFrameIndex = value;
	}

	/**
	 * Get the current animation frame.
	 */
	get currentAnimationFrame() {
		return (
			this.currentAnimation &&
			this.currentAnimation.animationFrames[
				this.currentAnimationFrameIndex
			]
		);
	}

	/**
	 * The number of frames in the current animation.
	 */
	get animationFrameCount() {
		return this.currentAnimation
			? this.currentAnimation.animationFrames.length
			: 0;
	}

	/**
	 * Get the current Animation.
	 */
	get currentAnimation() {
		return this.animations.find(
			(animation) => animation.label === this.currentAnimationLabel
		);
	}

	/**
	 * Set the current animation.
	 */
	set currentAnimation(label) {
		const animation = this.animations.find(
			(animation) => animation.label === label
		);

		if (!animation)
			throw new Error(`No animation found with label: ${label}.`);

		this.currentAnimationLabel = label;

		this.currentAnimationFrameIndex = 0;
		this.speed = animation.speed;
		this.playing = true;
	}

	/**
	 * Validates a TopDownMovement configuration object and throws an error if it is invalid.
	 * @param {Object} config The config object to validate.
	 */
	static validateConfig(config) {
		if (!config)
			throw new Error(`No configuration provided to "Animate" behavior.`);

		if (!config.animations || !(config.animations instanceof Array))
			throw new Error("No animations configured for Animate behavior.");
		for (const animation of config.animations)
			if (!(animation instanceof Animation))
				throw new Error(
					`Item in "animations" array is not an instance of "Animation".`
				);

		if (
			config.initialAnimation &&
			typeof config.initialAnimation !== "string"
		)
			throw new Error(
				`Invalid initialAnimation provided to "Animate" behavior: ${config.initialAnimation}. Must be of type "string".`
			);

		if (
			config.initialFrame &&
			(typeof config.initialFrame !== "number" ||
				config.initialAnimation < 0)
		)
			throw new Error(
				`Invalid initialFrame provided to "Animate" behavior: ${config.initialAnimation}. Must be of type "number" and greater than 0.`
			);
	}

	onTick() {
		if (this.gameObject.paused || !this.playing) return;

		const {
			currentAnimation,
			animationFrameCount,
			runtime: { dt },
		} = this;

		const currentFrame = this.currentAnimationFrame;
		const effectiveDuration =
			currentFrame.duration && typeof currentFrame.duration === "number"
				? currentFrame.duration
				: 1;

		this.__rawCurrentAnimationFrameIndex +=
			(currentAnimation.speed * dt) / effectiveDuration;

		// this.__rawCurrentAnimationFrameIndex += currentAnimation.speed * dt;

		// When the animation reaches the last frame.
		if (this.__rawCurrentAnimationFrameIndex >= animationFrameCount) {
			if (currentAnimation.pingPong) {
				// Pingpong
				currentAnimation.speed *= -1;
				this.__rawCurrentAnimationFrameIndex = animationFrameCount - 1; // Set to the second last frame
			} else {
				this.repeats++; // Trigger a repeat.

				if (
					currentAnimation.loop ||
					this.repeats < currentAnimation.repeatCount
				) {
					this.__rawCurrentAnimationFrameIndex = 0;
				} else {
					this.playing = false;
					this.__rawCurrentAnimationFrameIndex =
						animationFrameCount - 1;
				}
			}
		} else if (this.__rawCurrentAnimationFrameIndex < 0) {
			if (currentAnimation.pingPong) this.repeats++;

			if (
				currentAnimation.loop ||
				this.repeats < currentAnimation.repeatCount
			) {
				// If it is looping or has not reached repeatCount.

				currentAnimation.speed *= -1;
				this.__rawCurrentAnimationFrameIndex = 1; // Set to the second frame
			} else {
				this.playing = false; // if it is not looping or pingponging.
				this.__rawCurrentAnimationFrameIndex = 0;
			}
		}
	}
}

export default Animate;
