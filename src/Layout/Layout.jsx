/* eslint-disable react/no-unknown-property -- Google Ads reads google-side-rail-overlap. */
import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "#components/Navbar/Navbar";
import MainLoader from "#components/Loader/MainLoader";
import Footer from "#components/Footer/Footer";
import LeftAds from "#components/LeftAds/LeftAds";
import RightAds from "#components/RightAds/RightAds";
import NavigationGuard from "#components/NavigationGuard/NavigationGuard";
import { NotificationProvider } from "../context/NotificationContext";
import ScrollToTop from "../common/components/ScrollToTop/ScrollToTop";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <NotificationProvider>
        {/* Navigation Guard to check for unsaved changes */}

        <NavigationGuard />

        {/* header includes Navbar which spans full width */}
        <header
          className="sticky z-10"
          id="header"
          google-side-rail-overlap="false"
        >
          <Navbar />
        </header>

        {/* main content */}
        <div className="flex flex-1">
          <aside className="left-ads-panel flex-1 ">
            <LeftAds />
          </aside>
          <main className="flex-[6] min-w-0">
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
        <ScrollToTop />
      </NotificationProvider>
    </div>
  );
};

export default Layout;
