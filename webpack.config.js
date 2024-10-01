import path from "path";

export default {
	entry: "./index.js", // Your entry point
	output: {
		filename: "build.js", // Output file name
		path: path.join(process.cwd(), "dist"), // Output directory
		module: true, // Enable ES6 module output
		chunkFormat: "module",
	},
	experiments: {
		outputModule: true, // Enable experimental support for outputting ES6 modules
	},
	optimization: {
		minimize: false,
	},
	resolve: {
		extensions: [".js"], // Resolve JS files
	},
	target: "es6",
	mode: "production",
};
