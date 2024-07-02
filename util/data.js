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
