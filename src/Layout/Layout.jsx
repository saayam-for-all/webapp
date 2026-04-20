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
  const currentPath = location.pathname.toLowerCase();

  const hideBreadcrumbRoutes = ["/", "/home", "/login"];
  const shouldHideBreadcrumbs = hideBreadcrumbRoutes.includes(currentPath);
  const hideAdsRoutes = [
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/verify-otp",
  ];

  const shouldHideAds = hideAdsRoutes.includes(currentPath);

  return (
    <div className="flex min-h-screen flex-col">
      <NotificationProvider>
        <NavigationGuard />

        <header className="sticky z-10" id="header">
          <Navbar />
        </header>

        <div className="flex flex-1">
          {!shouldHideAds && (
            <aside className="left-ads-panel flex-1 ">
              <LeftAds />
            </aside>
          )}

          <main className={`${shouldHideAds ? "flex-1" : "flex-[6]"} flex-1`}>
            {!shouldHideBreadcrumbs && <Breadcrumbs />}
            <Suspense fallback={<MainLoader />}>
              <Outlet />
            </Suspense>
          </main>

          {!shouldHideAds && (
            <aside className="right-ads-panel flex-1 ">
              <RightAds />
            </aside>
          )}
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
