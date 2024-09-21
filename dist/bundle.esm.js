/**
 * Prettify an array when displaying it in a string.
 * @param {Array<*>} array The array to display.
 * @returns {string} Converts the array to a pretty string display.
 */
const displayArray = (array) =>
	`[${array
		.map((item) => {
			switch (typeof item) {
				case "string":
					return `"${item}"`;
				default:
					return item;
			}
		})
		.join(", ")}]`;

var data = /*#__PURE__*/ Object.freeze({
	__proto__: null,
	displayArray: displayArray,
});

class Core {
	/**
	 * The most core level object.
	 * @param {Runtime} runtime The main runtime object.
	 */
	constructor(runtime) {
		this.runtime = runtime;
	}
}

class PixelMesh {
	/**
	 * A pixel mesh stores a 2-dimensional array of `Pixels`.
	 * @param {Array<Pixel>} config.data The frame's 2-dimensional (array of row arrays of `Pixels`) (left-to-right, top-to-bottom) data array.
	 * @param {Array<number>} config.origin An array of display offsets to apply when rendering this pixel.
	 */
	constructor(config) {
		const { data, origin } = config;

		if (origin && !(origin instanceof Array))
			throw new Error(
				'Invalid origin provided to "Pixel". Expected: [<xOffset>, <yOffset>]'
			);

		this.data = data;
		this.origin = origin;
	}

