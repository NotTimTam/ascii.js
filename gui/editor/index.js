import { GameObject, Menu, Pixel, PixelMesh, Scene } from "../../index.js";

class Header extends GameObject {
	constructor(cartridge, scene, x, y, layer) {
		super(scene, x, y, layer);

		this.cartridge = cartridge;
	}

	get renderable() {
		const data = [];

		data[0] = new Array(this.scene.runtime.renderer.width).fill(
			new Pixel({ value: " ", backgroundColor: "tomato" })
		);

		if (this.cartridge) {
			const name = this.cartridge.name.trim() + ".ajc";

			for (const i in name.split("")) {
				data[0][i] = new Pixel({
					value: name[i],
					backgroundColor: "tomato",
				});
			}
		}

		return new PixelMesh({ data });
	}
}

const editor = (runtime, cartridge) => {
	if (!cartridge) {
		cartridge = {
			name: "new cart",
		};
	}

	const scene = new Scene(runtime, {
		label: "editor",
		layers: [
			{
				label: "menu",
				gameObjectConstructors: [
					(scene) => {
						return new Header(cartridge, scene, 0, 0);
					},
					(scene) => {
						const menu = new Menu(scene, {
							x: 0,
							y: 1,
							alignCenter: true,
							border: false,
							items: [
								new Menu.Button({
									label: "View Code",
									callback: () => {},
								}),
								new Menu.Button({
									label: "Classes",
									callback: () => {},
								}),
								new Menu.Button({
									label: "Edit Sounds",
									callback: () => {},
								}),
								new Menu.Button({
									label: "Preview Cartridge",
									callback: () => {},
								}),
							],
						});

						menu.x =
							scene.runtime.renderer.width / 2 - menu.width / 2;
						menu.y =
							scene.runtime.renderer.height / 2 - menu.height / 2;

						return menu;
					},
				],
			},
		],
	});

	return scene;
};

export default editor;
