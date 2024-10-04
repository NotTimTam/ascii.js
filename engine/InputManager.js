import { displayArray } from "../util/data.js";
import { clamp } from "../util/math.js";
import Scene from "./Scene.js";

class GamepadInterface {
	static gamepadButtonIntervals = 100;
	static deadzoneThreshold = 0.1;

	/**
	 * Apply a deadzone value to a set of axes inputs.
	 * @param {Object<number>} values The axis input values. In a key-value object.
	 * @param {number} threshold The deadzone threshold value. (default `0.1`)
	 * @returns
	 */
	static applyDeadzone(
		values,
		threshold = GamepadInterface.deadzoneThreshold
	) {
		for (const [name, value] of Object.entries(values)) {
			// If the value is within the deadzone range, return 0 (consider it neutral)
			if (Math.abs(value) < threshold) values[name] = 0;

			// If outside the deadzone, adjust the value by scaling it from the edge of the deadzone to 1 or -1
			values[name] =
				(value - Math.sign(value) * threshold) / (1 - threshold);
		}

		return values;
	}

	static xbButtonMap = [
		"a",
		"b",
		"x",
		"y",
		"leftBumper",
		"rightBumper",
		"leftTrigger",
		"rightTrigger",
		"select",
		"start",
		"leftStickPress",
		"rightStickPress",
		"up",
		"down",
		"left",
		"right",
	];

	static psButtonMap = [
		"x",
		"o",
		"square",
		"triangle",
		"l1",
		"r1",
		"l2",
		"r2",
		"share",
		"options",
		"l3",
		"r3",
		"up",
		"down",
		"left",
		"right",
	];

	static nsButtonMap = [
		"b",
		"a",
		"y",
		"x",
		"leftBumper",
		"rightBumper",
		"leftTrigger",
		"rightTrigger",
		"-",
		"+",
		"leftStickPress",
		"rightStickPress",
		"up",
		"down",
		"left",
		"right",
	];

	static standardButtonMap = [
		"a",
		"b",
		"x",
		"y",
		"l1",
		"r1",
		"l2",
		"r2",
		"select",
		"start",
		"l3",
		"r3",
		"up",
		"down",
		"left",
		"right",
	];

	static standardAxesMap = ["lh", "lv", "rh", "rv"];

	/**
	 * Create a simple interface for collecting gamepad inputs.
	 *
	 * This interface attempts to normalize inputs for these controllers to make it easier to interact with them.
	 * Unsupported controllers can still be interacted with through the interfaces `raw` property.
	 *
	 * ### Tested Controllers
	 * - XB (One) Wireless Controller
	 * - PS4
	 * - NS Pro
	 *
	 * @param {InputManager} inputManager The `InputManager` instance this Gamepad is associated with.
	 * @param {number} index The index of the gamepad.
	 */
	constructor(inputManager, index) {
		this.index = index;

		this.inputManager = inputManager;
	}

	/**
	 * Get the inputs in a normalized format. To allow identical input layouts even with differing input names.
	 */
	get normalized() {
		if (!this.raw) return undefined;

		const {
			raw: { axes, buttons, mapping },
		} = this;

		if (mapping === "standard")
			return {
				axes: GamepadInterface.applyDeadzone(
					Object.fromEntries(
						axes
							.filter(
								(_, index) =>
									GamepadInterface.standardAxesMap[index]
							)
							.map((axis, index) => [
								GamepadInterface.standardAxesMap[index],
								axis,
							])
					)
				),
				buttons: Object.fromEntries(
					buttons
						.filter(
							(axis, index) =>
								GamepadInterface.standardButtonMap[index]
						)
						.map((axis, index) => [
							GamepadInterface.standardButtonMap[index],
							axis,
						])
				),
			};
		else return this.asXB || this.asPS || this.asNS;
	}

