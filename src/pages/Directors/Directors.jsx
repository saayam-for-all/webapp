import "./Directors.css";

import NaveenIMG from "../../assets/images/Naveen_Sharma.jpeg";
import RajeshwaryImg from "../../assets/images/Rajeshwary.jpeg";
import RameshImg from "../../assets/images/Ramesh_Maturu.jpeg";
import RaoPanugantiImg from "../../assets/images/Rao-Panuganti.jpeg";
import RaoImg from "../../assets/images/Rao.jpeg";
import { FaLinkedin } from "react-icons/fa";

const DirectorsData = [
	{
		name: "Rao K Bhethanabotla",
		role: "Founder/President/CEO/CTO",
		linkedin: "https://www.linkedin.com/in/raobhethanabotla",
		image: RaoImg,
	},
	{
		name: "Ramesh Maturu",
		role: "Director",
		linkedin: "https://www.linkedin.com/in/rameshmaturu/",
		image: RameshImg,
	},
	{
		name: "Rao Panuganti",
		role: "Director & Secretary",
		linkedin: "https://www.linkedin.com/in/rao-panuganti-654443/",
		image: RaoPanugantiImg,
	},
	{
		name: "Naveen Sharma",
		role: "Director",
		linkedin: "https://www.linkedin.com/in/nsharma2/",
		image: NaveenIMG,
	},
	{
		name: "Rajeshwary Jaldu",
		role: "Director & Treasurer",
		linkedin: "https://www.linkedin.com/in/rajeshwary-jaldu/",
		image: RajeshwaryImg,
	},
];

const Directors = () => {
	return (
		<div>
			<h1 className='text-center text-3xl font-semibold'>Directors</h1>
			<div className='directors flex items-center justify-center flex-wrap gap-10'>
				{DirectorsData.map((director, index) => (
					<div
						key={index}
						className='director h-[500px] w-[350px] p-4 m-4 flex flex-col items-center justify-center text-center shadow-lg hover:shadow-2xl hover:scale-110 transition-transform duration-500 ease-in-out rounded-xl'
					>
						<div>
							<img
								src={director.image}
								alt={director.name}
								width={300}
								height={400}
								style={{
									aspectRatio: "3/3",
								}}
								className='rounded-lg hover:rounded-2xl transition-all shadow-lg'
							/>
						</div>
						<h2 className='flex gap-2 mt-5'>	
						<a	
							href={director.linkedin}
							className='text-blue-500'
							target='_blank'
						>
							{director.name}
						</a>	
						</h2>
						<h3 className='flex gap-2 mt-5'>{director.role}</h3>
					</div>
				))}
			</div>
		</div>
	);
};

export default Directors;