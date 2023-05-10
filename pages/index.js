import VideoVectorScope from "../components/VideoVectorScope";

const Home = () => {
	return (
		<div className="flex flex-col items-center p-[20px] w-full bg-stone-200 min-h-screen">
			<h1 className="text-[30px] my-[40px] text-black">Video Player</h1>
			<VideoVectorScope />
		</div>
	);
};

export default Home;
