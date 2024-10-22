import { displayArray } from "../util/data.js";

class StyleParameter {
	/**
	 * A single parameter of a `Style` instance.
	 * @param {string} type The `Style.types`-sourced style parameter type.
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

class Style {
	static Parameter = StyleParameter;

	static validators = {
		color: (v) => {
			if (!v || typeof v !== "string")
				throw new TypeError("Expected a string for color value.");
		},
		fontWeight: (v) => {
			if (!v || (typeof v !== "string" && typeof v !== "number"))
				throw new TypeError(
					"Expected a string or number for color value."
				);
		},
	};

	static types = Object.keys(Style.validators);

	/**
	 * A `Style` object
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
		if (!obj)
			throw new Error('No "config" object provided to Style instance.');

		// Validate config.
		for (const [key, value] of Object.entries(obj)) {
			if (key === "config")
				throw new SyntaxError(
					'"config" is a reserved Style field name.'
				);
			if (!(value instanceof Style.Parameter))
				throw new TypeError(
					`Each value in a Style instance's "config" object must be an instance of "Style.Parameter".`
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
					return this[`__raw${key}`]
						? this[`__raw${key}`]
						: value.fallback;
				},
				set: function (v) {
					try {
						Style.validators[value.type](v);
					} catch (err) {
						throw new Error(
							`Failed to set "${key}": ${err.message}`
						);
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
			if (!this.config.hasOwnProperty(key)) continue;

			this[key] = value;
		}

		return this;
	}
}

export default Style;
