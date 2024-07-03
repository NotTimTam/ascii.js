/**
 * Check if two Axis-Aligned Bounding Boxes (AABBs) overlap.
 * @param {number} x1 The x-coordinate of the top-left corner of box 1.
 * @param {number} y1 The y-coordinate of the top-left corner of box 1.
 * @param {number} width1 The width of box 1.
 * @param {number} height1 The height of box 1.
 * @param {number} x2 The x-coordinate of the top-left corner of box 2.
 * @param {number} y2 The y-coordinate of the top-left corner of box 2.
 * @param {number} width2 The width of box 2.
 * @param {number} height2 The height of box 2.
 * @returns {boolean} True if the AABBs overlap, false otherwise.
 */
export const aabb = (x1, y1, width1, height1, x2, y2, width2, height2) =>
	x1 < x2 + width2 &&
	x1 + width1 > x2 &&
	y1 < y2 + height2 &&
	y1 + height1 > y2;

/**
 * Clamps a number within a specified range.
 * @param {number} number The number to clamp.
 * @param {number} min The minimum value of the range.
 * @param {number} max The maximum value of the range.
 * @returns {number} The clamped number.
 */
export const clamp = (number, min, max) => Math.max(min, Math.min(number, max));

/**
 * Converts an angle from radians to degrees.
 * @param {number} radian The radian value of an angle.
 * @returns {number} Angle, converted to degrees.
 */
export const radianToDegree = (radian) => radian * (180 / Math.PI);

/**
 * Converts an angle from degrees to radians.
 * @param {number} degree The degree value of an angle.
 * @returns {number} Angle, converted to radians.
 */
export const degreeToRadian = (degree) => degree * (Math.PI / 180);

/**
 * Creates a random integer between two values.
 * @param {number} min The minimum value.
 * @param {number} max The maximum value.
 * @returns {number} A random integer between two values.
 */
export const range = (min, max) =>
	Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Returns the factorial of a number.
 * @param {number} n The number to return the factorial of.
 * @returns {number} The calculated factorial of n.
 */
export const fact = (n) => {
	if (n === 0 || n === 1) return 1;

	for (let i = n - 1; i >= 1; i--) {
		n *= i;
	}

	return n;
};

/**
 * Returns velocity per coordinate in two dimensions.
 * @param {number} angle The angle (in degrees) of rotation.
 * @param {number} velocity The velocity (in pixels) of motion at that angle.
 * @returns {Array<Number>} Returns the x and y coordinate result in an array. `[x, y]`
 */
export const vectorToCartesian = (angle, velocity) => [
	velocity * Math.cos(degreeToRadian(angle)),
	velocity * Math.sin(degreeToRadian(angle)),
];

/**
 * Convert cartesian coordinates to a vector. Based on distance from `[0, 0]`.
 * @param {number} x The x-coordinate to calculate with.
 * @param {number} y The y-coordinate to calculate with.
 * @returns {Array<Number>} Returns the vector calculation in an array. `[angle, velocity]`
 */
export const cartesianToVector = (x, y) => [
	radianToDegree(Math.atan2(y, x)),
	Math.sqrt(x ** 2 + y ** 2),
];

/**
 * Calculates the angle from one position to another.
 * @param {number} x1 The x position to send the angle from.
 * @param {number} y1 The y position to send the angle from.
 * @param {number} x2 The x position to send the angle to.
 * @param {number} y2 The y position to send the angle to.
 * @returns {number} The angle between the two points.
 */
export const angleBetweenPoints = (x1, y1, x2, y2) => {
	return radianToDegree(Math.atan2(y2 - y1, x2 - x1));
};

/**
 * Calculates the distance between two positions.
 * @param {number} x1 The x position to send the angle from.
 * @param {number} y1 The y position to send the angle from.
 * @param {number} x2 The x position to send the angle to.
 * @param {number} y2 The y position to send the angle to.
 * @returns {number} The distance between the two points.
 */
export const distanceBetweenPoints = (x1, y1, x2, y2) =>
	Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
