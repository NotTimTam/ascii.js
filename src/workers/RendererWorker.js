// renderer-worker.js
self.addEventListener(
	"message",
	function (e) {
		// Receive data from main thread
		const data = e.data;

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

// For Other side (not the web worker):
// if (window.Worker) {
// 	const layerManagerWorker = new Worker(
// 		"./src/workers/LayerManagerWorker.js"
// 	);

// 	// Function to handle rendering using web worker
// 	function renderWithWorker(data) {
// 		return new Promise((resolve, reject) => {
// 			layerManagerWorker.postMessage(data);
// 			layerManagerWorker.onmessage = function (e) {
// 				resolve(e.data);
// 			};
// 		});
// 	}

// 	renderWithWorker({ egg: "test" }) // data to pass through
// 		.then((renderedData) => {
// 			// Handle rendered data
// 			// Update UI or perform further actions
// 			// console.log(renderedData);
// 		})
// 		.catch((error) => {
// 			// Handle error if any
// 			console.error(error);
// 		});
// } else {
// }