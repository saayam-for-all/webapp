import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { signOut } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import {
  IoPeopleOutline,
  IoLogInOutline,
  IoNotificationsOutline,
} from "react-icons/io5";
import { FiDollarSign } from "react-icons/fi";

import LOGO from "../../../assets/logo.svg";
import DEFAULT_PROFILE_ICON from "../../../assets/Landingpage_images/ProfileImage.jpg";
import "./NavBar.css";
import { useDispatch, useSelector } from "react-redux";
import {
  checkAuthStatus,
  login,
} from "../../../redux/features/authentication/authActions";

const Navbar = ({ count }) => {
  const { i18n, t } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [profileIcon, setProfileIcon] = useState(DEFAULT_PROFILE_ICON);
  const fileInputRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [firstName, setFirstName] = useState(user?.firstName || "User");

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

  useEffect(() => {
    const subscribe = Hub.listen("auth", ({ payload }) => {
      switch (payload.event) {
        case "signedIn":
          console.log("user has signed in successfully.");
          dispatch(checkAuthStatus());
          break;
        case "signedOut":
          console.log("user has signed out successfully.");
          break;
      }
    });

    return subscribe;
  }, [dispatch]);

  const handleDropdownClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLinkClick = () => {
    if (isDropdownOpen) {
      setIsDropdownOpen(false);
    }
  };

  const handleSignIn = async () => {
    dispatch(login());
  };

  const handleProfileClick = () => {
    navigate("/profile");
    setIsProfileDropdownOpen(false);
  };

  const handleSignOut = () => {
    signOut();
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
              <NavLink to="/directors">{t("directors")}</NavLink>
            </li>
            <li>
              <NavLink to="/how-we-operate">{t("how_we_operate")}</NavLink>
            </li>
            <li>
              <NavLink to="/contact">{t("contact")}</NavLink>
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
          <FiDollarSign className="mr-1 text-xl" />
          {t("donate")}
        </NavLink>

        <NavLink
          to="/notification"
          className="font-semibold flex flex-col items-center"
          id="notificationButton"
        >
          <div className="relative inline-block">
            <IoNotificationsOutline className="mr-1 text-xl" />
            {count > 0 && (
              <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-green-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {count}
              </span>
            )}
          </div>
          Notifications
        </NavLink>

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
              <span className="ml-2">
                {firstName.length > 8
                  ? `${firstName.substring(0, 8)}...`
                  : firstName}
              </span>
            </div>
            {isProfileDropdownOpen && (
              <ul className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
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
          <>
            <button
              className="font-semibold flex flex-col items-center"
              onClick={handleSignIn}
            >
              <IoLogInOutline className="mr-1 text-xl" />
              {t("login")}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
