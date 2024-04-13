import React from "react";
import "./MissionVision.css";
import MISSIONIMG from "../../assets/mission.png";
import VISIONIMG from "../../assets/vision.png";

const MissionVision = () => {
	return (
		<div className='px-20 mt-6'>
			<div>
				<h1 className='text-2xl font-semibold text-center'>Misson</h1>
				<div className='flex'>
					<div>
						<img
							src={MISSIONIMG}
							alt='mission'
							className='w-[300rem] h-80 mt-5'
						/>
					</div>
					<p className='mt-5 text-lg px-5'>
						To empower individuals and communities worldwide by
						facilitating mutual assistance and support through
						Saayam, a software platform that connects requestors,
						volunteers, volunteer organizations, and donors. Our
						mission is to provide timely and targeted assistance to
						those facing challenges in their lives, fostering a
						culture of compassion, solidarity, and service to
						humanity.
					</p>
				</div>
			</div>
			<div>
				<h1 className='text-2xl font-semibold text-center mt-6'>
					Vision
				</h1>
				<div className='flex items-start'>
					<p className='mt-5 text-lg px-5'>
						Saayam envisions a world where everyone has access to
						the help and resources they need to overcome obstacles
						and lead fulfilling lives. We aspire to be a global
						leader in humanitarian aid, leveraging technology and
						collaboration to create a seamless network of support
						that transcends geographical, cultural, and
						sociology-economic barriers. Our vision is to cultivate
						a community where the ethos of "Manava Sevaye Madhava
						Seva" (Service to mankind is Service to God) and "Sarve
						jana sukhino bhavantu" (May all live happily) guides our
						actions, driving positive change and fostering a more
						compassionate and equitable world for all.
					</p>
					<div>
						<img
							src={VISIONIMG}
							alt='vision'
							className='w-[350rem] h-80 mt-5'
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MissionVision;
