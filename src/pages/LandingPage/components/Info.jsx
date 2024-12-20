import React from "react";
import { Link } from "react-router-dom";

const Info = () => {
	return (
		<div className='px-40 text-lg'>
			<p>
				At <strong>Saayam</strong>, we believe in the power of helping hands reaching out to those facing challenges. Our platform connects individuals and communities worldwide, bridging the gap between those who need assistance and those who are willing to provide it.
			</p>
			<p className="mt-5">
				Our vision is of a world where everyone has access to the help they need to overcome obstacles and lead fulfilling lives. We aspire to be a global leader in humanitarian aid, leveraging technology and collaboration to create a seamless network of support that transcends barriers.
			</p>
			<p className='mt-5'>
				Join us in our mission to make a difference. Whether you're looking to lend a helping hand or seeking assistance, Saayam is here for you. Together, let's create a more compassionate and equitable world for all.
			</p>
			<p className='mt-5'>
				Experience the joy of assisting others – join Saayam today. Together, we can make a difference.
			</p>
			<p className='mt-5'>
				Remember, at Saayam, our motto is simple: "Service to mankind is service to God," and "May all live happily." Join us in spreading kindness and compassion, one act of assistance at a time. Anybody from anywhere in the world can make a request for help on any type of social media platform/communication device.
			</p>
			<p className='mt-5'>
				Stay updated on our progress and initiatives – keep checking back here for the latest updates. Together, we can build a better world for everyone.
			</p>
			<p className='mt-5'>
				Saayam For All is a non profit organization with 501(c)(3)
				status. All donations to this organization are tax deductible.
				You can use this{" "}
				<a
					href='https://www.paypal.com/donate/?hosted_button_id=4KLWNM5JWKJ4S'
					className='text-blue-500 underline'
					target='_blank'
				>
					PayPal link
				</a>{" "}
				to donate money.
			</p>
			<p className='my-5'>
				Read More{" "}
				<Link className='text-blue-500 underline' to={"how-we-operate"}>
					How we Operate
				</Link>
				!
			</p>
		</div>
	);
};

export default Info;
