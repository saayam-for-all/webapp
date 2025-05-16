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
import { GET_NOTIFICATIONS } from "../../../services/requestServices";
import { useNotifications } from "../../../context/NotificationContext";
import OurTeamIcon from "../../../assets/Our_Team_SVG.svg";
import OurMissionIcon from "../../../assets/Our_Mission.svg";

const Navbar = () => {
  const { t } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); // Logout modal state
  const [profileIcon, setProfileIcon] = useState(DEFAULT_PROFILE_ICON);
  const navigate = useNavigate();
  const reduxDispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const profileDropdownRef = useRef(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  // const [notifications, setNotifications] = useState([]);
  const { state, dispatch: notificationDispatch } = useNotifications();
  const [newNotificationCount, setNewNotificationCount] = useState(0);

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
    if (!user?.userId) return; // don't fetch unless user is logged in

    const notificationButton = document.getElementById("notificationButton");

    if (notificationButton) {
      notificationButton.style.display = user ? "flex" : "none";
    }
    const fetchNotifications = async () => {
      try {
        // const response = await GET_NOTIFICATIONS(); //Call the funciton as of now we are assigning the static data
        // const rawNotifications = response.data.notifications || [];
        const rawNotifications = [
          {
            type: "Volunteer",
            title: "New Match Request",
            message: "You have new Volunteer match request in Logistics",
            date: "Mar 15, 2023, 10:30 AM",
          },
          {
            type: "Volunteer",
            title: "New Match Request",
            message: "Hospital",
            date: "Jun 15, 2023, 10:30 AM",
          },
          {
            type: "Volunteer",
            title: "Logistic Help",
            message: "Logistics",
            date: "Nov 15, 2023, 10:30 AM",
          },
          {
            type: "helpRequest",
            title: "Educational Help",
            message: "Need help with Logistics",
            date: "Dec 16, 2023, 10:30 AM",
          },
          {
            type: "Volunteer",
            title: "New Match Request",
            message: "Education",
            date: "Jan 15, 2023, 10:30 AM",
          },
        ];

        // ✅ Add unique ID using crypto.randomUUID()
        const notificationsWithIds = rawNotifications.map((note) => ({
          ...note,
          id: crypto.randomUUID(),
        }));

        notificationDispatch({
          type: "SET_NOTIFICATIONS",
          payload: notificationsWithIds,
        });
        const existing = new Set(
          state.notifications.map((n) => n.message + n.date),
        );
        const newOnes = notificationsWithIds.filter(
          (n) => !existing.has(n.message + n.date),
        );

        // Only update if new notifications exist
        if (newOnes.length > 0) {
          notificationDispatch({
            type: "SET_NOTIFICATIONS",
            payload: [...state.notifications, ...newOnes],
          });

          setNewNotificationCount((prev) => prev + newOnes.length);
        }
      } catch (error) {
        console.error("Error fetching Notifications:", error);
      }
    };

    fetchNotifications(); // Comment it after call ing the funciton below

    const interval = setInterval(
      "call fetchNotifications() here",
      2 * 60 * 1000,
    ); // fetch every 2 min

    return () => clearInterval(interval);
  }, [notificationDispatch, user]);

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

  const handleNotificationsClick = () => {
    console.log("notifications");
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
    reduxDispatch(logout());
    setIsLogoutModalOpen(false);
    navigate("/login");
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
            onClick={handleLinkClick}
          >
            <li>
              <NavLink to="/our-team" name="directors">
                <img src={OurTeamIcon} alt="Team" className="w-5 h-5" />
                {t("Our Team")}
              </NavLink>
            </li>
            <li>
              <NavLink to="/our-mission" name="our-mission">
                <img src={OurMissionIcon} alt="Mission" className="w-5 h-5" />
                {t("Our Mission")}
              </NavLink>
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

        <NavLink
          to="/notifications"
          id="notificationButton"
          className="font-semibold flex flex-col items-center"
          onClick={() => {
            handleNotificationsClick;
            setNewNotificationCount(0); // ✅ Reset count when clicked
          }}
        >
          <div className="relative">
            <IoNotificationsOutline className="mr-1 text-xl" />
            {newNotificationCount > 0 && (
              <span className="absolute -top-1 right-0 bg-red-600 text-white text-xs px-1 rounded-full">
                {newNotificationCount}
              </span>
            )}
          </div>
          {t("NOTIFICATIONS")}
        </NavLink>
        {/* <button
          className="font-semibold flex flex-col items-center"
          id="notificationButton"
          onClick={handleNotificationsClick}
        >
          <IoNotificationsOutline className="mr-1 text-xl" />
          {t("NOTIFICATIONS")}
        </button> */}

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
            <div className="mt-8 flex justify-end gap-2">
              <button
                type="submit"
                className="py-2 px-4 bg-blue-500 text-white rounded-md mr-2 hover:bg-blue-600"
                onClick={handleSignOut}
              >
                {t("Logout")}
              </button>
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                type="button"
                className="py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                {t("Cancel")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
