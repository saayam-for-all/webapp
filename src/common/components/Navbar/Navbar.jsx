import React from "react"; // Added for testing
import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Hub } from "aws-amplify/utils";
import {
  IoPeopleOutline,
  IoLogInOutline,
  IoNotificationsOutline,
} from "react-icons/io5";
import { BiDonateHeart } from "react-icons/bi";

import LOGO from "../../../assets/logo.svg";
import DEFAULT_PROFILE_ICON from "../../../assets/Landingpage_images/ProfileImage.jpg";
import "./NavBar.css";
import { useDispatch, useSelector } from "react-redux";
import {
  checkAuthStatus,
  logout,
} from "../../../redux/features/authentication/authActions";

const Navbar = () => {
  const { i18n, t } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [profileIcon, setProfileIcon] = useState(DEFAULT_PROFILE_ICON);
  const fileInputRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const savedProfilePhoto = localStorage.getItem("profilePhoto");
    if (savedProfilePhoto) {
      setProfileIcon(savedProfilePhoto);
    }

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

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("profile-photo-updated", handleProfilePhotoUpdated);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "profile-photo-updated",
        handleProfilePhotoUpdated
      );
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

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const notificationButton = document.getElementById("notificationButton");
    if (notificationButton) {
      notificationButton.style.display = user ? "flex" : "none";
    }
  }, [user]);

  const handleDropdownClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLinkClick = () => {
    if (isDropdownOpen) {
      setIsDropdownOpen(false);
    }
  };

  const handleProfileClick = () => {
    navigate("/profile");
    setIsProfileDropdownOpen(false);
  };

  const handleSignOut = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="navbar navbar-sm navbar-gradient-bg s">
      <div className="navbar-start">
        <Link to="/dashboard" className="text-3xl font-semibold">
          <img src={LOGO} alt="logo" className="w-14 h-14" />
        </Link>
      </div>

      <div className="navbar-end gap-10">
        <div className="dropdown">
          <button
            className={`font-semibold flex flex-col items-center ${
              isDropdownOpen ? "active" : ""
            }`}
            onClick={handleDropdownClick}
          >
            <IoPeopleOutline className="mr-1 text-xl" />
            {t("about")}
          </button>
          <ul
            tabIndex={0}
            className={`menu menu-md dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 ${
              isDropdownOpen ? "block" : "hidden"
            }`}
            onClick={handleLinkClick}
          >
            <li>
              <NavLink to="/directors" name="directors">
                {t("directors")}
              </NavLink>
            </li>
            <li>
              <NavLink to="/how-we-operate" name="how-we-operate">
                {t("how_we_operate")}
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" name="contact">
                {t("contact")}
              </NavLink>
            </li>
            <li>
              <NavLink to="/mission">{t("mission")}</NavLink>
            </li>
            <li>
              <NavLink to="/vision">{t("vision")}</NavLink>
            </li>
          </ul>
        </div>
        <NavLink
          to="/donate"
          className="font-semibold flex flex-col items-center"
          onClick={handleLinkClick}
        >
          <BiDonateHeart className="mr-1 text-xl" />
          {t("donate")}
        </NavLink>
        <button
          className="font-semibold flex flex-col items-center"
          id="notificationButton"
        >
          <IoNotificationsOutline className="mr-1 text-xl" />
          Notifications
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
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              />
            </div>
            {isProfileDropdownOpen && (
              <ul className="profile-dropdown">
                <li
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={handleProfileClick}
                >
                  {t("Profile")}
                </li>
                <li
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={handleSignOut}
                >
                  {t("Logout")}
                </li>
              </ul>
            )}
          </div>
        ) : (
          <NavLink
            to="/login"
            className="font-semibold flex flex-col items-center"
            id="loginButton"
          >
            <IoLogInOutline className="mr-1 text-xl" />
            {t("login")}
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default Navbar;
