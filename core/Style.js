import { displayArray, isPlainObject } from "../util/data.js";

/**
 * A single parameter of a `Style` instance.
 */
class Parameter {
  /**
   * Creates a new `Style.Parameter` instance.
   * @param {"color"|"backgroundColor"|"fontWeight"|"char"} type The `Style.types`-sourced style parameter type.
   * @param {string|number|null} fallback A fallback value to set if no value is configured.
   * @param {boolean} optional Whether or not this parameter is optional. Default `false`.
   */
  constructor(type, fallback, optional = false) {
    if (!Style.types.includes(type))
      throw new SyntaxError(
        `Invalid type provided to Style.Parameter. Expected one of: ${displayArray(
          Style.types
        )}`
      );

    Style.validators[type](fallback);

    this.__rawType = type;
    this.__rawFallback = fallback;
    this.__rawOptional = Boolean(optional);
  }

  /**
   * Get this `Parameter`'s type value.
   */
  get type() {
    return this.__rawType;
  }

  /**
   * Get this `Parameter`'s fallback value.
   */
  get fallback() {
    return this.__rawFallback;
  }

  /**
   * Get this `Parameter`'s option value.
   */
  get option() {
    return this.__rawOptional;
  }
}

/**
 * A `Style` state, such as `"focused"`.
 */
class State {
  /**
   * Creates a new `Style.State` instance.
   * @param {Object<string, Style.Parameter>} config An object where the key is the name of the field, and the value is an instance of `Style.Parameter`.
   */
  constructor(config) {
    this.config = config;
  }

  /**
   * Get this `Style` instance's `config` object.
   */
  get config() {
    return this.__rawConfig;
  }

  /**
   * Set this `Style` instance's `config` object.
   */
  set config(obj) {
    if (!obj) throw new Error('No "config" object provided to State instance.');

    // Validate config.
    for (const [key, value] of Object.entries(obj)) {
      if (key === "config")
        throw new SyntaxError('"config" is a reserved State field name.');
      if (!(value instanceof Style.Parameter))
        throw new TypeError(
          `Each value in a State instance's "config" object must be an instance of "Style.Parameter".`
        );
    }

    // Erase old config.
    Object.keys({ ...this.config })
      .filter((key) => !obj.hasOwnProperty(key))
      .forEach((key) => delete this[key]);

    // Apply config.
    for (const [key, value] of Object.entries(obj)) {
      Object.defineProperty(this, key, {
        get: function () {
          return this[`__raw${key}`] ? this[`__raw${key}`] : value.fallback;
        },
        set: function (v) {
          try {
            Style.validators[value.type](v);
          } catch (err) {
            throw new Error(`Failed to set "${key}": ${err.message}`);
          }

          this[`__raw${key}`] = v;
        },
      });
    }

    this.__rawConfig = obj;
  }

  /**
   * Update this `State` instance's style values from an object.
   * @param {Object<string, string|number>} obj The style object to set.
   */
  hydrate(obj = {}) {
    if (!obj)
      throw new TypeError('No "obj" provided to "State.hydrate" method.');

    for (const [key, value] of Object.entries(obj)) {
      if (!this.config.hasOwnProperty(key))
        throw new Error(
          `This Style.State configuration has no property named "${key}".`
        );

      this[key] = value;
    }

    return this;
  }
}

/**
 * Manages styling attributes for `Pixel`s.
 */
class Style {
  static Parameter = Parameter;
  static State = State;

  /**
   * Methods for validating style types.
   */
  static validators = {
    color: (v) => {
      if (!v || typeof v !== "string")
        throw new TypeError("Expected a string for color value.");
    },
    backgroundColor: (v) => {
      if (!v) return; // Characters are allowed to have no background color.

      if (typeof v !== "string")
        throw new TypeError("Expected a string for backgroundColor value.");
    },
    fontWeight: (v) => {
      if (!v || (typeof v !== "string" && typeof v !== "number"))
        throw new TypeError("Expected a string or number for color value.");
    },
    char: (v) => {
      if (!v || typeof v !== "string" || v.length !== 1)
        throw new SyntaxError("Expected a 1-character string for char value.");
    },
  };

  /**
   * Names of each allowed style type.
   */
  static types = Object.keys(Style.validators);

  /**
   * Creates a new `Style` instance.
   * @param {Object<string, Style.State>} config An object where the key is the name of the state, and the value is an instance of `Style.State`.
   */
  constructor(config) {
    this.config = config;

    console.log(this);
  }

  /**
   * Get this `Style` instance's `config` object.
   */
  get config() {
    return this.__rawConfig;
  }

  /**
   * Set this `Style` instance's `config` object.
   */
  set config(obj) {
    if (!obj) throw new Error('No "config" object provided to Style instance.');

    // Validate config.
    for (const [key, value] of Object.entries(obj)) {
      if (key === "config")
        throw new SyntaxError('"config" is a reserved Style field name.');
      if (
        !(value instanceof Style.Parameter) &&
        !(value instanceof Style.State)
      )
        throw new TypeError(
          `Each value in a Style instance's "config" object must be an instance of "Style.State" or "Style.Parameter".`
        );
    }

    // Erase old config.
    Object.keys({ ...this.config })
      .filter((key) => !obj.hasOwnProperty(key))
      .forEach((key) => delete this[key]);

    // Apply config.
    for (const [key, value] of Object.entries(obj)) {
      Object.defineProperty(this, key, {
        get: function () {
          if (value instanceof Style.Parameter)
            return this[`__raw${key}`] ? this[`__raw${key}`] : value.fallback;
          else if (value instanceof Style.State)
            return this[`__raw${key}`] ? this[`__raw${key}`] : value;
        },
        set: function (v) {
          try {
            Style.validators[value.type](v);
          } catch (err) {
            throw new Error(`Failed to set "${key}": ${err.message}`);
          }

          this[`__raw${key}`] = v;
        },
      });
    }

    this.__rawConfig = obj;
  }

  /**
   * Update this `Style` instance's style values from an object.
   * @param {Object<string, string|number>} obj The style object to set.
   */
  hydrate(obj = {}) {
    if (!obj)
      throw new TypeError('No "obj" provided to "Style.hydrate" method.');

    for (const [key, value] of Object.entries(obj)) {
      if (!this.config.hasOwnProperty(key))
        throw new Error(
          `This Style configuration has no property named "${key}".`
        );

      // If value is a state configuration.
      if (isPlainObject(value)) this[key].hydrate(value);
      else this[key] = value; // If value is a parameter definition.
    }

    return this;
  }
}

export default Style;
