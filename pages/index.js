import VideoVectorScope from "../components/VideoVectorScope";

const Home = () => {
	return (
		<div className="flex flex-col items-center p-[20px] w-full bg-[#1d1d1d] min-h-screen">
			<h1 className="text-[30px] my-[40px] text-white">Video Player</h1>
			<VideoVectorScope />
		</div>
	);
};

export default Home;
