export default {
	build: {
		target: "es6",

		lib: {
			entry: "index.js",
			name: "ascii.js",
			formats: ["es"],
		},

		rollupOptions: {
			output: {
				entryFileNames: "build.js",
			},
		},
	},
};
