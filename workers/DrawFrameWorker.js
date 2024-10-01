const DrawFrameWorker = new Worker(new URL("./worker.js", import.meta.url));

// renderer-worker.js
self.addEventListener(
	"message",
	(e) => {
		// Receive data from main thread
		const data = e.data;

		console.log(e.data);

		return "test";

		// Perform rendering process
		const renderedData = render(data);

		// Send back rendered result to main thread
		self.postMessage(renderedData);
	},
	false
);

function render(data) {
	// Your heavy rendering logic here
	// Example: rendering to canvas, DOM updates, etc.
	// Ensure it's designed to work asynchronously and within a web worker context
	// Return the rendered result
	return "egg";
}
