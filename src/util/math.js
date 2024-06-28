/**
 * Check if two Axis-Aligned Bounding Boxes (AABBs) overlap.
 * @param {number} x1 - The x-coordinate of the top-left corner of AABB1.
 * @param {number} y1 - The y-coordinate of the top-left corner of AABB1.
 * @param {number} width1 - The width of AABB1.
 * @param {number} height1 - The height of AABB1.
 * @param {number} x2 - The x-coordinate of the top-left corner of AABB2.
 * @param {number} y2 - The y-coordinate of the top-left corner of AABB2.
 * @param {number} width2 - The width of AABB2.
 * @param {number} height2 - The height of AABB2.
 * @returns {boolean} True if the AABBs overlap, false otherwise.
 */
export const aabb = (x1, y1, width1, height1, x2, y2, width2, height2) => {
	// Calculate the minimum and maximum coordinates for AABB1
	const minX1 = x1;
	const minY1 = y1;
	const maxX1 = x1 + width1;
	const maxY1 = y1 + height1;

	// Calculate the minimum and maximum coordinates for AABB2
	const minX2 = x2;
	const minY2 = y2;
	const maxX2 = x2 + width2;
	const maxY2 = y2 + height2;

	// Check overlap along X-axis
	if (maxX1 < minX2 || minX1 > maxX2) {
		return false; // No overlap along the X-axis
	}

	// Check overlap along Y-axis
	if (maxY1 < minY2 || minY1 > maxY2) {
		return false; // No overlap along the Y-axis
	}

	// If no separating axis found, AABBs overlap
	return true;
};
