import React, { useRef, useEffect } from "react";

const VideoVectorScope = () => {
	const videoRef = useRef(null);

	useEffect(() => {
		const videoElement = videoRef.current;

		const captureFrame = () => {
			const canvas = document.getElementById("vectorScopeCanvas");
			const context = canvas.getContext("2d");

			// Draw the current video frame onto the canvas
			context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

			// Get the pixel data of the current frame
			const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
			const pixels = imageData.data;

			// Calculate the average color for each pixel
			const vectors = [];
			for (let i = 0; i < pixels.length; i += 4) {
				const red = pixels[i];
				const green = pixels[i + 1];
				const blue = pixels[i + 2];

				// Calculate the average value (brightness) of the pixel
				const brightness = (red + green + blue) / 3;

				// Convert the pixel color to polar coordinates (radius, angle)
				const radius = brightness;
				const angle = Math.atan2(green - blue, red - brightness);

				// Add the vector to the vectors array
				vectors.push({ radius, angle });
			}

			// Render the vectorscope
			//-------------------------------------------------------------------------------------------------
			renderVectorScope(vectors);

			// Render the RGB histogram
			//-------------------------------------------------------------------------------------------------
			renderRGBHistogram(pixels);

			// Perform frame processing and vector scope calculations here

			// Request the next frame
			requestAnimationFrame(captureFrame);
		};

		const renderRGBHistogram = (pixels) => {
			const canvas = document.getElementById("histogramCanvas");
			const context = canvas.getContext("2d");
			const histogramHeight = canvas.height;

			// Clear the canvas
			context.clearRect(0, 0, canvas.width, canvas.height);

			// Calculate color distribution
			const distribution = {
				red: new Array(256).fill(0),
				green: new Array(256).fill(0),
				blue: new Array(256).fill(0),
			};

			for (let i = 0; i < pixels.length; i += 4) {
				const red = pixels[i];
				const green = pixels[i + 1];
				const blue = pixels[i + 2];

				// Increment the respective channel count in the distribution
				distribution.red[red]++;
				distribution.green[green]++;
				distribution.blue[blue]++;
			}

			// Find the maximum count in the distribution for scaling
			const maxCount = Math.max(
				Math.max(...distribution.red),
				Math.max(...distribution.green),
				Math.max(...distribution.blue)
			);

			// Calculate the scaling factor for histogram height
			const scalingFactor = histogramHeight / maxCount;

			// Plot the histogram
			for (let i = 0; i < 256; i = i + 1) {
				const x = i;
				const redHeight = distribution.red[i] * scalingFactor;
				const greenHeight = distribution.green[i] * scalingFactor;
				const blueHeight = distribution.blue[i] * scalingFactor;

				// Draw the vertical lines for each channel
				context.strokeStyle = "red";
				context.beginPath();
				context.moveTo(x * 3, histogramHeight);
				context.lineTo(x * 3, histogramHeight - redHeight);
				context.stroke();

				context.strokeStyle = "green";
				context.beginPath();
				context.moveTo(x * 3, histogramHeight);
				context.lineTo(x * 3, histogramHeight - greenHeight);
				context.stroke();

				context.strokeStyle = "blue";
				context.beginPath();
				context.moveTo(x * 3, histogramHeight);
				context.lineTo(x * 3, histogramHeight - blueHeight);
				context.stroke();
			}
		};

		const renderVectorScope = (vectors) => {
			const canvas = document.getElementById("vectorScopeCanvas");
			const context = canvas.getContext("2d");

			// Clear the canvas
			context.clearRect(0, 0, canvas.width, canvas.height);

			// Set the center of the vector scope
			const centerX = canvas.width / 2;
			const centerY = canvas.height / 2;

			// Draw a line for each vector
			vectors.forEach((vector) => {
				const { radius, angle } = vector;

				// Convert the polar coordinates back to Cartesian coordinates
				const x = centerX + radius * Math.cos(angle);
				const y = centerY + radius * Math.sin(angle);

				// Set the line color based on the vector angle
				context.strokeStyle = `hsl(${
					(angle * 180) / Math.PI + 180
				}, 100%, 50%)`;

				// Draw the line
				context.beginPath();
				context.moveTo(centerX, centerY);
				context.lineTo(x, y);
				context.stroke();
			});
		};

		// Start capturing frames
		captureFrame();

		return () => {
			// Cleanup code goes here (e.g., stop frame capturing)
		};
	}, []);

	return (
		<div className="flex flex-col items-center">
			<video className="p-[20px]" ref={videoRef} src="colors.mp4" controls />
			<canvas
				className="p-[20px] hidden"
				id="vectorScopeCanvas"
				width={800}
				height={450}
			/>
			<canvas
				className="p-[20px]"
				id="histogramCanvas"
				width={800}
				height={450}
			/>
			<canvas id="vectorScopeCanvas" width={800} height={450} />
		</div>
	);
};

export default VideoVectorScope;
