import { clamp } from "../util/math.js";

export class Sound {
	/**
	 * Manages loading and playback of an audio file.
	 * @param {AudioManager} audioManager The audio manager that will parent this Sound.
	 * @param {string} src The source of the audio.
	 * @param {string} label The unique label to identify this sound.
	 * @param {function} onReady An optional method to call when the audio file is ready to play. Passed the sound object.
	 */
	constructor(audioManager, src, label, onReady) {
		if (typeof label !== "string")
			throw new Error(
				`Invalid label "${label}" provided. Must be of type "string".`
			);

		if (typeof src !== "string")
			throw new Error(
				`Invalid source "${src}" provided. Must be of type "string".`
			);

		if (audioManager.sounds.hasOwnProperty(label))
			throw new Error(`Audio label "${label}" is already in use.`);

		if (onReady && typeof onReady !== "function")
			throw new Error(
				`"onReady" value provided to "Sound" is not of type "function".`
			);

		audioManager.sounds[label] = this;

		this.label = label;
		this.audioManager = audioManager;
		this.onReady = onReady;

		this.src = src;

		this.ready = false;

		this.element = new Audio(src);

		this.element.addEventListener("canplaythrough", () => {
			/* the audio is now playable; play it if permissions allow */
			this.ready = true;
		});
	}

	/**
	 * Get the audio's playback rate.
	 */
	get playbackRate() {
		return this.element.playbackRate;
	}

	/**
	 * Set the audio's playback rate.
	 */
	set playbackRate(value) {
		this.element.playbackRate = value;
	}

	/**
	 * Get the volume of playback.
	 */
	get volume() {
		return this.element.volume;
	}

	/**
	 * Set the volume of playback.
	 */
	set volume(value) {
		if (typeof value !== "number")
			throw new Error(
				`Invalid volume value provided to "Sound" instance: ${value}. Must be of type "number".`
			);

		this.element.volume = clamp(value, 0, 1);
	}

	/**
	 * Get whether the audio is playing.
	 */
	get playing() {
		return !this.element.paused;
	}

	/**
	 * Get the mute state of the audio.
	 */
	get muted() {
		return this.volume === 0 || this.element.muted;
	}

	/**
	 * Get the loop value of the audio element.
	 */
	get loop() {
		return this.element.loop;
	}

	/**
	 * Set the loop value of the audio element.
	 */
	set loop(value) {
		this.element.loop = Boolean(value);
	}

	/**
	 * Mute the audio without stopping playback.
	 */
	mute() {
		this.volume = 0;
		this.element.muted = true;
	}

	/**
	 * Begin audio playback.
	 * @param {Object} config Playback configuration data.
	 * @param {boolean} config.allowConcurrentPlayback Whether to allow the sound to be played, even if it is already playing.
	 * @param {number} config.volume Optionally overwrite the current volume level before playing.
	 * @param {boolean} config.loop Whether to loop audio playback.
	 */
	play(config = { allowConcurrentPlayback: false }) {
		if (!config)
			throw new Error(
				`No playback config provided to "Sound" play method.`
			);

		if (!this.ready)
			return console.warn(
				`A request for playback of "${this.label}" was made, but it could not be fulfilled as the file is not loaded.`
			);

		if (config.volume) this.volume = config.volume;
		if (config.loop) this.loop = config.loop;

		if (!this.playing) this.element.play();
		else if (config.allowConcurrentPlayback)
			this.element.cloneNode().play();
	}

	/**
	 * Stop audio playback.
	 */
	stop() {
		if (!this.element.paused) this.element.pause();
	}
}

class AudioManager {
	/**
	 * Controls audio playback.
	 * @param {Runtime} runtime The game's runtime object.
	 */
	constructor(runtime) {
		this.runtime = runtime;

		this.sounds = {};
	}

	/**
	 * Get all currently playing tracks.
	 */
	get playing() {
		return Object.values(this.sounds).filter(({ playing }) => playing);
	}

	/**
	 * Load an audio file to be played at a later time.
	 * @param {string} src The URL of the audio file to preload.
	 * @param {string} label An identifer to use to play this audio later.
	 * @param {function} onReady An optional method to call when the audio file is ready to play. Passed the sound object.
	 */
	preload(src, label, onReady) {
		new Sound(this, src, label, onReady);
	}

	/**
	 * Unload a preloaded audio file.
	 * @param {string} label The identifier of the audio to unload.
	 * @param {boolean} stop Whether to stop the audio immediately. If `false`, the audio will be unloaded after playback has completed. (if it is currently playing)
	 */
	unload(label, stop = false) {
		if (!this.sounds.hasOwnProperty(label)) return;

		if (stop) this.sounds[label].stop();

		delete this.sounds[label];
	}

	/**
	 * Play a preloaded audio file.
	 * @param {string} label The identifier of the audio to play.
	 * @param {Object} config Playback configuration.
	 */
	play(label, config) {
		if (!this.sounds.hasOwnProperty(label))
			throw new Error(
				`Could not play audio. No preloaded file with label: "${label}".`
			);

		this.sounds[label].play(config);
	}

	/**
	 * Play a sound that has not been preloaded. (not recommended)
	 * @param {string} src The URL of the audio file to play.
	 */
	playNotPreloaded(src) {
		const audio = new Audio(src);

		audio.addEventListener("canplaythrough", (event) => {
			/* the audio is now playable; play it if permissions allow */
			audio.play();
		});
	}
}

export default AudioManager;