	/**
	 * Get the inputs from a xb controller.
	 */
	get asXB() {
		if (!this.raw) return undefined;

		const {
			raw: { axes, buttons },
		} = this;

		return {
			axes: Object.fromEntries(
				axes
					.filter(
						(axis, index) => GamepadInterface.standardAxesMap[index]
					)
					.map((axis, index) => [
						GamepadInterface.standardAxesMap[index],
						axis,
					])
			),
			buttons: Object.fromEntries(
				buttons
					.filter(
						(axis, index) => GamepadInterface.xbButtonMap[index]
					)
					.map((axis, index) => [
						GamepadInterface.xbButtonMap[index],
						axis,
					])
			),
		};
	}

	/**
	 * Get inputs from a ps controller.
	 */
	get asPS() {
		if (!this.raw) return undefined;

		const {
			raw: { axes, buttons },
		} = this;

		return {
			axes: Object.fromEntries(
				axes
					.filter(
						(axis, index) => GamepadInterface.standardAxesMap[index]
					)
					.map((axis, index) => [
						GamepadInterface.standardAxesMap[index],
						axis,
					])
			),
			buttons: Object.fromEntries(
				buttons
					.filter(
						(axis, index) => GamepadInterface.psButtonMap[index]
					)
					.map((axis, index) => [
						GamepadInterface.psButtonMap[index],
						axis,
					])
			),
		};
	}

	/**
	 * Get inputs from a ns pro controller.
	 */
	get asNS() {
		if (!this.raw) return undefined;

		const {
			raw: { axes, buttons },
		} = this;

		return {
			axes: Object.fromEntries(
				axes
					.filter(
						(axis, index) => GamepadInterface.standardAxesMap[index]
					)
					.map((axis, index) => [
						GamepadInterface.standardAxesMap[index],
						axis,
					])
			),
			buttons: Object.fromEntries(
				buttons
					.filter(
						(axis, index) => GamepadInterface.nsButtonMap[index]
					)
					.map((axis, index) => [
						GamepadInterface.nsButtonMap[index],
						axis,
					])
			),
		};
	}

	/**
	 * Get the controller axes. (normalizes inputs to two analogue sticks)
	 */
	get axes() {
		return this.normalized && this.normalized.axes;
	}

	/**
	 * Get the controller buttons. (normalizes inputs to a standard "xb" layout: [a/b/x/y, dpad, triggers/bumpers])
	 */
	get buttons() {
		return this.normalized && this.normalized.buttons;
	}

	get raw() {
		return this.inputManager.rawGamepads[this.index];
	}

	get mapping() {
		if (!this.raw) return undefined;

		if (this.raw.mapping === "standard") return "standard";
		else return "unknown";
	}

	get id() {
		return this.raw && this.raw.id;
	}

	get vibrationActuator() {
		return this.raw && this.raw.vibrationActuator;
	}

	get hapticActuators() {
		return this.raw && this.raw.hapticActuators;
	}

	get hand() {
		return this.raw && this.raw.hand;
	}
}

class InputManager {
	/**
	 * Handles user input.
	 * @param {Scene} scene The current scene.
	 */
	constructor(scene) {
		this.scene = scene;

		this.keyboard = {
			keys: {},
			keyCodes: {},
			keyCode: undefined,
			key: undefined,
		};
		this.mouse = { buttons: {}, onLayer: {} };

		this.__eventListeners = {
			gamepadbuttonpressed: [],
			gamepadbuttondown: [],
			gamepadbuttonup: [],
			all: [],
			click: [
				(e) => {
					// Handle clicks on specific game objects.
					for (const [targetId, listener] of this
						.__gameObjectClicks) {
						if (e.targets.includes(targetId)) {
							let passthrough = { ...e };
							delete passthrough.targets;
							passthrough.target = targetId;
							listener(passthrough);
						}
					}
				},
			],
		};
		this.__gameObjectClicks = [];

		this.__onCreated();

		this.__windowBlurHandler = this.__windowBlurHandler.bind(this);
	}

	/**
	 * Get the raw `navigator.getGamepads()` data.
	 */
	get rawGamepads() {
		return navigator.getGamepads();
	}

	/**
	 * Get easy-to-use gamepad data.
	 */
	get gamepads() {
		return this.rawGamepads.map((gamepad) => {
			if (!gamepad) return null;

			const { index } = gamepad;

			return new GamepadInterface(this, index);
		});
	}

