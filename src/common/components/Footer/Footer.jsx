import React from "react";
import "./Footer.css";

const Footer = () => {
	return (
		<div className='bg-slate-200 text-center p-1' data-testid = 'footer-div'>
			<h1 data-testid = 'footer-text'>Copyright © 2024 Saayam. All Rights Reserved</h1>
		</div>
	);
};

export default Footer;
