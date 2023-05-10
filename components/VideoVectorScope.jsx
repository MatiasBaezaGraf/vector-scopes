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

			// Find the maximum count in the distribution for scaling
			const redMaxCount = Math.max(...distribution.red);
			const greenMaxCount = Math.max(...distribution.green);
			const blueMaxCount = Math.max(...distribution.blue);
			const grayscaleMaxCount = Math.max(...distribution.grayscale);

			// Calculate the scaling factor for histogram height
			const redScalingFactor = histogramHeight / redMaxCount;
			const greenScalingFactor = histogramHeight / greenMaxCount;
			const blueScalingFactor = histogramHeight / blueMaxCount;
			const grayscaleScalingFactor = histogramHeight / grayscaleMaxCount;

			// Plot the histogram
			for (let i = 0; i < 256; i = i + 1) {
				const x = i;

				const redHeight = distribution.red[i] * redScalingFactor;
				const greenHeight = distribution.green[i] * greenScalingFactor;
				const blueHeight = distribution.blue[i] * blueScalingFactor;
				const grayscaleHeight =
					distribution.grayscale[i] * grayscaleScalingFactor;

				// Calculate the height of the next bar in the histogram
				// This is used to draw the line from the current bar to the next bar
				const nextRedHeight = distribution.red[i + 1] * redScalingFactor;
				const nextGreenHeight = distribution.green[i + 1] * greenScalingFactor;
				const nextBlueHeight = distribution.blue[i + 1] * blueScalingFactor;
				const nextGrayscaleHeight =
					distribution.grayscale[i + 1] * grayscaleScalingFactor;

				// Draw the vertical lines for each channel

				contextRed.strokeStyle = "red";
				contextRed.beginPath();
				contextRed.moveTo(x * 2, histogramHeight);
				contextRed.lineTo(x * 2, histogramHeight - redHeight);
				contextRed.lineTo((x + 1) * 2, histogramHeight - nextRedHeight);
				contextRed.stroke();

				contextGreen.strokeStyle = "green";
				contextGreen.beginPath();
				contextGreen.moveTo(x * 2, histogramHeight);
				contextGreen.lineTo(x * 2, histogramHeight - greenHeight);
				contextGreen.lineTo((x + 1) * 2, histogramHeight - nextGreenHeight);
				contextGreen.stroke();

				contextBlue.strokeStyle = "blue";
				contextBlue.beginPath();
				contextBlue.moveTo(x * 2, histogramHeight);
				contextBlue.lineTo(x * 2, histogramHeight - blueHeight);
				contextBlue.lineTo((x + 1) * 2, histogramHeight - nextBlueHeight);
				contextBlue.stroke();

				contextGrayscale.strokeStyle = "white";
				contextGrayscale.beginPath();
				contextGrayscale.moveTo(x * 2, histogramHeight);
				contextGrayscale.lineTo(x * 2, histogramHeight - grayscaleHeight);
				contextGrayscale.lineTo(
					(x + 1) * 2,
					histogramHeight - nextGrayscaleHeight
				);
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

			// Horizontal lines for the waveform
			// context.strokeStyle = "grey";
			// context.beginPath();
			// context.moveTo(0, 0);
			// context.lineTo(900, 0);
			// context.moveTo(0, 60);
			// context.lineTo(900, 60);
			// context.moveTo(0, 120);
			// context.lineTo(900, 120);
			// context.moveTo(0, 180);
			// context.lineTo(900, 180);
			// context.moveTo(0, 240);
			// context.lineTo(900, 240);
			// context.moveTo(0, 300);
			// context.lineTo(900, 300);
			// context.moveTo(0, 360);
			// context.lineTo(900, 360);
			// context.moveTo(0, 420);
			// context.lineTo(900, 420);
			// context.moveTo(0, 480);
			// context.lineTo(900, 480);
			// context.moveTo(0, 540);
			// context.lineTo(900, 540);
			// context.moveTo(0, 600);
			// context.lineTo(900, 600);
			// context.stroke();

			// Plot the waveform

			for (let i = 0; i < pixels.length; i += 4) {
				const red = pixels[i];
				const green = pixels[i + 1];
				const blue = pixels[i + 2];

				// Calculate the average value (brightness) of the pixel
				const brightness = (red + green + blue) / 3;

				// Calculate the vertical position for the waveform sample
				const y = waveformHeight - (brightness * waveformHeight) / 255;

				// Draw the line for the waveform sample
				context.beginPath();
				context.lineWidth = 1;
				context.moveTo(i * sampleWidth, y);
				context.lineTo(i * sampleWidth, y + 0.15);
				context.stroke();
				context.strokeStyle = "green";
			}
		};

		captureFrame();

		return () => {
			// Cleanup code goes here (e.g., stop frame capturing)
		};
	}, []);

	return (
		<div className="flex flex-col items-center">
			<div className="flex flex-row items-center">
				{/* Comment out the video tag and uncomment the image tag to see the
				histogram and waveform for the image instead of the video and viceversa*/}
				{/* <img
					className="p-[20px] h-min"
					ref={imageRef}
					src="gato.png"
					alt="colors"
				/> */}
				<video
					className="p-[20px] h-min"
					ref={videoRef}
					src="flower.webm"
					controls
				/>
				<div className=" flex-col justify-center hidden">
					<canvas
						className="m-[10px] bg-stone-300 border-[1px] border-stone-500"
						id="grayscale"
						width={512}
						height={130}
					/>
					<canvas
						className="m-[10px] bg-stone-300 border-[1px] border-stone-500"
						id="red"
						width={512}
						height={130}
					/>
					<canvas
						className="m-[10px] bg-stone-300 border-[1px] border-stone-500"
						id="green"
						width={512}
						height={130}
					/>
					<canvas
						className="m-[10px] bg-stone-300 border-[1px] border-stone-500"
						id="blue"
						width={512}
						height={130}
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
			<div className="relative">
				<div className="absolute h-full w-full z-30 py-[20px] flex flex-col justify-between">
					<hr className="bg-transparent border-stone-400/25 border-t-[1px] border-b-[0px]" />
					<hr className="bg-transparent border-stone-400/25 border-t-[1px] border-b-[0px]" />
					<hr className="bg-transparent border-stone-400/25 border-t-[1px] border-b-[0px]" />
					<hr className="bg-transparent border-stone-400/25 border-t-[1px] border-b-[0px]" />
					<hr className="bg-transparent border-stone-400/25 border-t-[1px] border-b-[0px]" />
					<hr className="bg-transparent border-stone-400/25 border-t-[1px] border-b-[0px]" />
					<hr className="bg-transparent border-stone-400/25 border-t-[1px] border-b-[0px]" />
					<hr className="bg-transparent border-stone-400/25 border-t-[1px] border-b-[0px]" />
					<hr className="bg-transparent border-stone-400/25 border-t-[1px] border-b-[0px]" />
					<hr className="bg-transparent border-stone-400/25 border-t-[1px] border-b-[0px]" />
				</div>
				<canvas
					className="m-[20px] py-[20px] bg-black"
					id="waveFormCanvas"
					width={600}
					height={600}
				/>
			</div>
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
