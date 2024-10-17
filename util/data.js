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

/**
 * Wrap text if it goes over a certain width, using `"\n"` characters.
 * @param {string} string The string to wrap.
 * @param {number} maxWidth The maximum width for the string.
 * @param {boolean} breakWord Whether to break words that exceed the maxWidth.
 * @returns {string} The newly wrapped string.
 */
export const wrapString = (string, maxWidth, breakWord = false) => {
	// Split the string into words.
	const words = string.split(" ");
	let lines = [];
	let currentLine = "";

	for (const word of words) {
		// Check if adding the word would exceed the max width.
		if ((currentLine + word).length > maxWidth) {
			// If it exceeds and breakWord is true, break the word.
			if (breakWord && word.length > maxWidth) {
				// Break the word into chunks of maxWidth length.
				let chunks = Math.ceil(word.length / maxWidth);
				for (let i = 0; i < chunks; i++) {
					const chunk = word.slice(i * maxWidth, (i + 1) * maxWidth);
					if (currentLine.trim()) {
						lines.push(currentLine.trim());
					}
					currentLine = chunk + " ";
				}
			} else {
				// If it exceeds, push the current line to lines and start a new line.
				if (currentLine) {
					lines.push(currentLine.trim());
				}
				currentLine = word + " "; // Start a new line with the current word.
			}
		} else {
			// If it doesn't exceed, add the word to the current line.
			currentLine += word + " ";
		}
	}

	// Push the last line if it exists.
	if (currentLine) {
		lines.push(currentLine.trim());
	}

	// Join the lines with \n.
	return lines.join("\n");
};
