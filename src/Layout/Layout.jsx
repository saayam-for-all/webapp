import React, { Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "#components/Navbar/Navbar";
import MainLoader from "#components/Loader/MainLoader";
import Footer from "#components/Footer/Footer";
import LeftAds from "#components/LeftAds/LeftAds";
import RightAds from "#components/RightAds/RightAds";
import NavigationGuard from "#components/NavigationGuard/NavigationGuard";
import { NotificationProvider } from "../context/NotificationContext";
import ScrollToTop from "../common/components/ScrollToTop/ScrollToTop";
import Breadcrumbs from "#components/BreadCrumbs/BreadCrumbs";

const Layout = () => {
  const location = useLocation();

  const hideBreadcrumbRoutes = ["/", "/home", "/login"];
  const shouldHideBreadcrumbs = hideBreadcrumbRoutes.includes(
    location.pathname.toLowerCase(),
  );

  return (
    <div className="flex flex-col h-screen">
      <NotificationProvider>
        <NavigationGuard />

        <header className="sticky z-10" id="header">
          <Navbar />
        </header>

        <div className="flex flex-1">
          <aside className="left-ads-panel flex-1 ">
            <LeftAds />
          </aside>

          <main className="flex-[6] overflow-auto">
            {!shouldHideBreadcrumbs && <Breadcrumbs />}
            <Suspense fallback={<MainLoader />}>
              <Outlet />
            </Suspense>
          </main>

          <aside className="right-ads-panel flex-1 ">
            <RightAds />
          </aside>
        </div>

        <footer className="">
          <Footer />
        </footer>
        <ScrollToTop />
      </NotificationProvider>
    </div>
  );
};

export default Layout;
