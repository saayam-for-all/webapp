import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../common/components/Navbar/Navbar";
import MainLoader from "../common/components/Loader/MainLoader";
import Footer from "../common/components/Footer/Footer";
import LeftAds from "../common/components/LeftAds/LeftAds";
import RightAds from "../common/components/RightAds/RightAds";

const Layout = () => {
	return (
		<div className='flex flex-col h-screen overflow-auto'>
			{/* header includes Navbar with lefover left and right space for alignment */}
			<header className='flex sticky top-0 z-[10000]'>
				<aside className='flex-1'></aside>
				<div className='flex-[6]'>
					<Navbar />
				</div>
				<aside className='flex-1'></aside>
			</header>

			{/* main content */}
			<div className='flex flex-1'>
				<aside className='left-ads-panel flex-1 '>
					<LeftAds />
				</aside>
				<main className='flex-[6]'>
					<div className=''>
						<Suspense fallback={<MainLoader />}>
							<Outlet />
						</Suspense>
					</div>
				</main>
				<aside className='right-ads-panel flex-1 '>
					<RightAds />
				</aside>
			</div>

			{/* footer */}
			<footer className=''>
				<Footer />
			</footer>
		</div>
	);
};

export default Layout;
