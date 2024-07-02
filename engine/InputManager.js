import { clamp } from "../util/math.js";

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

	__formatKey(key) {
		if (key === " ") return "space";
		else if (key === "ArrowUp") return "up";
		else if (key === "ArrowDown") return "down";
		else if (key === "ArrowLeft") return "left";
		else if (key === "ArrowRight") return "right";

		return key.toLowerCase();
	}

	__onKeyDown(event) {
		const { key, keyCode } = event;

		this.keyboard.keys[this.__formatKey(key)] = true;
		this.keyboard.keyCodes[keyCode] = true;
	}
	__onKeyUp(event) {
		const { key, keyCode } = event;

		this.keyboard.keys[this.__formatKey(key)] = false;
		this.keyboard.keyCodes[keyCode] = false;
	}

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
	__onMouseMove(event) {
		const { clientX, clientY, movementX, movementY } = event;

		const {
			runtime: {
				renderer: {
					width: characterWidth,
					height: characterHeight,
					element,
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
	}

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

export default InputManager;