	/**
	 * Get the `Area`'s width.
	 */
	get width() {
		let length = -1;

		for (const row of this.data.filter((row) => row))
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

class Pixel {
	/**
	 * Pixel data for a frame coordinate.
	 * @param {Object} config The pixel config object.
	 * @param {string} config.value The text-value of this spixel.
	 * @param {string} config.color The CSS color value of this pixel.
	 * @param {string|number} config.fontWeight The CSS font weight value of this pixel.
	 * @param {string} config.backgroundColor An optional background color for the pixel.
	 * @param {boolean} config.solid Whether or not this pixel is solid.
	 * @param {Array<number>} config.origin An array of display offsets to apply when rendering this pixel.
	 */
	constructor(config) {
		const {
			value,
			color = "#ffffff",
			fontWeight = "normal",
			backgroundColor,
			solid = false,
			origin,
		} = config;

		if (typeof value !== "string" || value.length !== 1)
			throw new Error(
				"The value of this pixel can only be a 1-character long string."
			);

		if (origin && !(origin instanceof Array))
			throw new Error(
				'Invalid origin provided to "Pixel". Expected: [<xOffset>, <yOffset>]'
			);

		this.value = value;
		this.color = color;
		this.fontWeight = fontWeight;
		this.backgroundColor = backgroundColor;
		this.solid = solid;
		this.origin = origin;
	}

	/**
	 * Create a `Pixel` object from a string.
	 * @param {string} string The string to convert to a `Pixel`.
	 * @returns {Pixel} the newly created `Pixel` object.
	 */
	static fromString = (string) => new Pixel({ value: string });

	/**
	 * Get the `Pixel`'s width.
	 */
	get width() {
		return 1;
	}

	/**
	 * Get the `Pixel`'s height.
	 */
	get height() {
		return 1;
	}
}

class GameObject extends Core {
	/**
	 * A core object that can have its runtime methods managed by the runtime itself, or another object.
	 *
	 * `GameObject`s can have a `get renderable()` get method that returns a `Pixel` or `PixelMesh` object for rendering purposes.
	 * `GameObject`s do not always need to be rendered, and a `get renderable()` method is not indicative of whether the `GameObject`'s logic will function.
	 * `GameObject`s will not be rendered unless they are added to a layer.
	 *
	 * @param {Runtime} runtime The main runtime object.
	 * @param {number} x This entity's x-coordinate.
	 * @param {number} y This entity's y-coordinate.
	 */
	constructor(runtime, x = 0, y = 0) {
		super(runtime);

		if (typeof x !== "number")
			throw new Error(
				"Entity x-coordinate value must be of type 'number'."
			);

		if (typeof y !== "number")
			throw new Error(
				"Entity y-coordinate value must be of type 'number'."
			);

		this.__rawX = x;
		this.__rawY = y;
		this.__rawVisible = true;

		this.behaviors = [];
	}

	/**
	 * Get whether the game object is on-screen.
	 */
	get isOnScreen() {
		const {
			runtime: {
				renderer: { camera },
			},
			x,
			y,
		} = this;

		if (!this.renderable) return false;

		const { width, height } = this.renderable;
		const [pX, pY] = this.layer.parallax;

		return camera.isOnScreen(x, y, width, height, pX, pY);
	}

	/**
	 * Get the `GameObject`'s visibility status.
	 */
	get visible() {
		return this.__rawVisible;
	}

	/**
	 * Set the `GameObject`'s visibility status.
	 */
	set visible(value) {
		this.__rawVisible = Boolean(value);
	}

	/**
	 * Get the game object's adjusted x-coordinate.
	 */
	get x() {
		return Math.round(this.__rawX);
	}

	/**
	 * Set the game object's x-coordinate.
	 */
	set x(n) {
		if (typeof n !== "number")
			throw new Error(
				"Entity x-coordinate value must be of type 'number'."
			);
		this.__rawX = n;
	}

	/**
	 * Get the game object's adjusted y-coordinate.
	 */
	get y() {
		return Math.round(this.__rawY);
	}

	/**
	 * Get the width of this `GameObject`'s renderable.
	 */
	get width() {
		return (this.renderable && this.renderable.width) || 0;
	}

	/**
	 * Get the height of this `GameObject`'s renderable.
	 */
	get height() {
		return (this.renderable && this.renderable.height) || 0;
	}

	/**
	 * Get the origin of this `GameObject`'s renderable.
	 */
	get origin() {
		return (this.renderable && this.renderable.origin) || [0, 0];
	}

	/**
	 * Set the game object's y-coordinate.
	 */
	set y(n) {
		if (typeof n !== "number")
			throw new Error(
				"Entity y-coordinate value must be of type 'number'."
			);
		this.__rawY = n;
	}

	/**
	 * Get the `GameObject`'s current layer.
	 */
	get layer() {
		const {
			runtime: {
				renderer: {
					layerManager: { layers },
				},
			},
		} = this;

		return layers.find(({ gameObjects }) => gameObjects.includes(this));
	}

	/**
	 * Get the label of the `GameObject`'s current layer.
	 */
	get layerLabel() {
		return this.layer && this.layer.label;
	}

	/**
	 * Change the `GameObject`'s layer. Set to a falsey value to remove from any active layers.
	 * @param {string} layer The name of the layer to move to.
	 */
	set layer(label) {
		// Remove from its current layer.
		if (this.layer) {
			// Filter this object from its layer.
			this.layer.gameObjects = this.layer.gameObjects.filter(
				(gameObject) => gameObject !== this
			);
		}

		// If the label was undefined, we don't add to a new layer, if it was defined, we do.
		if (label) {
			if (typeof label !== "string")
				throw new Error("Provided layer label is not a string.");

			const {
				runtime: {
					renderer: {
						layerManager: { layers },
					},
				},
			} = this;

			const layer = layers.find((layer) => layer.label === label);

			if (!layer)
				throw new Error(`No layer exists with label "${label}"`);

			layer.gameObjects.push(this);
		}
	}

	/**
	 * The object's renderable element.
	 */
	get renderable() {
		return new Pixel({ value: "#", color: "red" });
	}

	/**
	 * Whether the object is on a paused layer or the runtime is paused.
	 *
	 * This should be checked when input and logic functions are called, to ensure they do not run when the `GameObject` is paused.
	 *
	 * This **does not** need to be checked in the `GameObject`s `__onTick()` method, as the `__onTick()` method is not called by its parent layer when that layer is paused.
	 */
	get paused() {
		const { runtime, layer } = this;

		if ((layer && layer.paused) || runtime.paused) return true;
		else return false;
	}

	/**
	 * Run the events of each object behavior.
	 *
	 * Runs before this `GameObject`'s `__onTick` method.
	 */
	__behave() {
		if (!this.paused)
			for (const behavior of this.behaviors)
				behavior.enabled && behavior.__onTick && behavior.__onTick();
	}

	/**
	 * Filter this `GameObject` out of an array.
	 * @param {Array<GameObject>} array The array of game objects. The items in the array can either be `GameObject`s or an object with a `gameObject` key set to a `GameObject` instance.
	 * @returns {Array<GameObject>} An array without this `GameObject`.
	 */
	filterThis = (array) =>
		array.filter((item) =>
			item instanceof GameObject
				? item !== this
				: item.gameObject !== this
		);
}

/**
 * Check if two Axis-Aligned Bounding Boxes (AABBs) overlap.
 * @param {number} x1 The x-coordinate of the top-left corner of box 1.
 * @param {number} y1 The y-coordinate of the top-left corner of box 1.
 * @param {number} width1 The width of box 1.
 * @param {number} height1 The height of box 1.
 * @param {number} x2 The x-coordinate of the top-left corner of box 2.
 * @param {number} y2 The y-coordinate of the top-left corner of box 2.
 * @param {number} width2 The width of box 2.
 * @param {number} height2 The height of box 2.
 * @returns {boolean} True if the AABBs overlap, false otherwise.
 */
const aabb = (x1, y1, width1, height1, x2, y2, width2, height2) =>
	x1 < x2 + width2 &&
	x1 + width1 > x2 &&
	y1 < y2 + height2 &&
	y1 + height1 > y2;

/**
 * Clamps a number within a specified range.
 * @param {number} number The number to clamp.
 * @param {number} min The minimum value of the range.
 * @param {number} max The maximum value of the range.
 * @returns {number} The clamped number.
 */
const clamp = (number, min, max) => Math.max(min, Math.min(number, max));

/**
 * Converts an angle from radians to degrees.
 * @param {number} radian The radian value of an angle.
 * @returns {number} Angle, converted to degrees.
 */
const radianToDegree = (radian) => radian * (180 / Math.PI);

/**
 * Converts an angle from degrees to radians.
 * @param {number} degree The degree value of an angle.
 * @returns {number} Angle, converted to radians.
 */
const degreeToRadian = (degree) => degree * (Math.PI / 180);

/**
 * Creates a random integer between two values.
 * @param {number} min The minimum value.
 * @param {number} max The maximum value.
 * @returns {number} A random integer between two values.
 */
const range = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Returns the factorial of a number.
 * @param {number} n The number to return the factorial of.
 * @returns {number} The calculated factorial of n.
 */
const fact = (n) => {
	if (n === 0 || n === 1) return 1;

	for (let i = n - 1; i >= 1; i--) {
		n *= i;
	}

	return n;
};

/**
 * Returns velocity per coordinate in two dimensions.
 * @param {number} angle The angle (in degrees) of rotation.
 * @param {number} velocity The velocity (in pixels) of motion at that angle.
 * @returns {Array<Number>} Returns the x and y coordinate result in an array. `[x, y]`
 */
const vectorToCartesian = (angle, velocity) => [
	velocity * Math.cos(degreeToRadian(angle)),
	velocity * Math.sin(degreeToRadian(angle)),
];

/**
 * Convert cartesian coordinates to a vector. Based on distance from `[0, 0]`.
 * @param {number} x The x-coordinate to calculate with.
 * @param {number} y The y-coordinate to calculate with.
 * @returns {Array<Number>} Returns the vector calculation in an array. `[angle, velocity]`
 */
const cartesianToVector = (x, y) => [
	radianToDegree(Math.atan2(y, x)),
	Math.sqrt(x ** 2 + y ** 2),
];

/**
 * Calculates the angle from one position to another.
 * @param {number} x1 The x position to send the angle from.
 * @param {number} y1 The y position to send the angle from.
 * @param {number} x2 The x position to send the angle to.
 * @param {number} y2 The y position to send the angle to.
 * @returns {number} The angle between the two points.
 */
const angleBetweenPoints = (x1, y1, x2, y2) => {
	return radianToDegree(Math.atan2(y2 - y1, x2 - x1));
};

/**
 * Calculates the distance between two positions.
 * @param {number} x1 The x position to send the angle from.
 * @param {number} y1 The y position to send the angle from.
 * @param {number} x2 The x position to send the angle to.
 * @param {number} y2 The y position to send the angle to.
 * @returns {number} The distance between the two points.
 */
const distanceBetweenPoints = (x1, y1, x2, y2) =>
	Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

var math = /*#__PURE__*/ Object.freeze({
	__proto__: null,
	aabb: aabb,
	angleBetweenPoints: angleBetweenPoints,
	cartesianToVector: cartesianToVector,
	clamp: clamp,
	degreeToRadian: degreeToRadian,
	distanceBetweenPoints: distanceBetweenPoints,
	fact: fact,
	radianToDegree: radianToDegree,
	range: range,
	vectorToCartesian: vectorToCartesian,
});

class Camera extends GameObject {
	/**
	 * The layer manager contains variable layers and compiles them into one frame to render to the screen.
	 * @param {Renderer} renderer The main runtime's renderer object.
	 */
	constructor(renderer) {
		super(renderer.runtime, 0, 0);
		this.renderer = renderer;

		this.config = this.renderer.config && this.renderer.config.camera;
	}

	get renderable() {
		return undefined;
	}

	/**
	 * Check if a bounding box is on screen.
	 * @param {number} x The x-coordinate to check.
	 * @param {number} y The y-coordinate to check.
	 * @param {number} width The width to check.
	 * @param {number} height The height to check.
	 * @param {number} parallaxX Optional parallax x-value. (0-1)
	 * @param {number} parallaxY Optional parallax y-value. (0-1)
	 */
	isOnScreen = (x, y, width, height, parallaxX = 1, parallaxY = 1) =>
		aabb(
			x,
			y,
			width,
			height,
			this.x * parallaxX,
			this.y * parallaxY,
			this.renderer.width,
			this.renderer.height
		);
}

class Frame {
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

class Layer extends Core {
	/**
	 * A layer is a construct of other objects. The layer manages these objects and can optionally render them to the screen.
	 * @param {LayerManager} layerManager The `LayerManager` parent object.
	 * @param {Object} config The `Layer`'s config object.
	 * @param {string} config.label This layer's label.
	 * @param {Array<Number>} config.parallax This layer's parallax array. `[x, y]` Numbers 0-1 determine how much this layer moves with the camera. `[0, 0]` for layers that do not move.
	 */
	constructor(layerManager, config) {
		super(layerManager.runtime);

		const { label, parallax = [1, 1], gameObjects } = config;

		this.layerManager = layerManager;
		this.label = label;

		this.layerManager.layers.push(this);

		if (gameObjects) this.__populateGameObjects(gameObjects);
		else this.gameObjects = [];

		this.paused = false;

		this.parallax = parallax;
	}

	/**
	 * Converts the config array of gameObjects into active `GameObject`s.
	 * @param {Array<Function|GameObject>} gameObjects The array to populate.
	 * @returns {Array<GameObject>} The new array of `GameObject`s.
	 */
	__populateGameObjects(gameObjects) {
		this.gameObjects = gameObjects
			.map((gameObject) => {
				if (typeof gameObject === "function")
					gameObject = gameObject(this.runtime);

				return gameObject;
			})
			.filter((gameObject) => gameObject);

		for (const gameObject of this.gameObjects)
			gameObject.layer = this.label; // Put game object on this layer.
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

		for (const gameObject of this.gameObjects.filter(
			({ visible }) => visible
		)) {
			const { renderable } = gameObject;
			let { x, y } = gameObject;

			if (!renderable) continue;
			else {
				if (renderable.origin) {
					const [oX, oY] = renderable.origin;

					x -= oX;
					y -= oY;

					x = Math.round(x);
					y = Math.round(y);
				}

				if (renderable instanceof Pixel) {
					if (!camera.isOnScreen(x, y, 1, 1, pX, pY)) continue;

					const [xOS, yOS] = [
						x - adjustedCameraX,
						y - adjustedCameraY,
					];
					const index = renderer.coordinatesToIndex(xOS, yOS);

					frameData[index] = renderable;
				} else if (renderable instanceof PixelMesh) {
					if (
						!camera.isOnScreen(
							x,
							y,
							renderable.width,
							renderable.height,
							pX,
							pY
						)
					)
						continue;

					for (
						let pixelY = 0;
						pixelY < renderable.data.length;
						pixelY++
					) {
						const row = renderable.data[pixelY];

						if (!row || row.length === 0) continue;

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

							const index = renderer.coordinatesToIndex(xOS, yOS);

							frameData[index] = pixel;
						}
					}
				}
			}
		}

		return new Frame(frameData);
	}

	__onTick() {
		const { runtime, gameObjects, paused } = this;

		if (paused || runtime.paused) return; // Don't run this layer's code if it or the runtime is paused.

		for (const gameObject of gameObjects) {
			gameObject.__behave();
			runtime.__runOnTick(gameObject);
		}
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

		this.layers = [];
	}

	/**
	 * Get a layer by its label.
	 * @param {string} label The label of the layer to get.
	 * @returns {Layer} A layer with the label provided. Or `undefined` if no layer was found.
	 */
	getLayerByLabel = (label) =>
		this.layers.find((layer) => layer.label === label);

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

	/**
	 * Load layers into the layer manager.
	 * @param {Array<*>} layers The layer creation array.
	 */
	loadLayers(layers) {
		this.layers = [];

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

class Renderer {
	/**
	 * Handles rendering the game using **2D Context**. (slower, CPU only)
	 * @param {Runtime} runtime The game's runtime object.
	 */
	constructor(runtime) {
		this.runtime = runtime;
		this.config = this.runtime.config && this.runtime.config.renderer;

		Renderer.validateConfig(this.config);

		if (!this.config)
			throw new Error("No config object provided to renderer.");

		this.layerManager = new LayerManager(this);
		this.camera = new Camera(this);
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

class InputManager {
	/**
	 * Handles user input.
	 * @param {Runtime} runtime The game's runtime object.
	 */
	constructor(runtime) {
		this.runtime = runtime;

		this.keyboard = { keys: {}, keyCodes: {} };
		this.mouse = { buttons: {} };

		this.__eventListeners = [];
	}

	/**
	 * Get the pointer lock status.
	 */
	get hasPointerLock() {
		const { element } = this.runtime.renderer;
		if (document.pointerLockElement === element) return true;
		else return false;
	}

	/**
	 * Initiate a pointer lock request. Pointer lock cannot be achieved unless the user clicks the screen after this method is called.
	 */
	async requestPointerLock() {
		const { element } = this.runtime.renderer;

		const initiatePointerLock = () => {
			if (!this.hasPointerLock) element.requestPointerLock();
		};

		const lockChangeAlert = () => {
			if (document.pointerLockElement === element) {
				this.mouse = { buttons: {} };
			}
		};

		document.body.addEventListener("click", initiatePointerLock);

		document.addEventListener(
			"pointerlockerror",
			(e) => {
				console.error("Pointer lock request failed.", e);
			},
			false
		);

		document.addEventListener("pointerlockchange", lockChangeAlert, false);
	}

	__formatKey(key) {
		if (key === " ") return "space";
		else if (key === "ArrowUp") return "up";
		else if (key === "ArrowDown") return "down";
		else if (key === "ArrowLeft") return "left";
		else if (key === "ArrowRight") return "right";

		return key.toLowerCase();
	}

	/**
	 * Calls when a key is pushed.
	 * @param {Event} event The listener's event.
	 */
	__onKeyDown(event) {
		const { key, keyCode } = event;

		this.keyboard.keys[this.__formatKey(key)] = true;
		this.keyboard.keyCodes[keyCode] = true;
	}

	/**
	 * Calls when a key is released.
	 * @param {Event} event The listener's event.
	 */
	__onKeyUp(event) {
		const { key, keyCode } = event;

		this.keyboard.keys[this.__formatKey(key)] = false;
		this.keyboard.keyCodes[keyCode] = false;
	}

	/**
	 * Calls when a mouse button is pushed.
	 * @param {Event} event The listener's event.
	 */
	__onMouseDown(event) {
		const { button } = event;

		switch (button) {
			case 0:
				this.mouse.buttons.left = true;
				break;
			case 1:
				this.mouse.buttons.middle = true;
				break;
			case 2:
				this.mouse.buttons.right = true;
				break;
		}
	}

	/**
	 * Calls when a mouse button is released.
	 * @param {Event} event The listener's event.
	 */
	__onMouseUp(event) {
		const { button } = event;

		switch (button) {
			case 0:
				this.mouse.buttons.left = false;
				break;
			case 1:
				this.mouse.buttons.middle = false;
				break;
			case 2:
				this.mouse.buttons.right = false;
				break;
		}
	}

	/**
	 * Calls when the mouse is moved on screen.
	 * @param {Event} event The listener's event.
	 */
	__onMouseMove(event) {
		const { clientX, clientY, movementX, movementY } = event;

		const {
			runtime: {
				renderer: {
					width: characterWidth,
					height: characterHeight,
					element,
					layerManager: { layers },
					camera: { x: cameraX, y: cameraY },
				},
			},
		} = this;

		const {
			x: canvasX,
			y: canvasY,
			width: canvasWidth,
			height: canvasHeight,
		} = element.getBoundingClientRect();

		const [rX, rY] = [clientX - canvasX, clientY - canvasY];
		const [relX, relY] = [rX / canvasWidth, rY / canvasHeight];

		if (this.hasPointerLock) {
			this.mouse.velocity = [movementX, movementY];
		} else {
			this.mouse.velocity = [movementX, movementY];
			this.mouse.rawX = clientX;
			this.mouse.rawY = clientY;
			this.mouse.canvasX = rX;
			this.mouse.canvasY = rY;
			this.mouse.x = clamp(
				Math.round(relX * characterWidth),
				0,
				characterWidth
			);
			this.mouse.y = clamp(
				Math.round(relY * characterHeight),
				0,
				characterHeight
			);

			this.mouse.onLayer = {};

			for (const layer of layers) {
				const {
					label,
					parallax: [parallaxX, parallaxY],
				} = layer;

				this.mouse.onLayer[label] = [
					this.mouse.x + cameraX * parallaxX,
					this.mouse.y + cameraY * parallaxY,
				];
			}
		}
	}

	/**
	 * Manages different events firing, and maps them to the proper method.
	 * @param {Event} event The listener's event.
	 */
	__onEvent(event) {
		if (event instanceof MouseEvent) {
			const { type } = event;

			switch (type) {
				case "mousedown":
					this.__onMouseDown(event);
					break;
				case "mouseup":
					this.__onMouseUp(event);
					break;
				case "mousemove":
					this.__onMouseMove(event);
					break;
			}

			for (const eventListener of this.__eventListeners)
				eventListener({ type, ...this.mouse });
		} else if (event instanceof KeyboardEvent) {
			const { type } = event;

			switch (type) {
				case "keydown":
					this.__onKeyDown(event);
					break;
				case "keyup":
					this.__onKeyUp(event);
					break;
			}

			for (const eventListener of this.__eventListeners)
				eventListener({ type, ...this.keyboard });
		}
	}

	/**
	 * Add an event listener to the input manager.
	 * @param {function} listener The event listener function.
	 */
	addEventListener(listener) {
		this.__eventListeners.push(listener);
	}

	/**
	 * Remove an event listener from the input manager.
	 * @param {function} listener The event listener function.
	 */
	removeEventListener(listener) {
		this.__eventListeners = this.__eventListeners.filter(
			(eventListener) => eventListener !== listener
		);
	}

	__onStartup() {
		window.addEventListener("keydown", (e) => this.__onEvent(e));
		window.addEventListener("keyup", (e) => this.__onEvent(e));
		window.addEventListener("mousemove", (e) => this.__onEvent(e));
		window.addEventListener("mousedown", (e) => this.__onEvent(e));
		window.addEventListener("mouseup", (e) => this.__onEvent(e));
		window.addEventListener("contextmenu", (e) => e.preventDefault());
	}
}

class Sound {
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

class Scene {
	/**
	 * A scene is a level, screen, or world that can be load in at any point during the runtime.
	 * @param {Object} config The scene configuration object.
	 */
	constructor(config) {
		Scene.validateConfig(config);

		const { label, layers, onLoad, onTick } = config;

		this.label = label;
		this.layers = layers;

		if (onLoad) this.__onLoad = onLoad;
		if (onTick) this.__onTick = onTick;
	}

	/**
	 * Validates a scene configuration file and throws an error if it is invalid.
	 * @param {Object} config The config object to validate.
	 */
	static validateConfig(config) {
		if (!config.label || typeof config.label !== "string")
			throw new Error(
				`Invalid label value provided to Scene configuration: "${config.label}". Must be a string.`
			);

		if (!config.layers || config.layers.length === 0)
			throw new Error(
				"No 'layers' configuration provided to LayerManager config."
			);

		for (const layer of config.layers) {
			if (!layer)
				throw new Error(
					`Invalid layer provided to Scene layers config: ${layer}`
				);

			if (!layer.label)
				throw new Error("No label provided to layer in Scene config.");

			if (typeof layer.label !== "string")
				throw new Error(
					`Provided layer name <${layerName}> is not of type 'string'.`
				);

			if (layer.parallax) {
				if (
					!(layer.parallax instanceof Array) ||
					typeof layer.parallax[0] !== "number" ||
					typeof layer.parallax[1] !== "number"
				)
					throw new Error(
						`Invalid parallax data provided to layer configuration. Required format: [<x>, <y>]`
					);
			}

			if (layer.gameObjects) {
				if (!(layer.gameObjects instanceof Array))
					throw new Error(
						`Invalid "gameObjects" data provided to layer configuration. Required format: [GameObject, () => {}]`
					);

				for (const gameObject of layer.gameObjects)
					if (
						typeof gameObject !== "function" &&
						typeof gameObject !== "object"
					)
						throw new Error(
							`GameObject array must contain constructed GameObject instances/extensions, or callback functions that return a constructed GameObject instance.`
						);
			}
		}

		if (config.onLoad && typeof config.onLoad !== "function")
			throw new Error(
				`"onLoad" method provided to scene config is not of type "function".`
			);

		if (config.onTick && typeof config.onTick !== "function")
			throw new Error(
				`"onTick" method provided to scene config is not of type "function".`
			);
	}
}

class Behavior extends Core {
	/**
	 * A core object that modifies the behavior of a GameObject. Behaviors need an `__onTick` method that will run every frame right before their `GameObject`'s `__onTick`.
	 * @param {Runtime} runtime The main runtime object.
	 * @param {GameObject} gameObject The game object to append this behavior to.
	 * @param {boolean} enabledByDefault Whether the Behavior starts out enabled. Default: `true`.
	 */
	constructor(runtime, gameObject, enabledByDefault = true) {
		super(runtime);

		this.gameObject = gameObject;
		gameObject.behaviors.push(this);

		this.enabled = enabledByDefault;
	}
}

class Area extends GameObject {
	/**
	 * An `Area` is generally a static `GameObject` that takes up more than one pixel of space.
	 * @param {Runtime} runtime The main runtime object.
	 * @param {number} x This `Area`'s x-coordinate.
	 * @param {number} y This `Area`'s y-coordinate.
	 * @param {boolean} solid Whether the area's renderable is solid. Empty spaces in the renderable are not solid.
	 */
	constructor(runtime, x, y, solid = false) {
		super(runtime, x, y);

		this.solid = solid;
	}

	get renderable() {
		const p = new Pixel({ value: "#", solid: this.solid });

		return new PixelMesh({
			data: [
				[p, p, p, p, p],
				[p, p, p, p, p],
				[p, p, p, p, p],
				[p, p, p, p, p],
				[p, p, p, p, p],
				[p, p, p, p, p],
			],
		});
	}
}

class Entity extends GameObject {
	/**
	 * An `Entity` is generally a non-static `GameObject`, interactable in some way.
	 * @param {Runtime} runtime The main runtime object.
	 * @param {number} x This `Entity`'s x-coordinate.
	 * @param {number} y This `Entity`'s y-coordinate.
	 */
	constructor(runtime, x, y) {
		super(runtime, x, y);
	}

	get renderable() {
		return new Pixel({ value: "E", color: "green" });
	}
}

// ┌─┬┐  ╔═╦╗  ╓─╥╖  ╒═╤╕
// │ ││  ║ ║║  ║ ║║  │ ││
// ├─┼┤  ╠═╬╣  ╟─╫╢  ╞═╪╡
// └─┴┘  ╚═╩╝  ╙─╨╜  ╘═╧╛

const lineSource = {
	line: [
		["┌", "─", "┐"],
		["│", " ", "│"],
		["└", "─", "┘"],
	],
	double: [
		["╔", "═", "╗"],
		["║", " ", "║"],
		["╚", "═", "╝"],
	],
};

class Box extends GameObject {
	/**
	 * A box that can be rendered on screen.
	 * @param {Runtime} runtime The main runtime object.
	 * @param {Object} config The `Box`'s config object.
	 * @param {number} config.x This `Box` object's x-coordinate.
	 * @param {number} config.y This `Box` object's y-coordinate.
	 * @param {number} config.width This `Box` object's width.
	 * @param {number} config.height This `Box` object's height.
	 * @param {string} config.color Option Box color.
	 * @param {string} config.backgroundColor Optional background color.
	 * @param {string} config.style The box line style. `"line" || "double"`
	 */
	constructor(runtime, config) {
		const {
			x,
			y,
			width,
			height,
			color = "#ffffff",
			backgroundColor,
			style = "double",
		} = config;
		super(runtime, x, y);

		this.__rawWidth = width;
		this.__rawHeight = height;
		this.color = color;

		this.backgroundColor = backgroundColor;

		if (!Object.keys(lineSource).includes(style))
			throw new Error(
				`Invalid box style "${style}" provided. Must be one of: ${displayArray(
					Object.keys(lineSource)
				)}`
			);

		this.style = style;
	}

	get width() {
		return Math.round(this.__rawWidth);
	}
	set width(n) {
		if (typeof n !== "number")
			throw new Error("Box width value must be of type 'number'.");
		this.__rawWidth = n;
	}

	get height() {
		return Math.round(this.__rawHeight);
	}
	set height(n) {
		if (typeof n !== "number")
			throw new Error("Box height value must be of type 'number'.");
		this.__rawHeight = n;
	}

	get renderable() {
		const { width, height, color, backgroundColor, style } = this;
		const styleSet = lineSource[style];

		const data = [];

		for (let y = 0; y < height; y++) {
			const row = [];

			for (let x = 0; x < width; x++) {
				let inX = 0,
					inY = 0;

				if (x === width - 1) inX = 2;
				else if (x > 0) inX = 1;

				if (y === height - 1) inY = 2;
				else if (y > 0) inY = 1;

				let char = styleSet[inY][inX];

				row.push(
					new Pixel({
						value: char,
						color,
						backgroundColor,
						solid: false,
					})
				);
			}

			data.push(row);
		}

		return new PixelMesh({ data });
	}
}

class Text extends GameObject {
	/**
	 * A string of text that can be rendered on screen.
	 * @param {Runtime} runtime The main runtime object.
	 * @param {Object} config The `Text`'s config object.
	 * @param {number} config.x This `Text` object's x-coordinate.
	 * @param {number} config.y This `Text` object's y-coordinate.
	 * @param {string} config.value The text to display. (use `"\n"` for newlines)
	 * @param {boolean} config.wrap Whether to wrap the text if it overflows the screen.
	 * @param {string} config.color Option text color.
	 * @param {string} config.backgroundColor Optional background color.
	 * @param {string} config.fontWeight Optional font weight.
	 */
	constructor(runtime, config) {
		const {
			x,
			y,
			value = "Hello, world!",
			wrap = true,
			color = "#ffffff",
			backgroundColor,
			fontWeight = 400,
		} = config;
		super(runtime, x, y);

		if (typeof value !== "string")
			throw new Error(
				`Provided text value "${value}" is not of type "string".`
			);

		this.__rawValue = value;
		this.wrap = wrap;
		this.color = color;
		this.backgroundColor = backgroundColor;
		this.fontWeight = fontWeight;
	}

	/**
	 * Get the value of the text object.
	 */
	get value() {
		return String(this.__rawValue);
	}

	/**
	 * Set the value of the text object.
	 */
	set value(value) {
		this.__rawValue = value;
	}

	get renderable() {
		const {
			wrap,
			value,
			runtime: {
				renderer: { width },
			},
			color,
			backgroundColor,
			fontWeight,
		} = this;

		const lines = value.split("\n");

		const data = [];

		for (const line of lines) {
			if (!wrap && line.length > width) {
				// If wrap is false and line length exceeds width, ignore overflowing text
				data.push(
					line
						.substring(0, width)
						.split("")
						.map(
							(char) =>
								new Pixel({
									value: char,
									color,
									backgroundColor,
									fontWeight,
								})
						)
				);
			} else {
				// Handle wrapping or normal behavior
				let currentLine = [];
				let currentLength = 0;

				for (const char of line) {
					if (currentLength >= width) {
						if (wrap) {
							// If wrap is true, move to the next line
							data.push(
								currentLine.map(
									(char) =>
										new Pixel({
											value: char,
											color,
											backgroundColor,
											fontWeight,
										})
								)
							);
							currentLine = [];
							currentLength = 0;
						} else {
							// If wrap is false, break the loop as we ignore overflow
							break;
						}
					}

					currentLine.push(char);
					currentLength++;
				}

				// Push the remaining characters in the current line
				if (currentLine.length > 0) {
					data.push(
						currentLine.map(
							(char) =>
								new Pixel({
									value: char,
									color,
									backgroundColor,
									fontWeight,
								})
						)
					);
				}
			}
		}

		return new PixelMesh({ data });
	}
}

class Menu extends GameObject {
	/**
	 * A box that can be rendered on screen.
	 * @param {Runtime} runtime The main runtime object.
	 * @param {Object} config The `Box`'s config object.
	 * @param {number} config.x This `Box` object's x-coordinate.
	 * @param {number} config.y This `Box` object's y-coordinate.
	 * @param {Object} config.options An object of key value pairs, the values representing option labels, and the keys being what is returned when an object is selected.
	 * @param {function} config.callback A callback function that is called when a menu option is selected. Passed the key of the selected option.
	 * @param {string} config.title Optional menu title.
	 */
	constructor(runtime, config) {
		const {
			x,
			y,
			title,
			options,
			callback = (option) => console.log(option),
		} = config;
		super(runtime, x, y);

		this.options = options;
		this.callback = callback;

		this.index = 0;

		this.longestOption = this.determineLongestOption();

		if (title && typeof title !== "string")
			throw new Error(
				`Provided menu title "${title}" is not of type "string".`
			);

		this.title = title;

		runtime.scene.inputManager.addEventListener(
			this.handleInput.bind(this)
		);

		this.__inputMode = "keyboard";
	}

	handleInput(event) {
		if (!this.visible) return;
		if (event.type === "keydown") {
			this.__inputMode = "keyboard";

			const {
				keys: { up, down, enter },
			} = event;

			if (down) this.index++;
			if (up) this.index--;
			if (enter) this.callback(Object.keys(this.options)[this.index]);

			const topIndex = Object.keys(this.options).length - 1;

			if (this.index < 0) this.index = topIndex;
			if (this.index > topIndex) this.index = 0;
		} else if (event.type === "mousemove") {
			const { onLayer } = event;

			const [x, y] = onLayer[this.layer.label];

			const [menuX, menuY] = [x - this.x, y - this.y];

			const mouseMenuIndex = Math.floor(menuY - 1.5);

			if (
				mouseMenuIndex >= 0 &&
				mouseMenuIndex < Object.keys(this.options).length &&
				menuX >= 0 &&
				menuX <= this.width
			) {
				this.__inputMode = "mouse";
				this.index = mouseMenuIndex;
			}
		} else if (
			event.type === "mousedown" &&
			this.__inputMode === "mouse" &&
			this.index >= 0 &&
			this.index < Object.keys(this.options).length
		) {
			this.callback(Object.keys(this.options)[this.index]);
		}
	}

	get width() {
		const {
			runtime: {
				renderer: { width },
			},
		} = this;

		const optionsWidth = Math.round(this.longestOption + 2);
		const titleWidth = this.title ? this.title.length + 4 : 0;

		return Math.max(optionsWidth, titleWidth, width / 4);
	}

	get height() {
		const {
			runtime: {
				renderer: { height },
			},
		} = this;

		return Math.min(
			Math.round(Object.keys(this.options).length + 4),
			height
		);
	}

	determineLongestOption() {
		const { options } = this;

		let longestOption = 0;

		Object.values(options).forEach((value, index) => {
			const optionDisplay = value;
			if (optionDisplay.length > longestOption)
				longestOption = optionDisplay.length;
		});

		return longestOption;
	}

	get renderable() {
		const {
			options,
			runtime,
			runtime: {
				renderer: { width, height },
			},
			title,
		} = this;

		const maxWidth = width - 2;

		const data = [];

		if (options) {
			const optionValues = Object.values(options);

			let displayOptions = optionValues;
			if (optionValues.length + 4 > height) {
				const toDisplay = Math.min(optionValues.length, height - 4);

				if (this.index < Math.floor(toDisplay / 2))
					displayOptions = optionValues.slice(0, toDisplay);
				else if (
					this.index >
					optionValues.length - Math.ceil(toDisplay / 2)
				)
					displayOptions = optionValues.slice(
						optionValues.length - toDisplay
					);
				else if (this.index >= Math.floor(toDisplay / 2))
					displayOptions = optionValues.slice(
						this.index - Math.floor(toDisplay / 2),
						this.index + Math.ceil(toDisplay / 2)
					);
				// displayOptions = optionValues.slice(startIndex, endIndex + 1);
			}

			displayOptions.forEach((value) => {
				if (!value || typeof value !== "string") return;

				const str = value.slice(0, maxWidth);
				const remainingSpace = this.width - 1 - str.length;

				const index = optionValues.indexOf(value);

				const text = new Text(runtime, {
					x: 0,
					y: 0,
					value: `${" ".repeat(
						Math.floor(remainingSpace) / 2
					)}${str}${" ".repeat(Math.ceil(remainingSpace) / 2)}`,
					wrap: false,
					// color: index === this.index ? "#000000" : "#ffffff",
					// backgroundColor:
					// 	index === this.index ? "#ffffff" : "#000000",
					// fontWeight: index === this.index ? "800" : "400",
					color: index === this.index ? "#ffffff" : "grey",
					fontWeight: index === this.index ? "800" : "100",
					backgroundColor: "#000000",
				}).renderable.data[0];

				data.push(text);
			});
		}

		const box = new Box(runtime, {
			x: 0,
			y: 0,
			width: this.width,
			height: Object.keys(options).length + 4,
			backgroundColor: "#000000",
		}).renderable.data;

		data.unshift(box[1]); // Add top padding.
		data.unshift(box[0]); // Add top bar.
		data.push(box[1]); // Add bottom padding.
		data.push(box[box.length - 1]); // Add bottom bar.

		for (let column = 2; column < data.length - 2; column++) {
			data[column].unshift(box[column][0]);
			data[column][this.width - 1] = box[column][box[column].length - 1];
		}

		if (title) {
			const titleText = new Text(runtime, {
				x: 0,
				y: 0,
				value: title.slice(0, maxWidth - 2),
				wrap: false,
				color: "#ffffff",
				backgroundColor: "#000000",
			}).renderable.data[0];

			const startIndex = Math.floor((this.width - titleText.length) / 2);

			for (let i = 0; i < titleText.length; i++) {
				data[0][i + startIndex] = titleText[i];
			}
		}

		return new PixelMesh({ data });
	}
}

/*
 * MIT License
 *
 * Copyright (c) 2022 Alan Ko
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

class Grad {
	x;
	y;
	z;

	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	dot2(x, y) {
		return this.x * x + this.y * y;
	}

	dot3(x, y, z) {
		return this.x * x + this.y * y + this.z * z;
	}
}

class Noise {
	constructor(seed = 0) {
		this.permutationTable = [
			151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7,
			225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6,
			148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35,
			11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171,
			168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231,
			83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245,
			40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76,
			132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86,
			164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5,
			202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16,
			58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44,
			154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253,
			19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246,
			97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241,
			81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199,
			106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254,
			138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78,
			66, 215, 61, 156, 180,
		];

		this.grad3 = [
			new Grad(1, 1, 0),
			new Grad(-1, 1, 0),
			new Grad(1, -1, 0),
			new Grad(-1, -1, 0),
			new Grad(1, 0, 1),
			new Grad(-1, 0, 1),
			new Grad(1, 0, -1),
			new Grad(-1, 0, -1),
			new Grad(0, 1, 1),
			new Grad(0, -1, 1),
			new Grad(0, 1, -1),
			new Grad(0, -1, -1),
		];

		this.perm = new Array(512);
		this.gradP = new Array(512);

		this.F2 = 0.5 * (Math.sqrt(3) - 1);
		this.G2 = (3 - Math.sqrt(3)) / 6;

		this.F3 = 1 / 3;
		this.G3 = 1 / 6;

		if (seed > 0 && seed < 1) {
			// Scale the seed out
			seed *= 65536;
		}

		seed = Math.floor(seed);
		if (seed < 256) {
			seed |= seed << 8;
		}

		for (let i = 0; i < 256; i++) {
			let v;
			if (i & 1) {
				v = this.permutationTable[i] ^ (seed & 255);
			} else {
				v = this.permutationTable[i] ^ ((seed >> 8) & 255);
			}

			this.perm[i] = this.perm[i + 256] = v;
			this.gradP[i] = this.gradP[i + 256] = this.grad3[v % 12];
		}
	}

	simplex2(xin, yin) {
		let n0, n1, n2; // Noise contributions from the three corners
		// Skew the input space to determine which simplex cell we're in
		let s = (xin + yin) * this.F2; // Hairy factor for 2D
		let i = Math.floor(xin + s);
		let j = Math.floor(yin + s);
		let t = (i + j) * this.G2;
		let x0 = xin - i + t; // The x,y distances from the cell origin, unskewed.
		let y0 = yin - j + t;
		// For the 2D case, the simplex shape is an equilateral triangle.
		// Determine which simplex we are in.
		let i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
		if (x0 > y0) {
			// lower triangle, XY order: (0,0)->(1,0)->(1,1)
			i1 = 1;
			j1 = 0;
		} else {
			// upper triangle, YX order: (0,0)->(0,1)->(1,1)
			i1 = 0;
			j1 = 1;
		}
		// A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
		// a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
		// c = (3-sqrt(3))/6
		let x1 = x0 - i1 + this.G2; // Offsets for middle corner in (x,y) unskewed coords
		let y1 = y0 - j1 + this.G2;
		let x2 = x0 - 1 + 2 * this.G2; // Offsets for last corner in (x,y) unskewed coords
		let y2 = y0 - 1 + 2 * this.G2;
		// Work out the hashed gradient indices of the three simplex corners
		i &= 255;
		j &= 255;
		let gi0 = this.gradP[i + this.perm[j]];
		let gi1 = this.gradP[i + i1 + this.perm[j + j1]];
		let gi2 = this.gradP[i + 1 + this.perm[j + 1]];
		// Calculate the contribution from the three corners
		let t0 = 0.5 - x0 * x0 - y0 * y0;
		if (t0 < 0) {
			n0 = 0;
		} else {
			t0 *= t0;
			n0 = t0 * t0 * gi0.dot2(x0, y0); // (x,y) of grad3 used for 2D gradient
		}
		let t1 = 0.5 - x1 * x1 - y1 * y1;
		if (t1 < 0) {
			n1 = 0;
		} else {
			t1 *= t1;
			n1 = t1 * t1 * gi1.dot2(x1, y1);
		}
		let t2 = 0.5 - x2 * x2 - y2 * y2;
		if (t2 < 0) {
			n2 = 0;
		} else {
			t2 *= t2;
			n2 = t2 * t2 * gi2.dot2(x2, y2);
		}
		// Add contributions from each corner to get the final noise value.
		// The result is scaled to return values in the interval [-1,1].
		return 70 * (n0 + n1 + n2);
	}

	simplex3(xin, yin, zin) {
		let n0, n1, n2, n3; // Noise contributions from the four corners

		// Skew the input space to determine which simplex cell we're in
		let s = (xin + yin + zin) * this.F3; // Hairy factor for 2D
		let i = Math.floor(xin + s);
		let j = Math.floor(yin + s);
		let k = Math.floor(zin + s);

		let t = (i + j + k) * this.G3;
		let x0 = xin - i + t; // The x,y distances from the cell origin, unskewed.
		let y0 = yin - j + t;
		let z0 = zin - k + t;

		// For the 3D case, the simplex shape is a slightly irregular tetrahedron.
		// Determine which simplex we are in.
		let i1, j1, k1; // Offsets for second corner of simplex in (i,j,k) coords
		let i2, j2, k2; // Offsets for third corner of simplex in (i,j,k) coords
		if (x0 >= y0) {
			if (y0 >= z0) {
				i1 = 1;
				j1 = 0;
				k1 = 0;
				i2 = 1;
				j2 = 1;
				k2 = 0;
			} else if (x0 >= z0) {
				i1 = 1;
				j1 = 0;
				k1 = 0;
				i2 = 1;
				j2 = 0;
				k2 = 1;
			} else {
				i1 = 0;
				j1 = 0;
				k1 = 1;
				i2 = 1;
				j2 = 0;
				k2 = 1;
			}
		} else {
			if (y0 < z0) {
				i1 = 0;
				j1 = 0;
				k1 = 1;
				i2 = 0;
				j2 = 1;
				k2 = 1;
			} else if (x0 < z0) {
				i1 = 0;
				j1 = 1;
				k1 = 0;
				i2 = 0;
				j2 = 1;
				k2 = 1;
			} else {
				i1 = 0;
				j1 = 1;
				k1 = 0;
				i2 = 1;
				j2 = 1;
				k2 = 0;
			}
		}
		// A step of (1,0,0) in (i,j,k) means a step of (1-c,-c,-c) in (x,y,z),
		// a step of (0,1,0) in (i,j,k) means a step of (-c,1-c,-c) in (x,y,z), and
		// a step of (0,0,1) in (i,j,k) means a step of (-c,-c,1-c) in (x,y,z), where
		// c = 1/6.
		let x1 = x0 - i1 + this.G3; // Offsets for second corner
		let y1 = y0 - j1 + this.G3;
		let z1 = z0 - k1 + this.G3;

		let x2 = x0 - i2 + 2 * this.G3; // Offsets for third corner
		let y2 = y0 - j2 + 2 * this.G3;
		let z2 = z0 - k2 + 2 * this.G3;

		let x3 = x0 - 1 + 3 * this.G3; // Offsets for fourth corner
		let y3 = y0 - 1 + 3 * this.G3;
		let z3 = z0 - 1 + 3 * this.G3;

		// Work out the hashed gradient indices of the four simplex corners
		i &= 255;
		j &= 255;
		k &= 255;
		let gi0 = this.gradP[i + this.perm[j + this.perm[k]]];
		let gi1 = this.gradP[i + i1 + this.perm[j + j1 + this.perm[k + k1]]];
		let gi2 = this.gradP[i + i2 + this.perm[j + j2 + this.perm[k + k2]]];
		let gi3 = this.gradP[i + 1 + this.perm[j + 1 + this.perm[k + 1]]];

		// Calculate the contribution from the four corners
		let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
		if (t0 < 0) {
			n0 = 0;
		} else {
			t0 *= t0;
			n0 = t0 * t0 * gi0.dot3(x0, y0, z0); // (x,y) of grad3 used for 2D gradient
		}
		let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
		if (t1 < 0) {
			n1 = 0;
		} else {
			t1 *= t1;
			n1 = t1 * t1 * gi1.dot3(x1, y1, z1);
		}
		let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
		if (t2 < 0) {
			n2 = 0;
		} else {
			t2 *= t2;
			n2 = t2 * t2 * gi2.dot3(x2, y2, z2);
		}
		let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
		if (t3 < 0) {
			n3 = 0;
		} else {
			t3 *= t3;
			n3 = t3 * t3 * gi3.dot3(x3, y3, z3);
		}
		// Add contributions from each corner to get the final noise value.
		// The result is scaled to return values in the interval [-1,1].
		return 32 * (n0 + n1 + n2 + n3);
	}

	// ##### Perlin noise stuff

	fade(t) {
		return t * t * t * (t * (t * 6 - 15) + 10);
	}

	lerp(a, b, t) {
		return (1 - t) * a + t * b;
	}

	perlin2(x, y) {
		let X = Math.floor(x),
			Y = Math.floor(y);
		// Get relative xy coordinates of point within that cell
		x = x - X;
		y = y - Y;
		// Wrap the integer cells at 255 (smaller integer period can be introduced here)
		X = X & 255;
		Y = Y & 255;

		// Calculate noise contributions from each of the four corners
		let n00 = this.gradP[X + this.perm[Y]].dot2(x, y);
		let n01 = this.gradP[X + this.perm[Y + 1]].dot2(x, y - 1);
		let n10 = this.gradP[X + 1 + this.perm[Y]].dot2(x - 1, y);
		let n11 = this.gradP[X + 1 + this.perm[Y + 1]].dot2(x - 1, y - 1);

		// Compute the fade curve value for x
		let u = this.fade(x);

		// Interpolate the four results
		return this.lerp(
			this.lerp(n00, n10, u),
			this.lerp(n01, n11, u),
			this.fade(y)
		);
	}

	perlin3(x, y, z) {
		// Find unit grid cell containing point
		let X = Math.floor(x),
			Y = Math.floor(y),
			Z = Math.floor(z);
		// Get relative xyz coordinates of point within that cell
		x = x - X;
		y = y - Y;
		z = z - Z;
		// Wrap the integer cells at 255 (smaller integer period can be introduced here)
		X = X & 255;
		Y = Y & 255;
		Z = Z & 255;

		// Calculate noise contributions from each of the eight corners
		let n000 = this.gradP[X + this.perm[Y + this.perm[Z]]].dot3(x, y, z);
		let n001 = this.gradP[X + this.perm[Y + this.perm[Z + 1]]].dot3(
			x,
			y,
			z - 1
		);
		let n010 = this.gradP[X + this.perm[Y + 1 + this.perm[Z]]].dot3(
			x,
			y - 1,
			z
		);
		let n011 = this.gradP[X + this.perm[Y + 1 + this.perm[Z + 1]]].dot3(
			x,
			y - 1,
			z - 1
		);
		let n100 = this.gradP[X + 1 + this.perm[Y + this.perm[Z]]].dot3(
			x - 1,
			y,
			z
		);
		let n101 = this.gradP[X + 1 + this.perm[Y + this.perm[Z + 1]]].dot3(
			x - 1,
			y,
			z - 1
		);
		let n110 = this.gradP[X + 1 + this.perm[Y + 1 + this.perm[Z]]].dot3(
			x - 1,
			y - 1,
			z
		);
		let n111 = this.gradP[X + 1 + this.perm[Y + 1 + this.perm[Z + 1]]].dot3(
			x - 1,
			y - 1,
			z - 1
		);

		// Compute the fade curve value for x, y, z
		let u = this.fade(x);
		let v = this.fade(y);
		let w = this.fade(z);

		// Interpolate
		return this.lerp(
			this.lerp(this.lerp(n000, n100, u), this.lerp(n001, n101, u), w),
			this.lerp(this.lerp(n010, n110, u), this.lerp(n011, n111, u), w),
			v
		);
	}
}

class ScrollTo extends Behavior {
	/**
	 * Scroll the camera to a `GameObject`.
	 * @param {Runtime} runtime The main runtime object.
	 * @param {GameObject} gameObject The game object to append this behavior to.
	 * @param {boolean} enabledByDefault Whether the Behavior starts out enabled. Default: `true`.
	 */
	constructor(runtime, gameObject, enabledByDefault = true) {
		super(runtime, gameObject, enabledByDefault);
	}

	__onTick() {
		if (this.gameObject.paused) return;

		const {
			gameObject: {
				x,
				y,
				width,
				height,
				origin: [oX, oY],
			},
			runtime: {
				renderer: { camera, width: screenWidth, height: screenHeight },
			},
		} = this;

		// Put the center of the screen over the center of the object.
		camera.x = x - oX + width / 2 - screenWidth / 2;
		camera.y = y - oY + height / 2 - screenHeight / 2;
	}
}

class TopDownMovement extends Behavior {
	/**
	 * Move a `GameObject` from a top-down perspective.
	 * @param {Runtime} runtime The main runtime object.
	 * @param {GameObject} gameObject The game object to append this behavior to.
	 * @param {boolean} enabledByDefault Whether the Behavior starts out enabled. Default: `true`.
	 * @param {Object} config The configuration for this `TopDownMovement`.
	 * @param {boolean} config.defaultControls Whether to automatically handle input using the arrow keys. Default: `true`.
	 */
	constructor(
		runtime,
		gameObject,
		enabledByDefault = true,
		config = { defaultControls: true }
	) {
		super(runtime, gameObject, enabledByDefault);

		TopDownMovement.validateConfig(config);

		const { defaultControls = true } = config;

		if (defaultControls)
			runtime.scene.inputManager.addEventListener(
				this.handleInput.bind(this)
			);
	}

	/**
	 * Validates a TopDownMovement configuration object and throws an error if it is invalid.
	 * @param {Object} config The config object to validate.
	 */
	static validateConfig(config) {
		if (!config)
			throw new Error(
				`No configuration provided to "TopDownMovement" behavior.`
			);
	}

	/**
	 * Attempt to move `GameObject` up.
	 */
	simulateControlUp = () => {
		if (this.gameObject.paused) return;

		const {
			gameObject: { x, y },
		} = this;

		this.__tryToMoveToPosition(x, y - 1);
	};

	/**
	 * Attempt to move `GameObject` down.
	 */
	simulateControlDown = () => {
		if (this.gameObject.paused) return;

		const {
			gameObject: { x, y },
		} = this;

		this.__tryToMoveToPosition(x, y + 1);
	};

	/**
	 * Attempt to move `GameObject` left.
	 */
	simulateControlLeft = () => {
		if (this.gameObject.paused) return;

		const {
			gameObject: { x, y },
		} = this;

		this.__tryToMoveToPosition(x - 1, y);
	};

	/**
	 * Attempt to move `GameObject` right.
	 */
	simulateControlRight = () => {
		if (this.gameObject.paused) return;

		const {
			gameObject: { x, y },
		} = this;

		this.__tryToMoveToPosition(x + 1, y);
	};

	handleInput(event) {
		if (this.gameObject.paused) return;

		if (event.type === "keydown") {
			const {
				keys: { up, down, left, right },
			} = event;

			if (up) this.simulateControlUp();
			if (down) this.simulateControlDown();
			if (left) this.simulateControlLeft();
			if (right) this.simulateControlRight();
		}
	}

	/**
	 * Check if it is clear to move to a position, and then move there.
	 * @param {number} x The x-coordinate to check.
	 * @param {number} y The y-coordinate to check.
	 */
	__tryToMoveToPosition(x, y) {
		if (this.gameObject.paused) return;

		const {
			gameObject,
			gameObject: {
				width,
				height,
				origin: [oX, oY],
			},
			runtime: {
				renderer: { layerManager },
			},
		} = this;

		if (width <= 1 && height <= 1) {
			const solidAt = layerManager.solidAtPosition(x, y);

			if (!solidAt || solidAt.gameObject === gameObject) {
				gameObject.x = x;
				gameObject.y = y;
			}

			return;
		}

		let canMove = true;

		// Determine direction of movement
		const moveRight = x > gameObject.x;
		const moveLeft = x < gameObject.x;
		const moveDown = y > gameObject.y;
		const moveUp = y < gameObject.y;

		// Check collision along the direction of movement
		if (moveRight || moveLeft) {
			const startY = gameObject.y - oY;
			const endY = startY + height - 1;

			for (let posY = startY; posY <= endY; posY++) {
				const posX = moveRight ? x + width - 1 - oX : x - oX;
				const solidAt = layerManager.solidAtPosition(posX, posY);

				if (solidAt && solidAt.gameObject !== gameObject) {
					canMove = false;
					break;
				}
			}
		} else if (moveDown || moveUp) {
			const startX = gameObject.x - oX;
			const endX = startX + width - 1;

			for (let posX = startX; posX <= endX; posX++) {
				const posY = moveDown ? y + height - 1 - oY : y - oY;
				const solidAt = layerManager.solidAtPosition(posX, posY);

				if (solidAt && solidAt.gameObject !== gameObject) {
					canMove = false;
					break;
				}
			}
		}

		// If all pixels are clear, move the gameObject
		if (canMove) {
			gameObject.x = x;
			gameObject.y = y;
		}
	}

	__onTick() {}
}

class AnimationFrame {
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

class Animation {
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
	 * @param {Runtime} runtime The main runtime object.
	 * @param {GameObject} gameObject The game object to append this behavior to.
	 * @param {boolean} enabledByDefault Whether the Behavior starts out enabled. Default: `true`.
	 * @param {Object} config The configuration for this `Animate`.
	 * @param {Array<Animation>} config.animations The animations for this behavior.
	 * @param {string} config.initialAnimation The label of the animation to start on.
	 * @param {number} config.initialFrame The frame of the animation to start on.
	 */
	constructor(runtime, gameObject, enabledByDefault = true, config) {
		super(runtime, gameObject, enabledByDefault);

		Animate.validateConfig(config);

		const { animations, initialFrame = 0, initialAnimation } = config;

		this.animations = animations;

		this.currentAnimationLabel = undefined;
		this.__rawCurrentAnimationFrameIndex = initialFrame;
		this.playing = false;
		this.repeats = 0;
		this.speed = 0;

		if (initialAnimation) this.currentAnimation = initialAnimation;

		if (this.currentAnimation) this.playing = true;
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

	__onTick() {
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

class Runtime {
	/**
	 * The overall game state and management system.
	 * @param {Object} config The game's config object.
	 */
	constructor(config) {
		this.config = config;

		this.validateConfig(config);

		this.noise = new Noise(config.seed || Date.now());

		this.renderer = new Renderer(this);

		this.inputManager = new InputManager(this);
		this.audioManager = new AudioManager(this);

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
	 * @param {Object} object The object whose method should be run.
	 * @param  {...any} passthrough The data to pass through to that method.
	 */
	__runOnStartup = (object, ...passthrough) =>
		object.__onStartup && object.__onStartup(...passthrough);

	/**
	 * Run the __onTick method of any object.
	 * @param {Object} object The object whose method should be run.
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

		this.renderer.layerManager.layers = [];

		for (const eventListener of this.inputManager.__eventListeners)
			this.inputManager.removeEventListener(eventListener);

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

export {
	math as AdvMath,
	Animate,
	Animation,
	AnimationFrame,
	Area,
	Behavior,
	Box,
	Core,
	Entity,
	Frame,
	GameObject,
	Layer,
	Menu,
	Pixel,
	PixelMesh,
	Scene,
	ScrollTo,
	Text,
	TopDownMovement,
	AudioManager as __AudioManager,
	Camera as __Camera,
	InputManager as __InputManager,
	LayerManager as __LayerManager,
	Noise as __Noise,
	Renderer as __Renderer,
	Sound as __Sound,
	data as dataUtils,
	Runtime as default,
};
