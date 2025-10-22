import Footer from "#components/Footer/Footer";
import LeftAds from "#components/LeftAds/LeftAds";
import MainLoader from "#components/Loader/MainLoader";
import Navbar from "#components/Navbar/Navbar";
import NavigationGuard from "#components/NavigationGuard/NavigationGuard";
import RightAds from "#components/RightAds/RightAds";
import { Suspense } from "react";
import { Outlet, useMatches } from "react-router-dom";
import { NotificationProvider } from "../context/NotificationContext";
import ScrollToTop from "../common/components/ScrollToTop/ScrollToTop";

const Layout = () => {
  const matches = useMatches();
  const showAds = matches.some((match) => match?.handle?.leaveAdSpace);

  return (
    <div className="flex flex-col h-screen">
      <NotificationProvider>
        {/* Navigation Guard to check for unsaved changes */}

        <NavigationGuard />

        {/* header includes Navbar which spans full width */}
        <header className="sticky z-10" id="header">
          <Navbar />
        </header>

        {/* main content */}
        <div className="flex flex-col md:flex-row flex-1">
          {showAds && (
            <aside className="left-ads-panel order-2 md:order-1 md:flex-1">
              <LeftAds />
            </aside>
          )}

          <main className="order-1 md:order-2 flex-[6] overflow-auto">
            <Suspense fallback={<MainLoader />}>
              <Outlet />
            </Suspense>
          </main>
          {showAds && (
            <aside className="right-ads-panel order-3 md:order-3 md:flex-1">
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
