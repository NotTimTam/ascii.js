import UIObject from "../core/UIObject.js";
import Pixel, { PixelMesh } from "../core/Pixel.js";
import Scene from "../engine/Scene.js";
import Style from "../core/Style.js";

class TextInput extends UIObject {
  /**
   * Configuration data for the `TextInput`'s `configuration.style` property.
   * @typedef {Object} TextInputStyleConfig
   * @property {Object} focused Styles to use when the `TextInput` is focused.
   * @property {?string|number} focused.color The color of the `TextInput`'s text when it is in focus.
   * @property {?string|number} focused.fontWeight The font weight of the `TextInput`'s text when it is in focus.
   * @property {?string|number} focused.backgroundColor The background color of the `TextInput` when it is in focus.
   * @property {Object} blurred Styles to use when the `TextInput` is out of focus.
   * @property {?string|number} blurred.color The color of the `TextInput`'s text when it is blurred.
   * @property {?string|number} blurred.fontWeight The font weight of the `TextInput`'s text when it is blurred.
   * @property {?string|number} blurred.backgroundColor The background color of the `TextInput` when it is blurred.
   * @property {?string|number} placeholderColor The color of the `TextInput`'s placeholder text.
   * @property {?string|number} placeholderFontWeight The font weight of the `TextInput`'s placeholder text.
   * @property {?string|number} caretColor The color of the text currently highlighted by the `TextInput`'s caret.
   * @property {?string|number} caretBackgroundColor The color of the `TextInput`'s caret box.
   */
  static style = {
    placeholderColor: new Style.Parameter("color", "grey"),
    placeholderFontWeight: new Style.Parameter("fontWeight", 200),
    caretColor: new Style.Parameter("color", "black"),
    caretBackgroundColor: new Style.Parameter("backgroundColor", "white"),

    focused: new Style.State({
      color: new Style.Parameter("color", "white"),
      fontWeight: new Style.Parameter("fontWeight", 600),
      backgroundColor: new Style.Parameter("backgroundColor", null),
    }),
    blurred: new Style.State({
      color: new Style.Parameter("color", "grey"),
      fontWeight: new Style.Parameter("fontWeight", 400),
      backgroundColor: new Style.Parameter("backgroundColor", null),
    }),
  };

  /**
   * Configuration data for the `TextInput` class.
   * @typedef {Object} TextInputConfig
   * @property {number} x This `TextInput` object's x-coordinate.
   * @property {number} y This `TextInput` object's y-coordinate.
   * @property {number} zIndex A numeric value determining the rendering heirarchy position this `TextInput` should fall in.
   *
   * `TextInput`s with higher z-indeces will be drawn on top of those with lower z-indeces. Default `0`.
   * @property {?string} layer The (optional) label of the layer to initialize the `TextInput` on.
   * @property {number} tabIndex A numeric value determining the index in the focus array this `TextInput` should fall at. The higher an instance's `tabIndex`, the further down the list it will be.
   *
   * A `tabIndex` of `-1` will mark the `TextInput` instance as "unfocusable", meaning focus-based events, such as `keydown` events specific to this `TextInput`, will not be triggered. Default `0`.
   * @property {boolean} autoFocus Whether to automatically focus on this `TextInput` after its instantiation. Default `false`.
   * @property {boolean} maintainFocus Force the `InputManager` to keep this `TextInput` in focus, even if attempts are made to focus on other `TextInput`s. Default `false`.
   * @property {number} maxWidth The maximum width of the `TextInput`. Defaults to the viewport width.
   * @property {string} value The text to display. (use `"\n"` for newlines)
   * @property {function} onChange Callback that runs when the input's value changes.
   * @property {function} onKeyDown Callback that runs when the input recieves a keypress.
   * @property {?number} maxLength An optional maximum input length.
   * @property {?string} placeholder An optional placeholder text value to display when the `value` property is "".
   * @property {?TextInputStyleConfig} style Optional style config object.
   */

  /**
   * A text input that can be rendered on screen.
   * @param {Scene} scene The scene this Object is a part of.
   * @param {TextInputConfig} config The `TextInput`'s config object.
   */
  constructor(scene, config) {
    config.wrap = false;
    if (!config.maxWidth) config.maxWidth = scene.runtime.renderer.width;

    super(scene, config);

    const {
      onChange,
      onKeyDown,
      maxLength,
      wrap,
      maxWidth,
      value = "",
      placeholder,
      style = {},
    } = config;

    this.style = new Style(TextInput.style).hydrate(style);

    if (placeholder) {
      if (typeof placeholder !== "string")
        return new TypeError(
          "Expected a string for TextInput config.placeholder value."
        );
      this.placeholder = placeholder;
    }

    if (onChange) {
      if (typeof onChange !== "function")
        throw new TypeError(
          "Expected a function for TextInput config.onChange value."
        );

      this.onChange = onChange;
    }

    if (onKeyDown) {
      if (typeof onKeyDown !== "function")
        throw new TypeError(
          "Expected a function for TextInput config.onKeyDown value."
        );

      this.onKeyDown = onKeyDown;
    }

    if (maxLength) {
      if (
        typeof maxLength !== "number" ||
        !Number.isInteger(maxLength) ||
        maxLength < 0
      )
        throw new TypeError(
          "Invalid config.maxLength value provided to TextInput. Expected an integer greater than or equal to 0."
        );

      this.maxLength = maxLength;
    }

    if (maxWidth) {
      if (
        typeof maxWidth !== "number" ||
        !Number.isInteger(maxWidth) ||
        maxWidth < 1
      )
        throw new TypeError(
          "Invalid config.maxWidth value provided to Text. Expected an integer greater than 0."
        );
      this.maxWidth = maxWidth;
    }

    this.scroll = 0;

    this.value = value;

    this.caret = this.value ? this.value.length : 0;

    this.wrap = wrap;

    this.addEventListener("click", this.__onClick);
    this.addEventListener("keydown", this.__onKeyDown);
    this.addEventListener("focus", () => {
      this.caret = this.value.length;
    });
  }

