import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "#components/Navbar/Navbar";
import MainLoader from "#components/Loader/MainLoader";
import Footer from "#components/Footer/Footer";
import LeftAds from "#components/LeftAds/LeftAds";
import RightAds from "#components/RightAds/RightAds";
import NavigationGuard from "#components/NavigationGuard/NavigationGuard";
import Header from "#components/Navbar/Header";
import { NotificationProvider } from "../context/NotificationContext";

const Layout = () => {
  return (
    <div className="flex flex-col h-screen">
      <NotificationProvider>
        {/* Navigation Guard to check for unsaved changes */}


      {/* header includes Navbar which spans full width */}
      <header className="sticky z-10">
        <Header />
        {/* <Navbar /> */}
      </header>

        <NavigationGuard />

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
      </NotificationProvider>
    </div>
  );
};

export default Layout;
