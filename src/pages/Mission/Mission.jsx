import React from "react";
import "./Mission.css";
import MISSIONIMG from "../../assets/mission.png";

const MissionVision = () => {
	return (
		<div className='px-20 mt-6'>
			<div>
				<h1 className='text-2xl font-semibold text-center'  >Misson</h1>
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
		</div>
	);
};

export default MissionVision;
