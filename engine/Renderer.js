import { displayArray } from "../util/data.js";

import Pixel from "../core/Pixel.js";
import Frame from "./Frame.js";
import Runtime from "./Runtime.js";
import DrawFrameWorker from "../workers/DrawFrameWorker.js";

// import DrawFrameWorker from "../workers/DrawFrameWorker.js?worker";

class Renderer {
	/**
	 * Handles rendering the game using **2D Context**.
	 * @param {Runtime} runtime The current `Runtime` instance.
	 */
	constructor(runtime) {
		this.runtime = runtime;

		this.config = this.runtime.config && this.runtime.config.renderer;

		Renderer.validateConfig(this.config);

		if (!this.config)
			throw new Error("No config object provided to renderer.");

		this.__onCreated();

		this.useWebWorkers = this.config.hasOwnProperty("useWebWorkers")
			? Boolean(this.config.useWebWorkers)
			: true;

		if (!window.Worker && this.useWebWorkers)
			throw new Error("This environment does not support webworkers.");

		this.__createWorkerInterface();
	}

	/**
	 * Get the display's character width.
	 */
	get width() {
		return this.config.resolution[0];
	}

	/**
	 * Get the display's character height.
	 */
	get height() {
		return this.config.resolution[1];
	}

	/**
	 * Validates a renderer configuration file and throws an error if it is invalid.
	 * @param {Object} config The config object to validate.
	 */
	static validateConfig(config) {
		if (!config.resolution)
			throw new Error(
				"No resolution array defined in renderer config. [width, height]"
			);

		if (
			config.resolution.length !== 2 ||
			typeof config.resolution[0] !== "number" ||
			typeof config.resolution[1] !== "number"
		)
			throw new Error(
				"Resolution array must be in format: [width (number), height (number)]"
			);

		if (config.resolution[0] < 5 || config.resolution[1] < 5)
			throw new Error("Resolution cannot be smaller than 5x5.");

		if (config.fontSize && typeof config.fontSize !== "string")
			throw new Error(
				"Invalid fontSize parameter provided to renderer config. Must be of type 'string'"
			);

		if (config.scaling) {
			const scalingEnum = ["off", "letterbox"];

			if (!scalingEnum.includes(config.scaling))
				throw new Error(
					`Invalid scaling value provided, must be one of: ${displayArray(
						scalingEnum
					)}`
				);
		}

		if (config.renderMode) {
			const renderModes = ["stacked", "merged"];
			if (!renderModes.includes(config.renderMode))
				throw new Error(
					`Provided render mode is invalid. Must be of type: ${displayArray(
						renderModes
					)}`
				);
		}

		if (!config.canvas)
			throw new Error(
				`No "canvas" value provided to Renderer configuration.`
			);

		if (typeof config.canvas === "string") {
			const canvas = document.querySelector(config.canvas);

			if (!canvas)
				throw new Error(
					`No canvas element found in DOM with query selector "${config.canvas}"`
				);
		} else if (config.canvas instanceof Element) {
			if (config.canvas.tagName.toLowerCase() !== "canvas")
				throw new Error(
					`Renderer config provided HTML element for "canvas" field, but the element is not a canvas.`
				);
		} else
			throw new Error(
				`Invalid "canvas" configuration provided to Renderer config. Must be a canvas element or query selector string that points to a canvas.`
			);
	}

	/**
	 * Initialize the display.
	 */
	__intializeDisplay() {
		this.drawing = false;
		this.hasDrawn = false;

		const { fontSize, canvas } = this.config;

		// Load in the renderer's canvas.
		if (typeof canvas === "string")
			this.element = document.querySelector(canvas);
		else if (
			canvas instanceof Element &&
			canvas.tagName.toLowerCase() === "canvas"
		)
			this.element = canvas;

		document.body.style = `
			width: 100vw;
			height: 100vh;
			overflow: hidden;
			background-color: black;
			padding: 0;
			margin: 0;
			box-sizing: border-box;
		`;

		this.element.style = `
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translateX(-50%) translateY(-50%);

			box-sizing: border-box;
			padding: 0;
			margin: 0;

			width: 100%;
			height: 100%;
		`;

		this.ctx = this.element.getContext("2d");

		const { ctx } = this;

		ctx.canvas.width = window.innerWidth;
		ctx.canvas.height = window.innerHeight;
		ctx.canvas.style.width = `${window.innerWidth}px`;
		ctx.canvas.style.height = `${window.innerHeight}px`;

		ctx.font = `${fontSize} monospace`;
		const {
			width: characterWidth,
			fontBoundingBoxAscent,
			fontBoundingBoxDescent,
		} = this.ctx.measureText("█");

		const characterHeight = fontBoundingBoxAscent + fontBoundingBoxDescent;

		this.characterSize = [characterWidth, characterHeight];

		const [cW, cH] = [
			characterWidth * this.width,
			characterHeight * this.height,
		];

		ctx.canvas.width = cW;
		ctx.canvas.height = cH;
		ctx.canvas.style.width = `${cW}px`;
		ctx.canvas.style.height = `${cH}px`;
	}

