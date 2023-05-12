import { useEffect, useState } from "react";

const Hue = () => {
	const [redVal, setRed] = useState(0);
	const [greenVal, setGreen] = useState(0);
	const [blueVal, setBlue] = useState(0);

	useEffect(() => {
		const canvas = document.getElementById("colorWheelCanvas");
		const ctx = canvas.getContext("2d");
		const img = document.getElementById("colorWheelImg");
		ctx.drawImage(img, 0, 0, 500, 500);
	}, []);

	const drawCoordinates = (angle, distance) => {
		console.log(angle, distance);
		const canvas = document.getElementById("colorWheelCanvas");
		const context = canvas.getContext("2d");

		const centerX = canvas.width / 2;
		const centerY = canvas.height / 2;

		const angleInRadians = angle * (Math.PI / 180);

		const endX = centerX + distance * Math.sin(angleInRadians);
		const endY = centerY - distance * Math.cos(angleInRadians);

		context.beginPath();
		context.moveTo(centerX, centerY); // Starting point (center of the canvas)
		context.lineTo(endX, endY); // Endpoint calculated based on angle and distance
		context.strokeStyle = "black"; // Set line color
		context.lineWidth = 1; // Set line width
		context.stroke(); // Draw the line
	};

	const calculateHue = (r, g, b) => {
		if (r > 255 || g > 255 || b > 255) {
			alert("Please enter a value between 0 and 255");
			return;
		}
		let red = r / 255;
		let green = g / 255;
		let blue = b / 255;

		const max = Math.max(red, green, blue);
		const min = Math.min(red, green, blue);

		let hue;

		if (max === min) {
			hue = 0; // achromatic (gray)
		} else {
			const delta = max - min;
			if (max === red) {
				hue = ((green - blue) / delta) % 6;
			} else if (max === green) {
				hue = (blue - red) / delta + 2;
			} else {
				hue = (red - green) / delta + 4;
			}
			hue = (hue * 60 + 360) % 360; // convert to degrees
		}

		const saturation = (max === 0 ? 0 : (max - min) / max) * 100;

		const value = max * 100;

		drawCoordinates(hue, saturation);
	};

	return (
		<div className="flex flex-col w-full h-full items-center">
			<h1 className="text-[35px] p-[20px]">Hue</h1>
			<label>Red</label>
			<input
				className="p-[10px] rounded text-black"
				onChange={(e) => {
					setRed(e.target.value);
				}}
				type="number"
				min="0"
				max="255"
			/>
			<label>Green</label>
			<input
				className="p-[10px] rounded text-black"
				onChange={(e) => {
					setGreen(e.target.value);
				}}
				type="number"
				min="0"
				max="255"
			/>
			<label>Blue</label>
			<input
				className="p-[10px] rounded text-black"
				onChange={(e) => {
					setBlue(e.target.value);
				}}
				type="number"
				min="0"
				max="255"
			/>
			<button
				onClick={() => calculateHue(redVal, greenVal, blueVal)}
				className="bg-blue-600 p-[15px] rounded my-[20px] hover:bg-blue-700"
			>
				Get hue value
			</button>
			<img
				id="colorWheelImg"
				src="colorWheel.png"
				alt="color wheel"
				className="w-[500px] h-[500px] hidden"
			/>
			<canvas id="colorWheelCanvas" width="500" height="500"></canvas>
		</div>
	);
};

export default Hue;
