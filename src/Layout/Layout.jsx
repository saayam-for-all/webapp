import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Footer from "../common/components/Footer/Footer";
import LeftAds from "../common/components/LeftAds/LeftAds";
import MainLoader from "../common/components/Loader/MainLoader";
import Navbar from "../common/components/Navbar/Navbar";
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
        <main className="flex-[6] overflow-auto">
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
