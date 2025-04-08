import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Hub } from "aws-amplify/utils";
import { useDispatch, useSelector } from "react-redux";
import {
  IoPeopleOutline,
  IoLogInOutline,
  IoNotificationsOutline,
} from "react-icons/io5";
import { BiDonateHeart } from "react-icons/bi";
import LOGO from "../../../assets/logo.svg";
import DEFAULT_PROFILE_ICON from "../../../assets/Landingpage_images/ProfileImage.jpg";
import "./NavBar.css";
import { logout } from "../../../redux/features/authentication/authActions";

const Navbar = () => {
  const { t } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); // Logout modal state
  const [profileIcon, setProfileIcon] = useState(DEFAULT_PROFILE_ICON);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const profileDropdownRef = useRef(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    const savedProfilePhoto = localStorage.getItem("profilePhoto");
    if (savedProfilePhoto) setProfileIcon(savedProfilePhoto);

    const handleStorageChange = (event) => {
      if (event.key === "profilePhoto") {
        setProfileIcon(event.newValue);
      }
    };

    const handleProfilePhotoUpdated = () => {
      const updatedProfilePhoto = localStorage.getItem("profilePhoto");
      if (updatedProfilePhoto) {
        setProfileIcon(updatedProfilePhoto);
      }
    };

    // Listen for unsaved changes events from Profile components
    const handleUnsavedChanges = (event) => {
      setHasUnsavedChanges(event.detail.hasUnsavedChanges);
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("profile-photo-updated", handleProfilePhotoUpdated);
    window.addEventListener("unsaved-changes", handleUnsavedChanges);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "profile-photo-updated",
        handleProfilePhotoUpdated,
      );
      window.removeEventListener("unsaved-changes", handleUnsavedChanges);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const notificationButton = document.getElementById("notificationButton");
    if (notificationButton) {
      notificationButton.style.display = user ? "flex" : "none";
    }
  }, [user]);

  const handleDropdownClick = () => setIsDropdownOpen(!isDropdownOpen);

  const handleLinkClick = (e) => {
    if (hasUnsavedChanges) {
      e.preventDefault();
      if (
        window.confirm(
          "You have unsaved changes. Do you want to proceed without saving?",
        )
      ) {
        setHasUnsavedChanges(false);
        const targetUrl = e.currentTarget.getAttribute("href");

        if (targetUrl) {
          navigate(targetUrl);
        }

        // Close dropdown if open
        if (isDropdownOpen) {
          setIsDropdownOpen(false);
        }
      } else {
        // User chose to stay, do nothing
        return;
      }
    } else if (isDropdownOpen) {
      setIsDropdownOpen(false);
    }
  };

  const handleDropdownItemClick = (e, route) => {
    if (hasUnsavedChanges) {
      e.preventDefault();
      if (
        window.confirm(
          "You have unsaved changes. Do you want to proceed without saving?",
        )
      ) {
        setHasUnsavedChanges(false);
        setIsDropdownOpen(false);
        navigate(route);
      }
    } else {
      setIsDropdownOpen(false);
      navigate(route);
    }
  };

  const handleProfileClick = (e) => {
    if (hasUnsavedChanges) {
      e.preventDefault();
      if (
        window.confirm(
          "You have unsaved changes. Do you want to proceed without saving?",
        )
      ) {
        setHasUnsavedChanges(false);
        navigate("/profile");
        setIsProfileDropdownOpen(false);
      }
    } else {
      navigate("/profile");
      setIsProfileDropdownOpen(false);
    }
  };

  const handleLogoutClick = (e) => {
    e.preventDefault();
    if (hasUnsavedChanges) {
      if (
        window.confirm(
          "You have unsaved changes. Do you want to proceed without saving?",
        )
      ) {
        setHasUnsavedChanges(false);
        setIsLogoutModalOpen(true);
      }
    } else {
      setIsLogoutModalOpen(true);
    }
  };

  const handleSignOut = () => {
    dispatch(logout());
    setIsLogoutModalOpen(false);
    navigate("/login");
  };

  const handleNotificationsClick = () => {
    if (hasUnsavedChanges) {
      if (
        window.confirm(
          "You have unsaved changes. Do you want to proceed without saving?",
        )
      ) {
        setHasUnsavedChanges(false);
        // Navigate to notifications or open notifications panel
        // Add your navigation code here
      }
    } else {
      // Navigate to notifications or open notifications panel
      // Add your navigation code here
    }
  };

  return (
    <div className="navbar navbar-sm navbar-gradient-bg">
      <div className="navbar-start">
        <Link
          to="/dashboard"
          className="text-3xl font-semibold"
          onClick={handleLinkClick}
        >
          <img src={LOGO} alt="logo" className="w-14 h-14" />
        </Link>
      </div>

      <div className="navbar-end gap-10">
        <div className="dropdown">
          <button
            className={`font-semibold flex flex-col items-center ${isDropdownOpen ? "active" : ""}`}
            onClick={handleDropdownClick}
          >
            <IoPeopleOutline className="mr-1 text-xl" />
            {t("ABOUT")}
          </button>
          <ul
            tabIndex={0}
            className={`menu menu-md dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 ${isDropdownOpen ? "block" : "hidden"}`}
          >
            <li onClick={(e) => handleDropdownItemClick(e, "/directors")}>
              <a>{t("DIRECTORS")}</a>
            </li>
            <li onClick={(e) => handleDropdownItemClick(e, "/how-we-operate")}>
              <a>{t("HOW_WE_OPERATE")}</a>
            </li>
            <li onClick={(e) => handleDropdownItemClick(e, "/contact")}>
              <a>{t("CONTACT")}</a>
            </li>
            <li onClick={(e) => handleDropdownItemClick(e, "/mission")}>
              <a>{t("MISSION")}</a>
            </li>
            <li onClick={(e) => handleDropdownItemClick(e, "/vision")}>
              <a>{t("VISION")}</a>
            </li>
          </ul>
        </div>

        <NavLink
          to="/donate"
          className="font-semibold flex flex-col items-center"
          onClick={handleLinkClick}
        >
          <BiDonateHeart className="mr-1 text-xl" />
          {t("DONATE")}
        </NavLink>

        <button
          className="font-semibold flex flex-col items-center"
          id="notificationButton"
          onClick={handleNotificationsClick}
        >
          <IoNotificationsOutline className="mr-1 text-xl" />
          {t("NOTIFICATIONS")}
        </button>

        {user?.userId ? (
          <div
            className="relative flex flex-col items-center"
            ref={profileDropdownRef}
          >
            <div className="flex items-center">
              <img
                src={profileIcon}
                alt="Profile Icon"
                className="w-8 h-8 rounded-full cursor-pointer"
                onClick={() => {
                  if (hasUnsavedChanges) {
                    if (
                      window.confirm(
                        "You have unsaved changes. Do you want to proceed without saving?",
                      )
                    ) {
                      setHasUnsavedChanges(false);
                      setIsProfileDropdownOpen(!isProfileDropdownOpen);
                    }
                  } else {
                    setIsProfileDropdownOpen(!isProfileDropdownOpen);
                  }
                }}
              />
            </div>
            {isProfileDropdownOpen && (
              <ul className="profile-dropdown">
                <li
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={handleProfileClick}
                >
                  {t("PROFILE")}
                </li>
                <li
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={handleLogoutClick}
                >
                  {t("LOGOUT")}
                </li>
              </ul>
            )}
          </div>
        ) : (
          <NavLink
            to="/login"
            className="font-semibold flex flex-col items-center"
            id="loginButton"
            onClick={handleLinkClick}
          >
            <IoLogInOutline className="mr-1 text-xl" />
            {t("LOGIN")}
          </NavLink>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-lg font-semibold mb-4">
              {t(
                "Are you sure, you want to log out? There may be unsaved data on the page.",
              )}
            </p>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 mr-2 bg-gray-300 rounded-md"
                onClick={() => setIsLogoutModalOpen(false)}
              >
                {t("Cancel")}
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-black rounded-md"
                onClick={handleSignOut}
              >
                {t("Logout")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