	/**
	 * Get the number of gamepads currently connected to the navigator.
	 */
	get gamepadsConnected() {
		return this.gamepads
			? this.gamepads.filter((gamepad) => gamepad).length
			: 0;
	}

	/**
	 * Get permitted event types.
	 */
	get types() {
		return Object.keys(this.__eventListeners);
	}

	__eventHandler = (e) => this.__onEvent(e);
	__contextHandler = (e) => e.preventDefault();

	/**
	 * Get the pointer lock status.
	 */
	get hasPointerLock() {
		const { element } = this.scene.runtime.renderer;
		if (document.pointerLockElement === element) return true;
		else return false;
	}

	/**
	 * Initiate a pointer lock request. Pointer lock cannot be achieved unless the user clicks the screen after this method is called.
	 */
	async requestPointerLock() {
		const { element } = this.scene.runtime.renderer;

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
		if (this.preventKeyboardShortcuts) event.preventDefault();

		const { key, keyCode } = event;

		this.keyboard.keys[this.__formatKey(key)] = true;
		this.keyboard.keyCodes[keyCode] = true;
		this.keyboard.keyCode = keyCode;
		this.keyboard.key = key;
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
	 * Calls when a mouse button is clicked.
	 */
	__onClick() {
		const { onLayer } = this.mouse;

		this.mouse.targets = [];

		for (const [label, [x, y]] of Object.entries(onLayer)) {
			const targetsOnLayer = this.scene.layerManager.getAtPosition(
				x,
				y,
				label
			);

			this.mouse.targets = [...this.mouse.targets, ...targetsOnLayer];
		}

		// Convert target objects into an array of IDs.
		if (this.mouse.targets)
			this.mouse.targets = this.mouse.targets.map(
				({ gameObject }) => gameObject.id
			);
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
			scene: {
				camera: { x: cameraX, y: cameraY },
				layerManager: { layers },
				runtime: {
					renderer: {
						width: characterWidth,
						height: characterHeight,
						element,
					},
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
				Math.floor(relX * characterWidth),
				0,
				characterWidth
			);
			this.mouse.y = clamp(
				Math.floor(relY * characterHeight),
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
	 * Calls when a mouse wheel is moved.
	 * @param {Event} event The listener's event.
	 */
	__onMouseWheel(event) {
		const { deltaX, deltaY, deltaZ } = event;

		this.mouse.deltas = { x: deltaX, y: deltaY, z: deltaZ };
		this.mouse.scroll = {
			x: deltaX > 0 ? "down" : "up",
			y: deltaY > 0 ? "down" : "up",
			z: deltaZ > 0 ? "down" : "up",
		};
	}

	/**
	 * Reset mouse wheel return data.
	 */
	__resetMouseWheel() {
		this.mouse.deltas = { x: 0, y: 0, z: 0 };
		this.mouse.scroll = {
			x: null,
			y: null,
			z: null,
		};
	}

	/**
	 * Calls when a gamepad is connected.
	 * @param {Event} event The listener's event.
	 */
	__onGamepadConnected(event) {
		const { gamepad } = event;

		if (gamepad.mapping !== "standard")
			console.warn(
				`Controller connected to slot ${gamepad.index} with non-standard mapping: "${gamepad.mapping}"`
			);

		this.gamepads[gamepad.index] = gamepad;
	}

	/**
	 * Calls when a gamepad is disconnected.
	 * @param {Event} event The listener's event.
	 */
	__onGamepadDisconnected(event) {
		const { gamepad } = event;

		this.gamepads[gamepad.index] = null;
	}

	/**
	 * Trigger events for a specific event type.
	 * @param {string} type The type of event to trigger for.
	 * @param {*} data The data to send to that event.
	 */
	__triggerEvents(type, data) {
		if (!this.__eventListeners[type]) this.__eventListeners[type] = [];
		for (const eventListener of this.__eventListeners[type])
			eventListener(data);
	}

	/**
	 * Manages different events firing, and maps them to the proper method.
	 * @param {Event} event The listener's event.
	 */
	__onEvent(event) {
		if (event instanceof MouseEvent || event instanceof WheelEvent) {
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
				case "wheel":
					this.__onMouseWheel(event);
					break;
				case "click":
					this.__onClick();
					break;
			}

			this.__triggerEvents(type, { type, ...this.mouse }); // Trigger the specific event type that fired.
			this.__triggerEvents("all", { type, ...this.mouse }); // Trigger the "all" event type.

			if (type === "click" && this.mouse.target) delete this.mouse.target; // Delete target items to clear for next event.
			this.__resetMouseWheel();
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

			this.__triggerEvents(type, { type, ...this.keyboard }); // Trigger the specific event type that fired.
			this.__triggerEvents("all", { type, ...this.keyboard }); // Trigger the "all" event type.
		} else if (event instanceof GamepadEvent) {
			const { type } = event;

			switch (type) {
				case "gamepadconnected":
					this.__onGamepadConnected(event);
					break;
				case "gamepaddisconnected":
					this.__onGamepadDisconnected(event);
					break;
			}

			this.__triggerEvents(type, { type, gamepads: this.gamepads }); // Trigger the specific event type that fired.
			this.__triggerEvents("all", { type, gamepads: this.gamepads }); // Trigger the "all" event type.
		}
	}

	/**
	 * Handles when the user leaves this tab.
	 */
	__windowBlurHandler = () => {
		this.keyboard.keys = {};
		this.mouse.buttons = {};
		delete this.mouse.deltas;
		delete this.mouse.scroll;
	};

	/**
	 * Add an event listener to the input manager.
	 * @param {string} type The type of event to add.
	 * @param {function} listener The event listener function.
	 */
	addEventListener(type, listener) {
		if (!this.types.includes(type))
			throw new Error(
				`"${type}" is not a valid event type. Must be one of: ${displayArray(
					this.types
				)}`
			);

		this.__eventListeners[type].push(listener);
	}

	/**
	 * Remove an event listener from the input manager.
	 * @param {string} type The type of event to remove.
	 * @param {function} listener The event listener function that was added to the event listener.
	 */
	removeEventListener(type, listener) {
		if (!this.types.includes(type))
			throw new Error(
				`"${type}" is not a valid event type. Must be one of: ${displayArray(
					this.types
				)}`
			);

		this.__eventListeners[type] = this.__eventListeners[type].filter(
			(eventListener) => eventListener !== listener
		);
	}

	/**
	 * Add a listener for clicks on a `GameObject`.
	 * @param {string} gameObjectId The ID of the `GameObject` that, when clicked, triggers the event.
	 */
	watchObjectClick(gameObjectId, listener) {
		this.__gameObjectClicks.push([gameObjectId, listener]);
	}

	/**
	 * Remove a listener for clicks on a `GameObject`.
	 * @param {string} gameObjectId The ID of the `GameObject`.
	 * @param {function} listener The event listener function that was added to the event listener.
	 */
	unwatchObjectClick(gameObjectId, listener) {
		this.__gameObjectClicks = this.__gameObjectClicks.filter(
			(arr) => arr[0] !== gameObjectId && arr[1] !== listener
		);
	}

	/**
	 * Add an event listener to the window for the entire `InputManager`.
	 * @param {string} type The type of event to add.
	 * @param {function} handler The handler for that event.
	 */
	__addGlobalEventListener(type, handler) {
		if (!this.__eventListeners[type]) this.__eventListeners[type] = [];
		window.addEventListener(type, handler);
	}

	/**
	 * Remove an event listener from the window.
	 * @param {string} type The type of event to remove.
	 * @param {function} handler The handler that was set for that event.
	 */
	__removeGlobalEventListener(type, handler) {
		delete this.__eventListeners[type];
		window.removeEventListener(type, handler);
	}

	__onCreated() {
		this.__addGlobalEventListener("keydown", this.__eventHandler);
		this.__addGlobalEventListener("keyup", this.__eventHandler);
		this.__addGlobalEventListener("mousemove", this.__eventHandler);
		this.__addGlobalEventListener("mousedown", this.__eventHandler);
		this.__addGlobalEventListener("mouseup", this.__eventHandler);
		this.__addGlobalEventListener("click", this.__eventHandler);
		this.__addGlobalEventListener("wheel", this.__eventHandler);
		this.__addGlobalEventListener("gamepadconnected", this.__eventHandler);
		this.__addGlobalEventListener(
			"gamepaddisconnected",
			this.__eventHandler
		);
		this.__addGlobalEventListener("contextmenu", this.__contextHandler);
		window.addEventListener("blur", this.__windowBlurHandler);
	}

	/**
	 * Unload the `InputManager` instance by removing all system event listeners.
	 */
	__unLoad() {
		this.__removeGlobalEventListener("keydown", this.__eventHandler);
		this.__removeGlobalEventListener("keyup", this.__eventHandler);
		this.__removeGlobalEventListener("mousemove", this.__eventHandler);
		this.__removeGlobalEventListener("mousedown", this.__eventHandler);
		this.__removeGlobalEventListener("mouseup", this.__eventHandler);
		this.__removeGlobalEventListener("click", this.__eventHandler);
		this.__removeGlobalEventListener("wheel", this.__eventHandler);
		this.__removeGlobalEventListener(
			"gamepadconnected",
			this.__eventHandler
		);
		this.__removeGlobalEventListener(
			"gamepaddisconnected",
			this.__eventHandler
		);
		this.__removeGlobalEventListener("contextmenu", this.__contextHandler);
		window.removeEventListener("blur", this.__windowBlurHandler);
	}

	/**
	 * Handle non-window events that don't have native listeners.
	 */
	__onTick() {
		if (this.gamepadsConnected === 0) return;

		const gamepads =
			this.gamepads &&
			this.gamepads.filter(
				(gamepad) => gamepad && gamepad.mapping === "standard"
			);

		if (
			this.__eventListeners.gamepadbuttonpressed.length > 0 ||
			this.__eventListeners.gamepadbuttondown.length > 0 ||
			this.__eventListeners.gamepadbuttonup.length > 0
		) {
			if (!this.__gamepadButtonHistory) this.__gamepadButtonHistory = {};

			const timeSinceLastButtonEvent =
				performance.now() - (this.__lastGamepadButtonEvent || 0);

			const canTriggerButtonEvent =
				timeSinceLastButtonEvent >
				GamepadInterface.gamepadButtonIntervals;

			for (const gamepad of gamepads) {
				const { buttons, index } = gamepad;

				for (const [button, { pressed }] of Object.entries(buttons)) {
					const alreadyPressed =
						this.__gamepadButtonHistory[index] &&
						this.__gamepadButtonHistory[index][button];

					if (!this.__gamepadButtonHistory[index])
						this.__gamepadButtonHistory[index] = {};

					const returnable = {
						gamepad,
						index,
						button,
						buttons: this.__gamepadButtonHistory[index],
					};

					if (pressed) {
						this.__gamepadButtonHistory[index][button] = true;

						// gamepadbuttondown
						if (canTriggerButtonEvent) {
							this.__triggerEvents("gamepadbuttondown", {
								...returnable,
								type: "gamepadbuttondown",
							}); // Trigger the specific event type that fired.
							this.__triggerEvents("all", {
								...returnable,
								type: "gamepadbuttondown",
							}); // Trigger the "all" event type.
						}
					} else {
						// gamepadbuttonpressed
						if (alreadyPressed) {
							this.__triggerEvents("gamepadbuttonpressed", {
								...returnable,
								type: "gamepadbuttonpressed",
							}); // Trigger the specific event type that fired.
							this.__triggerEvents("all", {
								...returnable,
								type: "gamepadbuttonpressed",
							}); // Trigger the "all" event type.
						}

						this.__gamepadButtonHistory[index][button] = false;

						// gamepadbuttonup
						if (canTriggerButtonEvent) {
							this.__triggerEvents("gamepadbuttonup", {
								...returnable,
								type: "gamepadbuttonup",
							}); // Trigger the specific event type that fired.
							this.__triggerEvents("all", {
								...returnable,
								type: "gamepadbuttonup",
							}); // Trigger the "all" event type.
						}
					}
				}
			}

			if (canTriggerButtonEvent) {
				this.__lastGamepadButtonEvent = performance.now();
			}
		}
	}
}

export default InputManager;
