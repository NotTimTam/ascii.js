import GameObject from "../core/GameObject.js";
import { clamp } from "../util/math.js";
import Scene from "./Scene.js";

class InputManager {
	/**
	 * Handles user input.
	 * @param {Scene} scene The current scene.
	 */
	constructor(scene) {
		this.scene = scene;
		this.runtime = this.scene.runtime;

		this.keyboard = { keys: {}, keyCodes: {} };
		this.mouse = { buttons: {} };

		this.__eventListeners = [];
		this.__clickListeners = [];

		this.__onCreated();
	}
	__eventHandler = (e) => this.__onEvent(e);
	__contextHandler = (e) => e.preventDefault();

	/**
	 * Get the pointer lock status.
	 */
	get hasPointerLock() {
		const { element } = this.scene.renderer;
		if (document.pointerLockElement === element) return true;
		else return false;
	}

	/**
	 * Initiate a pointer lock request. Pointer lock cannot be achieved unless the user clicks the screen after this method is called.
	 */
	async requestPointerLock() {
		const { element } = this.scene.renderer;

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

		this.mouse.target = this.scene.renderer.layerManager.getAtPosition(
			x,
			y
		);

		const targetIds = this.mouse.target.map(
			({ gameObject }) => gameObject.id
		);

		for (const [id, eventListener] of this.__clickListeners)
			if (targetIds.includes(id)) eventListener({ type, ...this.mouse });
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

				renderer: {
					width: characterWidth,
					height: characterHeight,
					element,
					layerManager: { layers },
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
				case "click":
					this.__onClick(event);
					break;
			}

			for (const eventListener of this.__eventListeners)
				eventListener({ type, ...this.mouse });

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
	 * Add an event listener to check when an element is clicked.
	 * @param {GameObject} gameObject The game object that, when clicked, triggers the event.
	 * @param {function} listener The event listener function.
	 */
	addOnClick(gameObject, listener) {
		this.__clickListeners.push([gameObject.id, listener]);
	}

	/**
	 * Remove an event listener from the input manager.
	 * @param {function} listener The event listener function that was added to the event listener.
	 */
	removeEventListener(listener) {
		this.__eventListeners = this.__eventListeners.filter(
			(eventListener) => eventListener !== listener
		);
	}

	/**
	 * Remove a click event listener.
	 * @param {GameObject} gameObject The game object that the event was created for.
	 * @param {function} listener The event listener function that was added to the event listener.
	 */
	removeOnClick(gameObject, listener) {
		this.__clickListeners = this.__clickListeners.filter(
			(arr) => arr[0] !== gameObject.id && arr[1] !== listener
		);
	}

	__onCreated() {
		window.addEventListener("keydown", this.__eventHandler);
		window.addEventListener("keyup", this.__eventHandler);
		window.addEventListener("mousemove", this.__eventHandler);
		window.addEventListener("mousedown", this.__eventHandler);
		window.addEventListener("mouseup", this.__eventHandler);
		window.addEventListener("click", this.__eventHandler);
		window.addEventListener("contextmenu", this.__contextHandler);
	}

	/**
	 * Unload the `InputManager` instance by removing all system event listeners.
	 */
	__unLoad() {
		window.removeEventListener("keydown", this.__eventHandler);
		window.removeEventListener("keyup", this.__eventHandler);
		window.removeEventListener("mousemove", this.__eventHandler);
		window.removeEventListener("mousedown", this.__eventHandler);
		window.removeEventListener("mouseup", this.__eventHandler);
		window.removeEventListener("click", this.__eventHandler);
		window.removeEventListener("contextmenu", this.__contextHandler);
	}
}

export default InputManager;
