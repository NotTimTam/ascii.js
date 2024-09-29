import GameObject from "../core/GameObject.js";
import { displayArray } from "../util/data.js";
import { clamp } from "../util/math.js";
import Scene from "./Scene.js";

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
		this.mouse = { buttons: {} };

		this.__eventListeners = {
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
	 * @param {Event} event The listener's event.
	 */
	__onClick(event) {
		const { button, type } = event;

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

		const { x, y } = this.mouse;

		this.mouse.targets = this.scene.layerManager.getAtPosition(x, y);

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
				case "click":
					this.__onClick(event);
					break;
			}

			this.__triggerEvents(type, { type, ...this.mouse }); // Trigger the specific event type that fired.
			this.__triggerEvents("all", { type, ...this.mouse }); // Trigger the "all" event type.

			if (type === "click" && this.mouse.target) delete this.mouse.target; // Delete target items to clear for next event.
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
		}
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
		this.__addGlobalEventListener("contextmenu", this.__contextHandler);
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
		this.__removeGlobalEventListener("contextmenu", this.__contextHandler);
	}
}

export default InputManager;
