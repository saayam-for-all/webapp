import React, { Suspense } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../common/components/Navbar/Navbar";
import MainLoader from "../common/components/Loader/MainLoader";
import Footer from "../common/components/Footer/Footer";
import LeftAds from "../common/components/LeftAds/LeftAds";
import RightAds from "../common/components/RightAds/RightAds";

const Layout = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* header includes Navbar which spans full width */}
      <header className="sticky z-10">
        <Navbar />
      </header>

      {/* main content */}
      <div className="flex flex-1">
        <aside className="left-ads-panel flex-1 ">
          <LeftAds />
        </aside>
        <main className="flex-[6]">
          <Suspense fallback={<MainLoader />}>
            <Outlet />
          </Suspense>
        </main>
        <aside className="right-ads-panel flex-1 ">
          <RightAds />
        </aside>
      </div>

      {/* footer */}
      <footer className="">
        <Footer />
      </footer>
    </div>
  );
};

export default Layout;
