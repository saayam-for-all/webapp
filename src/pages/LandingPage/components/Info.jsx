import React from "react";
import { Link } from "react-router-dom";

const Info = () => {
	return (
		<div className='px-40 text-lg'>
			<p>
				<strong>Saayam</strong> is a software platform that brings
				requestors of help, volunteers, volunteer organizations and
				donors together. Please go through the details 
				<a
					href='https://github.com/saayam-for-all/docs/wiki'
					target='_blank'
					className='text-blue-500 underline'
				>
					here
				</a>
				.
			</p>
			<p className='mt-5'>
				A requestor requests for help (similar to requesting for a car),
				this request will be matched to a few available volunteers based
				on their profile(similar to available nearest car drivers), one
				volunteer will be picked to help this requestor (similar to one
				chosen car) and finally this volunteer approaches the
				requestor(car arrives at the location where we are). Then
				onwards, this volunteer works with the requestor (car is giving
				you the ride) and sees that this request is fulfilled (car will
				take you to your destination) by working with fellow local
				volunteers or volunteer organizations. Our success depends on
				number of volunteers and number of volunteer organizations that
				we can contact/make use of.
			</p>
			<p className='mt-5'>
				Please join hands and experience the happiness of assisting.
				Please fill this 
				<a
					href='https://docs.google.com/forms/d/e/1FAIpQLSdlu2hzj8Gm4O5LncE-NXbQxyzMTj3-Lr08sKgANEl_a-qwaQ/viewform'
					className='text-blue-500 underline'
					target='_blank'
				>
					form
				</a>
				 for providing your details.
			</p>
			<p className='mt-5'>
				This nonprofit organization is based on two very simple mottos –
				Manava Sevaye Madhava Seva (Service to mankind is Service to
				God) and Sarve jana sukhino bhavantu (May all live happily).
				Anybody from anywhere in the world can make a request for help
				on any type of social media/communication device. This would be
				a purely volunteer based organization. Each request will be
				matched to a local volunteer so that this volunteer can provide
				help to this requestor by taking advantage of any local charity
				organizations or local help. Think of it like an international
				Lyft/Uber service or an international 911 service. Only requests
				related to food, clothes, housing, education, healthcare or any
				general advice would be honored. This charity is beyond any god,
				religion, country or politics. At the same time, we respect all
				your beliefs and we do NOT desecrate any god, religion or
				politics. This charity will be the mother of all charities by
				linking them or collaborating with them, but it does NOT compete
				with any other charity. Only expenses will be reimbursed. No
				payments/salaries to any volunteers or charity
				organizing/management members. This will be a multi-cloud, event
				based, micro services, web/mobile app, AI/ML based product with
				all the latest and the greatest native cloud technologies.
				Entire development and hosting will be free, remote and based on
				contributions from experts & volunteers or with the least cost.
				The income we get from donations, ads or other means will be put
				back into charity. We will take advantage of all FREE services
				like WhatsApp, Zoom etc for operations. Let me know if anybody
				is interested in joining my mission to help humanity. If you are
				interested, you can be part of this charity org by becoming a
				member of a WhatsApp group. Feel free to send this post to your
				friends and to other social media channels.
			</p>
			<p className='mt-5'>
				Keep checking here for the progress of our work!!
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
