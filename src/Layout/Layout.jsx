import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import Navbar from "#components/Navbar/Navbar";
import MainLoader from "#components/Loader/MainLoader";
import Footer from "#components/Footer/Footer";
import LeftAds from "#components/LeftAds/LeftAds";
import RightAds from "#components/RightAds/RightAds";
import NavigationGuard from "#components/NavigationGuard/NavigationGuard";
import { NotificationProvider } from "../context/NotificationContext";
import ScrollToTop from "../common/components/ScrollToTop/ScrollToTop";

// VerticalAd renders the AdSense <ins> directly, so each flex-1 rail receives
// one eighth of the viewport. At 992px that is 124px, enough for Google's
// narrowest standard vertical format (120x600), while the flex-[6] main keeps
// 744px, enough for a 728px horizontal format. The input-capability checks keep
// these rails off touch-oriented phones and tablets, where AdSense may expand a
// horizontal unit to the full screen and overflow a main column squeezed by side
// rails.
const AD_RAILS_QUERY =
  "(min-width: 992px) and (hover: hover) and (pointer: fine)";

const Layout = () => {
  const showAdRails = useMediaQuery(AD_RAILS_QUERY);

  return (
    <div className="flex flex-col h-screen">
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
          {showAdRails && (
            <aside className="flex-1">
              <LeftAds />
            </aside>
          )}
          <main className="flex-[6] overflow-auto">
            <Suspense fallback={<MainLoader />}>
              <Outlet />
            </Suspense>
          </main>
          {showAdRails && (
            <aside className="flex-1">
              <RightAds />
            </aside>
          )}
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
