import { useEffect, useState } from "react";
import FOOD1 from "../../../assets/carouselImages/food.jpg";
import FOOD2 from "../../../assets/carouselImages/food3.jpg";
import HANDS from "../../../assets/carouselImages/hands.jpg";
import HANDS2 from "../../../assets/carouselImages/hands2.jpg";
import HEALTH from "../../../assets/carouselImages/health.jpg";
import HEALTH2 from "../../../assets/carouselImages/health2.jpg";
import CLOTHES from "../../../assets/carouselImages/clothes.jpg";
import EDUCATION from "../../../assets/carouselImages/education3.jpg";
import REFERRALS from "../../../assets/carouselImages/referrals.jpeg";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const CarouselImages = [
	FOOD1,
	FOOD2,
	HANDS,
	HEALTH,
	HANDS2,
	HEALTH2,
	CLOTHES,
	EDUCATION,
	REFERRALS,
];

export default function Carousel() {
	let [current, setCurrent] = useState(0);

	let previousSlide = () => {
		if (current === 0) setCurrent(CarouselImages.length - 1);
		else setCurrent(current - 1);
	};

	let nextSlide = () => {
		if (current === CarouselImages.length - 1) setCurrent(0);
		else setCurrent(current + 1);
	};

	useEffect(() => {
		const intervalId = setInterval(() => {
			nextSlide();
		}, 3000);
		return () => clearInterval(intervalId);
	}, [current]);

	return (
		<div className='overflow-hidden relative h-[500px]'>
			<div
				className={`flex transition ease-out duration-1000`}
				style={{
					transform: `translateX(-${current * 100}%)`,
				}}
			>
				{CarouselImages.map((s, idx) => {
					return <img src={s} alt={s} key={idx} />;
				})}
			</div>

			<div className='absolute top-0 h-full w-full justify-between items-center flex text-3xl px-2'>
				<div
					onClick={previousSlide}
					className='bg-black opacity-25 hover:opacity-100 rounded-full p-1 text-white hover:bg-slate-700 flex items-center justify-center cursor-pointer'
				>
					<IoIosArrowBack />
				</div>
				<div
					onClick={nextSlide}
					className='bg-black opacity-25 hover:opacity-100 rounded-full p-1 text-white hover:bg-slate-700 flex items-center justify-center cursor-pointer'
				>
					<IoIosArrowForward />
				</div>
			</div>

			<div className='absolute bottom-0 py-4 flex justify-center gap-3 w-full'>
				{CarouselImages.map((s, i) => {
					return (
						<div
							onClick={() => {
								setCurrent(i);
							}}
							key={"circle" + i}
							className={`rounded-full w-3 h-3 cursor-pointer  ${
								i == current ? "bg-white" : "bg-gray-500"
							}`}
						></div>
					);
				})}
			</div>
		</div>
	);
}
