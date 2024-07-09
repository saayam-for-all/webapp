import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  signInWithRedirect,
  signOut,
  getCurrentUser,
  fetchAuthSession,
} from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import LOGO from "../../../assets/logo.svg";
import DEFAULT_PROFILE_ICON from "../../../assets/Landingpage_images/ProfileImage.jpg";

import "./NavBar.css";
import { useDispatch, useSelector } from "react-redux";
import {
  checkAuthStatus,
  login,
} from "../../../redux/features/authentication/authActions";

const Navbar = () => {
  const { i18n, t } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [profileIcon, setProfileIcon] = useState(DEFAULT_PROFILE_ICON);
  const fileInputRef = useRef(null);
  const profileDropdownRef = useRef(null);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

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
    const subscribe = Hub.listen("auth", ({ payload }) => {
      switch (payload.event) {
        case "signedIn":
          console.log("user have been signedIn successfully.");
          dispatch(checkAuthStatus());
          break;
        case "signedOut":
          console.log("user have been signedOut successfully.");
          break;
      }
    });

    return subscribe;
  }, [dispatch]);

  useEffect(() => {
    const getSession = async () => {
      const session = await fetchAuthSession();
      console.log("id token", session);
      // console.log("access token", session.tokens.accessToken);
    };

    getSession();
  }, []);

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
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleSignOut = () => {
    signOut();
  };

  const handleEditProfilePicture = () => {
    fileInputRef.current.click();
  };

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileIcon(e.target.result);
      };
      reader.readAsDataURL(file);
      setIsProfileDropdownOpen(false);
    }
  };

  return (
    <div className="navbar navbar-sm navbar-gradient-bg s">
      <div className="navbar-start">
        <Link to="/" className="text-3xl font-semibold">
          <img src={LOGO} alt="logo" className="w-14 h-14" />
        </Link>
      </div>

      <div className="navbar-end gap-10">
        <div className="dropdown">
          <div
            tabIndex={0}
            className={`cursor-pointer font-semibold ${
              isDropdownOpen ? "active" : ""
            }`}
            onClick={handleDropdownClick}
          >
            {t("about")}
          </div>
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
          className="font-semibold"
          onClick={handleLinkClick}
        >
          {t("donate")}
        </NavLink>
        {user?.userId ? (
          <div className="relative" ref={profileDropdownRef}>
            <img
              src={profileIcon}
              alt="Profile Icon"
              className="w-8 h-8 rounded-full cursor-pointer"
              onClick={handleProfileClick}
            />
            {isProfileDropdownOpen && (
              <ul className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <li
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={handleEditProfilePicture}
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
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleProfilePictureChange}
            />
          </div>
        ) : (
          <button className="font-semibold" onClick={handleSignIn}>
            {t("login")}
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
