import { displayArray } from "../util/data.js";
import Camera from "./Camera.js";
import LayerManager from "./LayerManager.js";

export class Pixel {
	/**
	 * Pixel data for a frame coordinate.
	 * @param {*} config The pixel config object.
	 * @param {string} config.value The text-value of this spixel.
	 * @param {string} config.color The CSS color value of this pixel.
	 * @param {string|number} config.fontWeight The CSS font weight value of this pixel.
	 * @param {string} config.backgroundColor An optional background color for the pixel.
	 * @param {boolean} config.solid Whether or not this pixel is solid.
	 */
	constructor(config) {
		const {
			value,
			color = "#ffffff",
			fontWeight = "normal",
			backgroundColor,
			solid = false,
		} = config;

		if (typeof value !== "string" || value.length !== 1)
			throw new Error(
				"The value of this pixel can only be a 1-character long string."
			);

		this.value = value;
		this.color = color;
		this.fontWeight = fontWeight;
		this.backgroundColor = backgroundColor;
		this.solid = solid;
	}

	/**
	 * Create a `Pixel` object from a string.
	 * @param {string} string The string to convert to a `Pixel`.
	 * @returns {Pixel} the newly created `Pixel` object.
	 */
	static fromString = (string) => new Pixel({ value: string });
}

export class PixelMesh {
	/**
	 * A pixel mesh stores a 2-dimensional array of `Pixels`.
	 * @param {Array<Pixel>} data The frame's 2-dimensional (array of row arrays of `Pixels`) (left-to-right, top-to-bottom) data array.
	 */
	constructor(data) {
		this.data = data;
	}

	/**
	 * Get the `Area`'s width.
	 */
	get width() {
		let length = -1;

		for (const row of this.data)
			if (row.length > length) length = row.length;

		return length === -1 ? undefined : length;
	}

	/**
	 * Get the `Area`'s height.
	 */
	get height() {
		return this.data.length;
	}
}

export class Frame {
	/**
	 * A display frame.
	 * @param {Array<Pixel>} data The frame's 1-dimensional (left-to-right, top-to-bottom) data array.
	 * Any index after `Screen Width * Screen Height` will not be displayed, no max size is enforced.
	 */
	constructor(data) {
		this.data = data;
	}

	/**
	 * Convert a string to a frame.
	 * @param {string} string The string to convert.
	 * @returns {Frame} the generated Frame.
	 */
	static fromString = (string) =>
		new Frame(string.split("").map((item) => new Pixel({ value: item })));

	/**
	 * Convert a 2D array of `Pixel`s to a Frame.
	 * @param {Array<Array<Pixel>} array The array to convert.
	 */
	static from2DArray = (array) => new Frame(array.flat());
}

class Renderer {
	/**
	 * Handles rendering the game.
	 * @param {Runtime} runtime The game's runtime object.
	 */
	constructor(runtime) {
		this.runtime = runtime;
		this.config = this.runtime.config && this.runtime.config.renderer;

		Renderer.validateConfig(this.config);

		if (!this.config)
			throw new Error("No config object provided to renderer.");
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
	 * @param {*} config The config object to validate.
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

		if (!config.layerManager)
			throw new Error(
				"No layerManager configuration provided to Renderer config."
			);

		if (config.renderMode) {
			const renderModes = ["stacked", "merged"];
			if (!renderModes.includes(config.renderMode))
				throw new Error(
					`Provided render mode is invalid. Must be of type: ${displayArray(
						renderModes
					)}`
				);
		}
	}

	/**
	 * Initialize the display.
	 */
	__intializeDisplay() {
		this.drawing = false;
		this.hasDrawn = false;
		this.element = document.body.querySelector("canvas.display");

		if (!this.element)
			throw new Error(
				"No 'canvas.display' rendering element present in DOM."
			);

		this.ctx = this.element.getContext("2d");

		const { ctx } = this;
		const { fontSize } = this.config;

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
	 * Draw a frame to the screen.
	 * @param {Frame} frame The frame to draw.
	 */
	drawFrame(frame) {
		if (this.drawing) return;

		if (!(frame instanceof Frame))
			throw new Error(
				"Provided frame object is not an instance of the Frame constructor."
			);

		if (!this.hasDrawn) this.hasDrawn = true;
		this.drawing = true;

		const {
			config: { fontSize },

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

				const { value, color, fontWeight, backgroundColor } = data;

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

				ctx.font = `${fontWeight || "normal"} ${fontSize} monospace`;

				ctx.fillStyle = color || "#FFFFFF";

				ctx.fillText(value, x * cW, y * cH);

				ctx.closePath();
			}

		frame.state = "current";

		this.drawing = false;
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
	 * Code that runs when the project starts.
	 */
	__onStartup() {
		const { runtime } = this;

		this.layerManager = new LayerManager(this);
		runtime.__runOnStartup(this.layerManager);

		this.camera = new Camera(this);

		this.__intializeDisplay();
		this.__rescaleDisplay();

		window.addEventListener("resize", () => this.__rescaleDisplay());
	}

	/**
	 * Code that runs on every frame.
	 */
	__onTick() {
		const { runtime } = this;

		runtime.__runOnTick(this.layerManager);
	}
}

export default Renderer;
