/**
 * Check if two Axis-Aligned Bounding Boxes (AABBs) overlap.
 * @param {number} x1 - The x-coordinate of the top-left corner of box 1.
 * @param {number} y1 - The y-coordinate of the top-left corner of box 1.
 * @param {number} width1 - The width of box 1.
 * @param {number} height1 - The height of box 1.
 * @param {number} x2 - The x-coordinate of the top-left corner of box 2.
 * @param {number} y2 - The y-coordinate of the top-left corner of box 2.
 * @param {number} width2 - The width of box 2.
 * @param {number} height2 - The height of box 2.
 * @returns {boolean} True if the AABBs overlap, false otherwise.
 */
export const aabb = (x1, y1, width1, height1, x2, y2, width2, height2) =>
	x1 < x2 + width2 &&
	x1 + width1 > x2 &&
	y1 < y2 + height2 &&
	y1 + height1 > y2;

/**
 * Clamps a number within a specified range.
 * @param {number} number - The number to clamp.
 * @param {number} min - The minimum value of the range.
 * @param {number} max - The maximum value of the range.
 * @returns {number} The clamped number.
 */
export const clamp = (number, min, max) => Math.max(min, Math.min(number, max));
