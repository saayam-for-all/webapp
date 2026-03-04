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

const AUTH_PATHS = ["/login", "/signup", "/forgot-password"];

const Layout = () => {
  const { pathname } = useLocation();
  const isAuthPage = AUTH_PATHS.some(
    (path) => pathname === path || pathname.endsWith(path),
  );
  // Auth pages (login, signup, forgot-password): content flow so footer sits right after form. Other pages: fill viewport.
  const fillViewport = !isAuthPage;

  return (
    <div className={`flex flex-col ${fillViewport ? "h-screen" : ""}`}>
      <NotificationProvider>
        <NavigationGuard />

        <header className="sticky top-0 z-10 shrink-0" id="header">
          <Navbar />
        </header>

        {/* Auth pages: content-sized, footer right after form. Other pages: fill viewport, main scrolls. */}
        <div
          className={`flex min-h-0 ${fillViewport ? "flex-1" : "flex-initial"}`}
        >
          {!isAuthPage && (
            <aside className="left-ads-panel flex-1">
              <LeftAds />
            </aside>
          )}
          <main
            className={`min-w-0 ${isAuthPage ? "w-full flex-1" : "flex-[6] overflow-auto"}`}
          >
            <Suspense fallback={<MainLoader />}>
              <Outlet />
            </Suspense>
          </main>
          {!isAuthPage && (
            <aside className="right-ads-panel flex-1">
              <RightAds />
            </aside>
          )}
        </div>

        <footer className="shrink-0">
          <Footer />
        </footer>
        <ScrollToTop />
      </NotificationProvider>
    </div>
  );
};

export default Layout;
