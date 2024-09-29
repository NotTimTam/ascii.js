/**
 * Prettify an array when displaying it in a string.
 * @param {Array<*>} array The array to display.
 * @returns {string} Converts the array to a pretty string display.
 */
export const displayArray = (array) =>
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

/**
 * Check if a value is a plain JavaScript object. (A non-array, key-value structure)
 * @param {*} x The value to check.
 * @returns {boolean} Whether or not the value is a plain object.
 */
export const isPlainObject = (x) =>
	x && typeof x === "object" && !(x instanceof Array);
