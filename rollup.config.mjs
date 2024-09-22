export default {
	input: "index.js",
	output: [
		{
			file: "dist/bundle.cjs.js",
			format: "cjs",
			exports: "named",
		},
		{
			file: "dist/bundle.esm.js",
			format: "esm",
			exports: "named",
		},
	],
};
