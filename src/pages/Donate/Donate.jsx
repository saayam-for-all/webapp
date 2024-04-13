import React, { useState } from "react";
import "./Donate.css";
import QRIMG from "../../assets/QR.png";

const Donation = () => {
	return (
		<div className='donation-tab mt-20'>
			<h1 className='tect-center'>You can scan or click on Donate </h1>
			<div className='flex items-center justify-center mt-6'>
				<img src={QRIMG} alt='qr' />
			</div>
			<a
				href='https://www.paypal.com/donate/?hosted_button_id=4KLWNM5JWKJ4S'
				className='btn btn-accent mt-6'
				target='_blank'
			>
				Dontate
			</a>
		</div>
	);
};

export default Donation;
