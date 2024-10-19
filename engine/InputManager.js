import UIObject from "../core/UIObject.js";
import { displayArray } from "../util/data.js";
import { clamp } from "../util/math.js";
import Scene from "./Scene.js";

class GamepadUIObject {
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
		threshold = GamepadUIObject.deadzoneThreshold
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
	 * Create a simple uIObject for collecting gamepad inputs.
	 *
	 * This uIObject attempts to normalize inputs for these controllers to make it easier to interact with them.
	 * Unsupported controllers can still be interacted with through the uIObjects `raw` property.
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
				axes: GamepadUIObject.applyDeadzone(
					Object.fromEntries(
						axes
							.filter(
								(_, index) =>
									GamepadUIObject.standardAxesMap[index]
							)
							.map((axis, index) => [
								GamepadUIObject.standardAxesMap[index],
								axis,
							])
					)
				),
				buttons: Object.fromEntries(
					buttons
						.filter(
							(axis, index) =>
								GamepadUIObject.standardButtonMap[index]
						)
						.map((axis, index) => [
							GamepadUIObject.standardButtonMap[index],
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
						(axis, index) => GamepadUIObject.standardAxesMap[index]
					)
					.map((axis, index) => [
						GamepadUIObject.standardAxesMap[index],
						axis,
					])
			),
			buttons: Object.fromEntries(
				buttons
					.filter((axis, index) => GamepadUIObject.xbButtonMap[index])
					.map((axis, index) => [
						GamepadUIObject.xbButtonMap[index],
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
						(axis, index) => GamepadUIObject.standardAxesMap[index]
					)
					.map((axis, index) => [
						GamepadUIObject.standardAxesMap[index],
						axis,
					])
			),
			buttons: Object.fromEntries(
				buttons
					.filter((axis, index) => GamepadUIObject.psButtonMap[index])
					.map((axis, index) => [
						GamepadUIObject.psButtonMap[index],
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
						(axis, index) => GamepadUIObject.standardAxesMap[index]
					)
					.map((axis, index) => [
						GamepadUIObject.standardAxesMap[index],
						axis,
					])
			),
			buttons: Object.fromEntries(
				buttons
					.filter((axis, index) => GamepadUIObject.nsButtonMap[index])
					.map((axis, index) => [
						GamepadUIObject.nsButtonMap[index],
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
	static mouseEvents = [
		"click",
		"mousedown",
		"mouseup",
		"mousemove",
		"wheel",
		"mouseenter",
		"mouseleave",
	];

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

		this.__rawFocusIndex = -1;

		// Event listeners for specific `UIObjects`.
		this.__rawUIObjects = [];
		this.__uiObjectEventListeners = {};

		// General event listeners.
		this.__eventListeners = {};

		this.__onCreated();

		this.__windowBlurHandler = this.__windowBlurHandler.bind(this);
	}

	get focusIndex() {
		return this.__rawFocusIndex;
	}

	set focusIndex(n) {
		if (typeof n !== "number" || !Number.isInteger(n))
			throw new TypeError(
				'InputManager "focusIndex" property must be an integer.'
			);

		// Keep the number in valid bounds.
		if (n < -1) n = -1;
		if (n > this.uIObjects.length - 1) n = this.uIObjects.length - 1;

		const previousObject = this.uIObjects[this.focusIndex];
		if (previousObject)
			this.__triggerUIObjectEvents(
				previousObject.id,
				"blur",
				{
					target: previousObject,
				},
				undefined
			);

		this.__rawFocusIndex = n;

		if (n !== -1) {
			const currentObject = this.uIObjects[n];
			this.__triggerUIObjectEvents(
				currentObject.id,
				"focus",
				{
					target: currentObject,
				},
				undefined
			);
		}
	}

	/**
	 * Focus on the next element in the `uIObjects` array.
	 */
	focusNext() {
		let currentIndex = this.uIObjectsByTabIndex.indexOf(this.focusTarget);

		if (currentIndex === this.uIObjectsByTabIndex.length - 1)
			currentIndex = 0; // Wrap.
		else currentIndex++;

		this.focusIndex = this.uIObjects.indexOf(
			this.uIObjectsByTabIndex[currentIndex]
		);
	}

	/**
	 * Focus on the previous element in the `uIObjects` array.
	 */
	focusPrevious() {
		let currentIndex = this.uIObjectsByTabIndex.indexOf(this.focusTarget);

		if (currentIndex === 0)
			currentIndex = this.uIObjectsByTabIndex.length - 1; // Wrap.
		else currentIndex--;

		this.focusIndex = this.uIObjects.indexOf(
			this.uIObjectsByTabIndex[currentIndex]
		);
	}

	/**
	 * Get the current focused item.
	 */
	get focusTarget() {
		return this.uIObjects[this.focusIndex];
	}

	/**
	 * Get all uIObject items.
	 */
	get uIObjects() {
		return this.__rawUIObjects;
	}

	/**
	 * Get all uIObject items, sorted by their `tabIndex` property.
	 */
	get uIObjectsByTabIndex() {
		return this.uIObjects.sort((a, b) => a.tabIndex - b.tabIndex);
	}

	/**
	 * Set uIObject items.
	 */
	set uIObjects(arr) {
		if (!(arr instanceof Array))
			throw new TypeError(
				'InputManager uIObjects property must be an array of "UIObject"s.'
			);

		for (const uIObject of arr)
			if (!uIObject instanceof UIObject)
				throw new TypeError(
					`InputManager uIObjects must be of type "UIObject".`
				);

		this.__rawUIObjects = arr;
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

			return new GamepadUIObject(this, index);
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
		return [
			...Object.keys(this.__eventListeners),
			"focus",
			"blur",
			"gamepadbuttonpressed",
			"gamepadbuttondown",
			"gamepadbuttonup",
			"gamepadaxes",
			"all",
			"mouseenter",
			"mouseleave",
		];
	}

	/**
	 * Get the pointer lock status.
	 */
	get hasPointerLock() {
		const { element } = this.scene.runtime.renderer;
		if (document.pointerLockElement === element) return true;
		else return false;
	}

	__eventHandler = (e) => this.__onEvent(e);
	__contextHandler = (e) => e.preventDefault();

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

	/**
	 * Format a key name to be more readable in development.
	 * @param {string} key The key name to format.
	 * @returns {string} The formatted key name.
	 */
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
		this.keyboard.key = this.__formatKey(key);
		this.keyboard.rawKey = key;
	}

	/**
	 * Calls when a key is released.
	 * @param {Event} event The listener's event.
	 */
	__onKeyUp(event) {
		const { key, keyCode } = event;

		this.keyboard.keys[this.__formatKey(key)] = false;
		this.keyboard.keyCodes[keyCode] = false;
		this.keyboard.keyCode = keyCode;
		this.keyboard.key = this.__formatKey(key);
		this.keyboard.rawKey = key;
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
			this.mouse.floatX = clamp(relX * characterWidth, 0, characterWidth);
			this.mouse.floatY = clamp(
				relY * characterHeight,
				0,
				characterHeight
			);
			// this.mouse.x = clamp(
			// 	Math.floor(relX * characterWidth),
			// 	0,
			// 	characterWidth
			// );
			// this.mouse.y = clamp(
			// 	Math.floor(relY * characterHeight),
			// 	0,
			// 	characterHeight
			// );
			this.mouse.x = Math.floor(this.mouse.floatX);
			this.mouse.y = Math.floor(this.mouse.floatY);

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
	 * Calls when the mouse leaves the canvas.
	 */
	__onMouseLeave() {
		this.mouse.targets = [];
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
	 * @param {Event} browserEvent The browser event object.
	 */
	__triggerEvents(type, data, browserEvent) {
		/**
		 * The below code will duplicate the object so `data`
		 * does not reference the actual data stored in `InputManager`.
		 * The issue with this is that some of the data, particularly the
		 * `target` property should be references, not raw data.
		 */
		// try {
		// 	data = structuredClone(data);
		// } catch (err) {
		// 	console.debug(
		// 		'Method "structuredClone" not present in current context.'
		// 	);
		// 	data = JSON.parse(JSON.stringify(data));
		// }

		// Trigger general events. Including "all" events.
		for (const eventListener of [
			...(this.__eventListeners[type] || []),
			...(this.__eventListeners.all || []),
		])
			eventListener(data);

		// Trigger mouse events for any UIObject, even if the UIObject is not focused.
		if (InputManager.mouseEvents.includes(type)) {
			const targets =
				data.targets &&
				data.targets
					.map((targetId) => this.scene.findGameObjectById(targetId)) // Get all target instances.
					.filter((target) => target instanceof UIObject) // Only UIObject instances are considered targets for UIObject events..
					.sort(
						(a, b) =>
							this.scene.layerManager.layers.indexOf(b.layer) -
							this.scene.layerManager.layers.indexOf(a.layer)
					); // Sort by layer so topmost items recieve the inputs first.

			// If the user clicks the screen.
			if (type === "click") {
				if (targets && targets.length > 0) {
					if (targets[0].focusable) targets[0].focus();
				} else {
					this.focusIndex = -1; // When empty space is clicked, we blur any focused object and exit the event handler.
					return;
				}
			}

			if (targets && targets.length > 0) {
				// Get mouse position on the target.
				const [layerX, layerY] = data.onLayer[targets[0].layerLabel];
				const onUIObject = [
					layerX - targets[0].x,
					layerY - targets[0].y,
				];

				// Trigger target mouse event.
				this.__triggerUIObjectEvents(
					targets[0].id,
					type,
					{
						...data,
						target: targets[0],
						onUIObject,
					},
					browserEvent
				);
			}
		}

		// Trigger object specific events for the current focused UIObject.
		if (this.focusTarget)
			this.__triggerUIObjectEvents(
				this.focusTarget.id,
				type,
				{
					...data,
					target: this.focusTarget,
				},
				browserEvent
			);
	}

	/**
	 * Trigger events for a specific event type, on a specific UIObject.
	 * @param {string} uIObjectId The `UIObject` to trigger events on.
	 * @param {string} type The type of event to trigger for.
	 * @param {*} data The data to send to that event.
	 * @param {Event} browserEvent The browser event object.
	 */
	__triggerUIObjectEvents(uIObjectId, type, data, browserEvent) {
		const objectEvents = this.getUIObjectEventListeners(uIObjectId);

		if (!objectEvents) return;

		const uIObject = this.scene.findGameObjectById(uIObjectId);

		if (!uIObject) return;

		data = {
			...data,
			preventBrowserDefault: browserEvent
				? browserEvent.preventDefault.bind(browserEvent)
				: () => {},
		};

		let defaultPrevented = false;

		const preventEngineDefault = () => {
			defaultPrevented = true;
		};

		if (objectEvents[type])
			objectEvents[type].forEach((callback) => {
				/**
				 * Prevent both the browser default event and the engine default event.
				 */
				const preventDefault = () => {
					data.preventBrowserDefault();
					preventEngineDefault();
				};

				callback({
					...data,
					preventDefault,
					preventEngineDefault,
				});
			});

		// Run default event behavior if it has not been prevented.
		if (!defaultPrevented && UIObject.eventDefaults[type])
			UIObject.eventDefaults[type](uIObject, this, data);
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
				case "mouseleave":
					this.__onMouseLeave();
					break;
				case "wheel":
					this.__onMouseWheel(event);
					break;
			}

			const lastTargets = [...(this.mouse.targets || [])]; // Get the last objects the mouse targeted.

			// Gather mouse targets.
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

			// Run mouseover/mouseleave events for mouse targets.
			[...this.mouse.targets]
				.filter((target) => !lastTargets.includes(target))
				.forEach((uIObjectId) =>
					this.__triggerEvents(
						"mouseenter",
						{ type, ...this.mouse },
						event
					)
				);

			// New mouseleaves
			lastTargets
				.filter((target) => !this.mouse.targets.includes(target))
				.forEach((uIObjectId) =>
					this.__triggerEvents(
						"mouseleave",
						{ type, ...this.mouse, targets: [uIObjectId] },
						event
					)
				);

			this.__triggerEvents(type, { type, ...this.mouse }, event); // Trigger the specific event type that fired.

			// delete this.mouse.target; // Delete target items to clear for next event.
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

			this.__triggerEvents(type, { type, ...this.keyboard }, event); // Trigger the specific event type that fired.

			delete this.keyboard.keyCode;
			delete this.keyboard.key;
			delete this.keyboard.rawKey;
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

			this.__triggerEvents(
				type,
				{ type, gamepads: this.gamepads },
				event
			); // Trigger the specific event type that fired.
		}
	}

	/**
	 * Handles when the user leaves this tab.
	 */
	__windowBlurHandler() {
		this.keyboard.keys = {};
		this.mouse.buttons = {};
		delete this.mouse.deltas;
		delete this.mouse.scroll;
	}

	/**
	 * Add a `UIObject` to the list of `UIObject`s.
	 * @param {UIObject} uIObject The `UIObject` instance to add.
	 */
	addUIObject(uIObject) {
		if (!(uIObject instanceof UIObject))
			throw new TypeError(
				`Only instances of "UIObject" can be added to the InputManager's uIObject list.`
			);

		if (this.uIObjects.includes(uIObject))
			throw new Error("This object is already in the uIObject list.");

		this.uIObjects.push(uIObject);
	}

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

		if (typeof listener !== "function")
			throw new TypeError(
				'Expected a function for parameter "listener".'
			);

		if (!this.__eventListeners[type]) this.__eventListeners[type] = [];

		this.__eventListeners[type].push(listener); // FIX
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

		if (typeof listener !== "function")
			throw new TypeError(
				'Expected a function for parameter "listener".'
			);

		if (!this.__eventListeners[type]) return;

		this.__eventListeners[type] = this.__eventListeners[type].filter(
			(eventListener) => eventListener !== listener
		);
	}

	/**
	 * Get all event listeners for a specific `UIObject`.
	 * @param {string} uIObjectId The ID of the `UIObject` to get the listeners for.
	 * @returns {Array} The event listeners for this specific object.
	 */
	getUIObjectEventListeners(uIObjectId) {
		return this.__uiObjectEventListeners[uIObjectId] || {};
	}

	/**
	 * Add an event listener to a specific `UIObject`.
	 * @param {string} uIObjectId The ID of the `UIObject` to add the event listener to.
	 * @param {string} type The type of event to add.
	 * @param {function} listener The event listener function.
	 */
	addUIObjectEventListener(uIObjectId, type, listener) {
		if (
			typeof uIObjectId !== "string" ||
			!this.scene.findGameObjectById(uIObjectId)
		)
			throw new Error(
				`The provided uIObjectId is not the ID of any UIObject in the scene.`
			);

		if (!this.types.includes(type))
			throw new Error(
				`"${type}" is not a valid event type. Must be one of: ${displayArray(
					this.types
				)}`
			);

		if (typeof listener !== "function")
			throw new TypeError(
				'Expected a function for parameter "listener".'
			);

		if (!this.__uiObjectEventListeners[uIObjectId])
			this.__uiObjectEventListeners[uIObjectId] = {};

		if (!this.__uiObjectEventListeners[uIObjectId][type])
			this.__uiObjectEventListeners[uIObjectId][type] = [];

		this.__uiObjectEventListeners[uIObjectId][type].push(listener);
	}

	/**
	 * Remove an event listener for a specific `UIObject`.
	 * @param {string} uIObjectId The ID of the `UIObject` to remove the event listener from.
	 * @param {string} type The type of event to remove.
	 * @param {function} listener The event listener function that was added to the event listener.
	 */
	removeUIObjectEventListener(uIObjectId, type, listener) {
		if (
			typeof uIObjectId !== "string" ||
			!this.scene.findGameObjectById(uIObjectId)
		)
			throw new Error(
				`The provided uIObjectId is not the ID of any UIObject in the scene.`
			);

		if (!this.types.includes(type))
			throw new Error(
				`"${type}" is not a valid event type. Must be one of: ${displayArray(
					this.types
				)}`
			);

		if (typeof listener !== "function")
			throw new TypeError(
				'Expected a function for parameter "listener".'
			);

		if (
			!this.__uiObjectEventListeners[uIObjectId] ||
			!this.__uiObjectEventListeners[uIObjectId][type]
		)
			return;

		this.__uiObjectEventListeners[uIObjectId][type] =
			this.__uiObjectEventListeners[uIObjectId][type].filter(
				(eventListener) => eventListener !== listener
			);
	}

	// /**
	//  * Add an event listener to the window for the entire `InputManager`.
	//  * @param {string} type The type of event to add.
	//  * @param {function} handler The handler for that event.
	//  */
	// __addWindowEventListener(type, handler) {
	// 	if (!this.__eventListeners[type]) this.__eventListeners[type] = [];
	// 	window.addEventListener(type, handler);
	// }

	// /**
	//  * Remove an event listener from the window.
	//  * @param {string} type The type of event to remove.
	//  * @param {function} handler The handler that was set for that event.
	//  */
	// __removeWindowEventListener(type, handler) {
	// 	delete this.__eventListeners[type];
	// 	window.removeEventListener(type, handler);
	// }

	/**
	 * Add an event listener to the canvas for the entire `InputManager`.
	 * @param {string} type The type of event to add.
	 * @param {function} handler The handler for that event.
	 */
	__addCanvasEventListener(type, handler) {
		if (!this.__eventListeners[type]) this.__eventListeners[type] = [];
		this.scene.runtime.renderer.element.addEventListener(type, handler);
	}

	/**
	 * Remove an event listener from the canvas.
	 * @param {string} type The type of event to remove.
	 * @param {function} handler The handler that was set for that event.
	 */
	__removeCanvasEventListener(type, handler) {
		delete this.__eventListeners[type];
		this.scene.runtime.renderer.element.removeEventListener(type, handler);
	}

	__onCreated() {
		this.__addCanvasEventListener("keydown", this.__eventHandler);
		this.__addCanvasEventListener("keyup", this.__eventHandler);
		this.__addCanvasEventListener("mousemove", this.__eventHandler);
		this.__addCanvasEventListener("mouseenter", this.__eventHandler);
		this.__addCanvasEventListener("mouseleave", this.__eventHandler);
		this.__addCanvasEventListener("mousedown", this.__eventHandler);
		this.__addCanvasEventListener("mouseup", this.__eventHandler);
		this.__addCanvasEventListener("click", this.__eventHandler);
		this.__addCanvasEventListener("wheel", this.__eventHandler);
		this.__addCanvasEventListener("gamepadconnected", this.__eventHandler);
		this.__addCanvasEventListener(
			"gamepaddisconnected",
			this.__eventHandler
		);
		this.__addCanvasEventListener("contextmenu", this.__contextHandler);

		window.addEventListener("blur", this.__windowBlurHandler);
	}

	/**
	 * Unload the `InputManager` instance by removing all system event listeners.
	 */
	__unLoad() {
		this.__removeCanvasEventListener("keydown", this.__eventHandler);
		this.__removeCanvasEventListener("keyup", this.__eventHandler);
		this.__removeCanvasEventListener("mousemove", this.__eventHandler);
		this.__removeCanvasEventListener("mouseenter", this.__eventHandler);
		this.__removeCanvasEventListener("mouseleave", this.__eventHandler);
		this.__removeCanvasEventListener("mousedown", this.__eventHandler);
		this.__removeCanvasEventListener("mouseup", this.__eventHandler);
		this.__removeCanvasEventListener("click", this.__eventHandler);
		this.__removeCanvasEventListener("wheel", this.__eventHandler);
		this.__removeCanvasEventListener(
			"gamepadconnected",
			this.__eventHandler
		);
		this.__removeCanvasEventListener(
			"gamepaddisconnected",
			this.__eventHandler
		);
		this.__removeCanvasEventListener("contextmenu", this.__contextHandler);

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

		if (this.__eventListeners.gamepadaxes.length > 0) {
			for (const gamepad of gamepads) {
				const { axes, index } = gamepad;

				const anyNotNeutral = Object.values(axes)
					.map((value) => value !== 0)
					.find((value) => value);

				if (anyNotNeutral) {
					const returnable = {
						gamepad,
						index,
						axes,
					};

					this.__triggerEvents("gamepadaxes", {
						...returnable,
						type: "gamepadaxes",
					}); // Trigger the specific event type that fired.
					this.__triggerEvents("all", {
						...returnable,
						type: "gamepadaxes",
					}); // Trigger the "all" event type.
				}
			}
		}

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
				GamepadUIObject.gamepadButtonIntervals;

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
