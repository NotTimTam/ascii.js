import { Pixel, PixelMesh } from "../engine/renderer.js";
import Area from "../core/Area.js";

class Room extends Area {
	/**
	 * A decorative, procedurally generated, patch of grass.
	 * @param {Runtime} runtime The main runtime object.
	 * @param {number} x This `Room`'s x-coordinate.
	 * @param {number} y This `Room`'s y-coordinate.
	 * @param {Array<Array<number>>} walls A 2-dimensional array of wall data. 0s are empty spaces, and 1s or custom `Pixel`s are solid walls.
	 */
	constructor(runtime, x, y, walls) {
		super(runtime, x, y, true);

		this.walls = walls;

		this.__generate();
	}

	__generate() {
		const {
			walls,
			runtime: { renderer },
		} = this;
		this.data = [];

		for (let y = 0; y < walls.length; y++) {
			const wallsRow = walls[y];

			this.data[y] = [];

			for (let x = 0; x < wallsRow.length; x++) {
				const column = wallsRow[x];

				if (!column) continue;

				if (column instanceof Pixel) this.data[y][x] = column;
				else {
					const pixel = new Pixel({
						value: "█",
						color: "#573e2d",
						solid: true,
					});

					this.data[y][x] = pixel;
				}
			}
		}
	}

	get renderable() {
		return new PixelMesh(this.data);
	}
}

export default Room;