	/**
	 * Rescale the display to fit the screen.
	 */
	__rescaleDisplay() {
		const {
			element,
			config: { scaling },
		} = this;

		if (!scaling || scaling === "off") {
			element.style.transform = `translateX(-50%) translateY(-50%)`;
			return;
		}

		const { innerWidth: viewportWidth, innerHeight: viewportHeight } =
			window;

		element.style.transform = `translateX(-50%) translateY(-50%) scale(1)`;

		const { width: currentWidth, height: currentHeight } =
			element.getBoundingClientRect();

		const [scaleX, scaleY] = [
			viewportWidth / currentWidth,
			viewportHeight / currentHeight,
		];

		const scale = Math.min(scaleX, scaleY);

		element.style.transform = `translateX(-50%) translateY(-50%) scale(${scale})`;
	}

	/**
	 * Clear the screen;
	 */
	clearDisplay() {
		const {
			ctx,
			ctx: {
				canvas: { width, height },
			},
		} = this;

		ctx.beginPath();

		ctx.clearRect(0, 0, width, height);

		ctx.closePath();
	}

	/**
	 * Create interfaces for each web worker.
	 */
	__createWorkerInterface() {
		this.webWorkers = {
			drawFrame: new Worker(
				URL.createObjectURL(
					new Blob([DrawFrameWorker], {
						type: "application/javascript",
					})
				),
				{
					type: "module",
				}
			),
		};

		this.webWorkers.drawFrame.onmessage = ({
			data: { bitmap, lastFrame },
		}) => {
			this.buffer.push(bitmap);

			if (lastFrame) this.__drawBuffer();
		};
	}

	/**
	 * Draw an array of `ImageData` to the display. This data would be generated by the web worker.
	 */
	__drawBuffer() {
		this.clearDisplay();

		for (const bitmap of this.buffer) {
			this.ctx.drawImage(bitmap, 0, 0);
		}

		this.drawing = false;
	}

	/**
	 * Draw several frames to the screen.
	 * @param {Array<Frame>} frames The frames to draw.
	 */
	drawFrames(frames) {
		if (this.drawing) return;

		if (!this.hasDrawn) this.hasDrawn = true;
		this.drawing = true;

		if (this.useWebWorkers) this.buffer = [];
		else this.clearDisplay();

		for (const frame of frames) {
			if (!(frame instanceof Frame))
				throw new Error(
					"Provided frame object is not an instance of the Frame constructor."
				);

			if (this.useWebWorkers) {
				const {
					characterSize,
					width,
					height,
					config: { fontSize },
				} = this;

				this.webWorkers.drawFrame.postMessage({
					data: frame.data,
					characterSize,
					width,
					height,
					fontSize,
					lastFrame: frames.indexOf(frame) === frames.length - 1,
				});
			} else {
				const {
					config: { fontSize = "32px" },

					characterSize: [cW, cH],

					ctx,

					width,
				} = this;

				ctx.textAlign = "left";
				ctx.textBaseline = "top";

				for (let x = 0; x < this.width; x++)
					for (let y = 0; y < this.height; y++) {
						const index = y * this.width + x;

						const data = frame.data[index];

						if (!data || !(data instanceof Pixel)) continue;

						const { value, color, fontWeight, backgroundColor } =
							data;

						if (backgroundColor) {
							ctx.beginPath();

							ctx.fillStyle = backgroundColor;

							ctx.fillRect(
								x * cW,
								y * cH,
								cW + Math.max(1 / width, 1),
								cH
							);

							ctx.closePath();
						}

						ctx.beginPath();

						ctx.font = `${
							fontWeight || "normal"
						} ${fontSize} monospace`;

						ctx.fillStyle = color || "#FFFFFF";

						ctx.fillText(value, x * cW, y * cH);

						ctx.closePath();
					}
			}
		}

		if (!this.useWebWorkers) this.drawing = false;
	}

	/**
	 * Determine the frame index of a pixel coordinate.
	 * @param {number} x The x-value of the coordinate.
	 * @param {number} y The y-value of the coordinate.
	 * @returns {number} The index of that coordinate in a frame.
	 */
	coordinatesToIndex = (x, y) => y * this.width + x;

	/**
	 * Convert a frame index into x and y coordinates.
	 * @param {number} index The frame index.
	 * @returns {Array<Number>} A coordinate array.
	 */
	indexToCoordinates = (index) => [
		index % this.width,
		Math.floor(index / this.width),
	];

	/**
	 * Compile several frames. Last frame provided on top.
	 * @param  {...Frame} frames The frames to compile.
	 * @returns {Frame} The compiled frames.
	 */
	compileFrames(...frames) {
		let newFrames = [];

		for (const frame of frames) {
			const { data } = frame;

			data.forEach((pixel, index) => {
				if (pixel) newFrames[index] = pixel;
			});
		}

		return new Frame(newFrames);
	}

	/**
	 * Code that runs when the render is created.
	 */
	__onCreated() {
		this.__intializeDisplay();
		this.__rescaleDisplay();

		window.addEventListener("resize", () => this.__rescaleDisplay());
	}
}

export default Renderer;