  /**
   * Get the value of the `TextInput` object.
   */
  get value() {
    return String(this.__rawValue);
  }

  /**
   * Set the value of the `TextInput` object.
   */
  set value(value) {
    if (typeof value !== "string")
      throw new Error(`TextInput "value" property must be of type "string".`);

    this.__rawValue = value;
  }

  /**
   * Renderable setter override.
   */
  set renderable(_) {
    return;
  }

  /**
   * Listens to click events.
   */
  __onClick() {
    this.caret = this.value.length;
    this.__updateScrollPosition();
  }

  /**
   * Listen to other input events.
   */
  __onKeyDown(event) {
    event.preventBrowserDefault();

    const { caret } = this;

    const { key, rawKey } = event;

    const startValue = this.value;

    // Only allow ASCII range typeable keys.
    if (key === "backspace") {
      this.value = this.value.slice(0, caret - 1) + this.value.slice(caret);

      if (this.caret !== this.value.length) this.caret--;
    } else if (key === "delete") {
      this.value = this.value.slice(0, caret) + this.value.slice(caret + 1);
    } else if (key === "escape") this.focused = false;
    else if (key === "left") this.caret--;
    else if (key === "right") this.caret++;
    else if (key === "end" || key === "down") this.caret = this.value.length;
    else if (key === "home" || key === "up") this.caret = 0;
    else if (
      /^[\x20-\x7E]$/.test(rawKey) &&
      (typeof this.maxLength !== "number" || this.value.length < this.maxLength)
    ) {
      this.value =
        this.value.slice(0, this.caret) + rawKey + this.value.slice(this.caret);
      this.caret++;
    }

    this.__updateScrollPosition();

    if (startValue !== this.value && this.onChange)
      this.onChange({ target: this, ...event });
    this.onKeyDown && this.onKeyDown({ target: this, ...event });
  }

  /**
   * Update the position of this `TextInput`'s `scroll` property to properly scroll to the caret in the input.
   */
  __updateScrollPosition() {
    while (this.caret < this.scroll) this.scroll--;
    while (this.caret > this.scroll + this.maxWidth - 2) this.scroll++;
  }

  get caret() {
    if (this.__rawCaret < 0) this.__rawCaret = 0;
    if (this.__rawCaret > this.value.length)
      this.__rawCaret = this.value.length;

    return this.__rawCaret;
  }

  set caret(n) {
    if (typeof n !== "number" || !Number.isInteger(n))
      throw new TypeError("TextInput caret value should be an integer.");

    if (n < 0) n = 0;
    if (n > this.value.length) n = this.value.length;

    this.__rawCaret = n;
  }

  get renderable() {
    const {
      value,
      maxWidth,
      caret,
      focused,
      placeholder,
      style,
      style: {
        placeholderColor,
        placeholderFontWeight,
        caretColor,
        caretBackgroundColor,
      },
    } = this;

    const { color, fontWeight, backgroundColor } =
      style[focused ? "focused" : "blurred"];

    const data = [];

    const maxScroll = value.length - maxWidth + 1;
    if (this.scroll > maxScroll) this.scroll = maxScroll;
    if (this.scroll < 0) this.scroll = 0;

    const { scroll } = this;

    const showPlaceholder = value === "" && placeholder;

    const display = (showPlaceholder ? placeholder : value)
      .substring(scroll, scroll + maxWidth)
      .padEnd(maxWidth, " ")
      .split("");

    for (let i = 0; i < display.length; i++) {
      const char = display[i];
      const active = i + scroll === caret && focused;
      data.push(
        new Pixel({
          value: char,
          color: showPlaceholder
            ? placeholderColor
            : active
            ? caretColor
            : color,
          backgroundColor: active ? caretBackgroundColor : backgroundColor,
          fontWeight: showPlaceholder ? placeholderFontWeight : fontWeight,
        })
      );
    }

    // Push the remaining characters in the current line

    return new PixelMesh({ data: [data] });
  }
}

export default TextInput;
