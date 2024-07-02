import Runtime from "./engine/Runtime.js";
import Renderer, { Pixel, PixelMesh, Frame } from "./engine/Renderer.js";
import LayerManager, { Layer } from "./engine/LayerManager.js";
import InputManager from "./engine/InputManager.js";
import Camera from "./engine/Camera.js";

import Area from "./core/Area.js";
import Core from "./core/Core.js";
import Entity from "./core/Entity.js";
import GameObject from "./core/GameObject.js";

import Box from "./extensions/Box.js";
import Menu from "./extensions/Menu.js";
import Text from "./extensions/Text.js";

const exports = {
	Runtime,
	__Renderer: Renderer,
	Pixel,
	PixelMesh,
	Frame,
	__LayerManager: LayerManager,
	Layer,
	__InputManager: InputManager,
	__Camera: Camera,
	Area,
	Core,
	Entity,
	GameObject,
	Box,
	Menu,
	Text,
};

export default exports;
