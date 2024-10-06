import { Menu, Pixel, PixelMesh, Scene, TextInput } from "../../index.js";

class Header extends TextInput {
	constructor(cartridge, scene, config) {
		config.backgroundColor = "tomato";
		config.maxWidth = scene.runtime.renderer.width;
		config.maxLength = 64;
		config.onChange = ({ target: { value } }) => {
			this.cartridge.name = value;

			console.log(this.cartridge);
		};

		super(scene, config);

		this.cartridge = cartridge;

		this.value = this.cartridge.name;
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
						return new Header(cartridge, scene, { x: 0, y: 0 });
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
							maintainFocus: false,
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
