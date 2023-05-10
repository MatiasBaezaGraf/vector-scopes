import React, { useRef, useEffect } from "react";

const VideoVectorScope = () => {
	const videoRef = useRef(null);
	const imageRef = useRef(null);

	useEffect(() => {
		const videoElement = videoRef.current;
		const imageElement = imageRef.current;

		const captureFrame = () => {
			const canvas = document.getElementById("videoCanvas");
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
			// renderVectorScope(vectors);

			// Render the RGB histogram
			//-------------------------------------------------------------------------------------------------
			// renderRGBHistogram(pixels);

			// Render the RGB histogram
			//-------------------------------------------------------------------------------------------------
			renderMultiRGBHistogram(pixels);

			// Render the Waveform
			//-------------------------------------------------------------------------------------------------
			renderWaveform(pixels);

			// Perform frame processing and vector scope calculations here

			// Request the next frame
			requestAnimationFrame(captureFrame);
		};

		const renderMultiRGBHistogram = (pixels) => {
			const canvasGrayscale = document.getElementById("grayscale");
			const contextGrayscale = canvasGrayscale.getContext("2d");

			const canvasRed = document.getElementById("red");
			const contextRed = canvasRed.getContext("2d");

			const canvasGreen = document.getElementById("green");
			const contextGreen = canvasGreen.getContext("2d");

			const canvasBlue = document.getElementById("blue");
			const contextBlue = canvasBlue.getContext("2d");

			const histogramHeight = canvasRed.height;

			// Clear the canvas
			contextRed.clearRect(0, 0, canvasRed.width, canvasRed.height);
			contextGreen.clearRect(0, 0, canvasGreen.width, canvasGreen.height);
			contextBlue.clearRect(0, 0, canvasBlue.width, canvasBlue.height);
			contextGrayscale.clearRect(
				0,
				0,
				canvasGrayscale.width,
				canvasGrayscale.height
			);

			// Calculate color distribution
			const distribution = {
				red: new Array(256).fill(0),
				green: new Array(256).fill(0),
				blue: new Array(256).fill(0),
				grayscale: new Array(256).fill(0),
			};

			for (let i = 0; i < pixels.length; i += 4) {
				console.log(pixels);
				const red = pixels[i];
				const green = pixels[i + 1];
				const blue = pixels[i + 2];

				// Calculate the grayscale value for the pixel
				const grayscale = Math.round((red + green + blue) / 3);

				// Increment the respective channel count in the distribution
				distribution.red[red]++;
				distribution.green[green]++;
				distribution.blue[blue]++;
				distribution.grayscale[grayscale]++;
			}

			console.log(distribution);

			// Find the maximum count in the distribution for scaling
			const maxCount = Math.max(
				Math.max(...distribution.red),
				Math.max(...distribution.green),
				Math.max(...distribution.blue),
				Math.max(...distribution.grayscale)
			);

			// Calculate the scaling factor for histogram height
			const scalingFactor = histogramHeight / maxCount;

			// Plot the histogram
			for (let i = 0; i < 300; i = i + 2) {
				const x = i;
				const redHeight = distribution.red[i] * scalingFactor;
				const greenHeight = distribution.green[i] * scalingFactor;
				const blueHeight = distribution.blue[i] * scalingFactor;
				const grayscaleHeight = distribution.grayscale[i] * scalingFactor;

				// Draw the vertical lines for each channel

				contextRed.strokeStyle = "red";
				contextRed.beginPath();
				contextRed.moveTo(x, histogramHeight);
				contextRed.lineTo(x, histogramHeight - redHeight);
				contextRed.stroke();

				contextGreen.strokeStyle = "green";
				contextGreen.beginPath();
				contextGreen.moveTo(x, histogramHeight);
				contextGreen.lineTo(x, histogramHeight - greenHeight);
				contextGreen.stroke();

				contextBlue.strokeStyle = "blue";
				contextBlue.beginPath();
				contextBlue.moveTo(x, histogramHeight);
				contextBlue.lineTo(x, histogramHeight - blueHeight);
				contextBlue.stroke();

				contextGrayscale.strokeStyle = "white";
				contextGrayscale.beginPath();
				contextGrayscale.moveTo(x, histogramHeight);
				contextGrayscale.lineTo(x, histogramHeight - grayscaleHeight);
				contextGrayscale.stroke();
			}
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

			// Draw the outline of the histogram
			context.strokeStyle = "black";
			context.beginPath();
			//Outline
			context.moveTo(1, 1);
			context.lineTo(899, 1);
			context.lineTo(899, 239);
			context.lineTo(1, 239);
			context.lineTo(1, 1);
			//Dividing lines
			context.moveTo(300, 0);
			context.lineTo(300, 240);
			context.moveTo(600, 0);
			context.lineTo(600, 240);
			context.stroke();

			//Horizontal lines
			context.strokeStyle = "grey";
			context.moveTo(0, 30);
			context.lineTo(900, 30);
			context.moveTo(0, 60);
			context.lineTo(900, 60);
			context.moveTo(0, 90);
			context.lineTo(900, 90);
			context.moveTo(0, 120);
			context.lineTo(900, 120);
			context.moveTo(0, 150);
			context.lineTo(900, 150);
			context.moveTo(0, 180);
			context.lineTo(900, 180);
			context.moveTo(0, 210);
			context.lineTo(900, 210);
			context.stroke();

			// Plot the histogram
			for (let i = 0; i < 300; i = i + 2) {
				const x = i;
				const redHeight = distribution.red[i] * scalingFactor;
				const greenHeight = distribution.green[i] * scalingFactor;
				const blueHeight = distribution.blue[i] * scalingFactor;

				// Draw the vertical lines for each channel

				context.strokeStyle = "red";
				context.beginPath();
				context.moveTo(x * 1.17, histogramHeight);
				context.lineTo(x * 1.17, histogramHeight - redHeight);
				context.stroke();

				context.strokeStyle = "green";
				context.beginPath();
				context.moveTo(x * 1.17 + 300, histogramHeight);
				context.lineTo(x * 1.17 + 300, histogramHeight - greenHeight);
				context.stroke();

				context.strokeStyle = "blue";
				context.beginPath();
				context.moveTo(x * 1.17 + 600, histogramHeight);
				context.lineTo(x * 1.17 + 600, histogramHeight - blueHeight);
				context.stroke();
			}
		};

		const renderWaveform = (pixels) => {
			const canvas = document.getElementById("waveFormCanvas");
			const context = canvas.getContext("2d");
			const waveformHeight = canvas.height;

			// Clear the canvas
			context.clearRect(0, 0, canvas.width, canvas.height);

			// Calculate the width of each waveform sample
			const sampleWidth = canvas.width / pixels.length;

			// Plot the waveform
			context.beginPath();
			context.moveTo(0, waveformHeight / 2);

			for (let i = 0; i < pixels.length; i += 4) {
				const red = pixels[i];
				const green = pixels[i + 1];
				const blue = pixels[i + 2];

				// Calculate the average value (brightness) of the pixel
				const brightness = (red + green + blue) / 3;

				// Calculate the vertical position for the waveform sample
				const y = waveformHeight - (brightness * waveformHeight) / 255;

				// Draw a line to the next waveform sample
				context.lineTo(i * sampleWidth, y);
			}

			// Set the waveform line color
			context.strokeStyle = "green";

			// Draw the waveform
			context.stroke();
		};

		// Start capturing frames
		captureFrame();

		return () => {
			// Cleanup code goes here (e.g., stop frame capturing)
		};
	}, []);

	return (
		<div className="flex flex-col items-center">
			<div className="flex flex-row items-center">
				{/* <img
					className="p-[20px] h-min"
					ref={imageRef}
					src="green.png"
					alt="colors"
				/> */}
				<video
					className="p-[20px] h-min"
					ref={videoRef}
					src="colores.mp4"
					controls
				/>
				<div className="flex flex-col justify-center">
					<canvas
						className="m-[10px] bg-stone-300 border-[1px] border-stone-500"
						id="grayscale"
						width={256}
						height={100}
					/>
					<canvas
						className="m-[10px] bg-stone-300 border-[1px] border-stone-500"
						id="red"
						width={256}
						height={100}
					/>
					<canvas
						className="m-[10px] bg-stone-300 border-[1px] border-stone-500"
						id="green"
						width={256}
						height={100}
					/>
					<canvas
						className="m-[10px] bg-stone-300 border-[1px] border-stone-500"
						id="blue"
						width={256}
						height={100}
					/>
				</div>
			</div>
			<canvas
				className="p-[20px] hidden"
				id="photoCanvas"
				width={800}
				height={450}
			/>
			<canvas
				className="p-[20px] hidden"
				id="videoCanvas"
				width={800}
				height={450}
			/>
			<canvas
				className="m-[20px] bg-stone-800"
				id="waveFormCanvas"
				width={900}
				height={300}
			/>
			{/* <canvas
				className="p-[20px]"
				id="histogramCanvas"
				width={900}
				height={240}
			/> */}
		</div>
	);
};

export default VideoVectorScope;
