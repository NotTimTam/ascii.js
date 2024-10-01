import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

export default {
	entry: "./index.js", // Your entry point
	output: {
		filename: "build.js", // Output file name
		path: resolve(dirname(fileURLToPath(import.meta.url)), "dist"), // Output directory
		module: true, // Enable ES6 module output
	},
	experiments: {
		outputModule: true, // Enable experimental support for outputting ES6 modules
	},
	resolve: {
		extensions: [".js"], // Resolve JS files
	},
	module: {
		rules: [
			{
				test: /\.js$/, // Transpile JavaScript files
				exclude: /node_modules/,
				use: {
					loader: "babel-loader", // Use Babel for transpilation
					options: {
						presets: ["@babel/preset-env"], // Preset for ES6
					},
				},
			},
		],
	},
	mode: "production",
};
