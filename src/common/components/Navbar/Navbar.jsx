import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, NavLink, useLocation } from "react-router-dom";
import LOGO from "../../../assets/logo.svg";
import DEFAULT_PROFILE_ICON from "../../../assets/Landingpage_images/ProfileImage.jpg";

import "./NavBar.css";

// mock function to get the user info
const getUserInfo =  () => {
  return {
    firstName: "Dikshita"
  }
}

const Navbar = () => { 
  const { i18n, t } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileIcon, setProfileIcon] = useState(DEFAULT_PROFILE_ICON);
  const [firstName, setFirstName] = useState("");
  const fileInputRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const location = useLocation();


  useEffect(() => {
    if (location.pathname === "/dashboard") {
      setIsLoggedIn(true);
      const userInfo = getUserInfo();
      setFirstName(userInfo.firstName);

    } else {
      setIsLoggedIn(false);
    }
  }, [location.pathname]);

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

  const handleDropdownClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLinkClick = () => {
    if (isDropdownOpen) {
      setIsDropdownOpen(false);
    }
  };

  const handleLogin = () => {
    const currentDomain = window.location.origin;
    const redirectUri = `${currentDomain}/dashboard`;
    const clientId = "rauncvdl1vqs7p4c5o9vlmcd5";
    const responseType = "code";
    const scope = "email+openid+phone";
    const cognitoDomain =
      "https://saayamforall.auth.us-east-1.amazoncognito.com";

    const cognitoUrl = `${cognitoDomain}/login?client_id=${clientId}&response_type=${responseType}&scope=${scope}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}`;

    window.location.href = cognitoUrl;
  };

  const handleProfileClick = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLogout = () => {
    window.location.href = window.location.origin;
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
        {isLoggedIn ? (
          <div className="relative" ref={profileDropdownRef}>
            <div className="flex items-center">
              <img
                src={profileIcon}
                alt="Profile Icon"
                className="w-8 h-8 rounded-full cursor-pointer"
                onClick={handleProfileClick}
              />
              <span className="ml-2">{firstName.length > 8 ? `${firstName.substring(0, 8)}...` : firstName}</span> {/* Display first 8 characters of first name */}
            </div>
            {isProfileDropdownOpen && (
              <ul className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <li className="p-2 hover:bg-gray-100 cursor-pointer">
                  <NavLink to="/profile">{t("Profile")}</NavLink>
                </li>
                <li
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={handleLogout}
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
          <>
            <button className="font-semibold" onClick={handleLogin}>
              {t("login")}
            </button>
            {/* <select
                className='p-1 outline-none rounded-lg'
                onChange={(e) => i18n.changeLanguage(e.target.value)}
              >
                {languages?.map((language) => (
                  <option key={language.code} value={language.code}>
                    {language.name}
                  </option>
                ))}
              </select> */}
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
