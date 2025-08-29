import { Drawer, IconButton, Menu, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import LOGO from "../../../assets/logo.svg";

// Individual imports for outlined icons
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ContactMailOutlinedIcon from "@mui/icons-material/ContactMailOutlined";
import CrisisAlertIcon from "@mui/icons-material/CrisisAlert";
import Diversity1OutlinedIcon from "@mui/icons-material/Diversity1Outlined";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import GroupsIcon from "@mui/icons-material/Groups";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuIcon from "@mui/icons-material/Menu";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import VolunteerActivismOutlinedIcon from "@mui/icons-material/VolunteerActivismOutlined";
import ArticleIcon from "@mui/icons-material/Article";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";

import { IoLogInOutline } from "react-icons/io5";
import DEFAULT_PROFILE_ICON from "../../../assets/Landingpage_images/ProfileImage.jpg";
import { logout } from "../../../redux/features/authentication/authActions";
import { useNotifications } from "../../../context/NotificationContext";

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [volunteerOpenMenu, setVolunteerOpenMenu] = useState(false);
  const [aboutUsOpenMenu, setAboutUsOpenMenu] = useState(false);
  const [profileOpenMenu, setProfileOpenMenu] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state, dispatch: notificationDispatch } = useNotifications();

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [profileIcon, setProfileIcon] = useState(DEFAULT_PROFILE_ICON);
  const { user } = useSelector((state) => state.auth);

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [newNotificationCount, setNewNotificationCount] = useState(0);

  const { t } = useTranslation();

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

  const handleLinkClick = (e, route) => {
    if (hasUnsavedChanges) {
      e.preventDefault();
      if (
        window.confirm(
          "You have unsaved changes. Do you want to proceed without saving?",
        )
      ) {
        setHasUnsavedChanges(false);

        setVolunteerOpenMenu(false);
        setAboutUsOpenMenu(false);
        setProfileOpenMenu(false);

        navigate(route);
      } else {
        return;
      }
    }
    // Close all dropdowns
    setVolunteerOpenMenu(false);
    setAboutUsOpenMenu(false);
    setProfileOpenMenu(false);

    navigate(route);
  };

  const handleLogoutClick = (e) => {
    if (hasUnsavedChanges) {
      e.preventDefault();
      if (
        window.confirm(
          "You have unsaved changes. Do you want to proceed without saving?",
        )
      ) {
        setHasUnsavedChanges(false);

        setVolunteerOpenMenu(false);
        setAboutUsOpenMenu(false);
        setProfileOpenMenu(false);

        setIsLogoutModalOpen(true);
      } else {
        return;
      }
    } else {
      setVolunteerOpenMenu(false);
      setAboutUsOpenMenu(false);
      setProfileOpenMenu(false);

      setIsLogoutModalOpen(true);
    }
  };

  const handleSignOut = () => {
    dispatch(logout());
    setIsLogoutModalOpen(false);
    navigate("/login");
  };

  const handleDrawerClick = (e, route) => {
    // Close all dropdowns
    setVolunteerOpenMenu(false);
    setAboutUsOpenMenu(false);

    // Close Drawer
    setDrawerOpen(false);

    navigate(route);
  };

  const handleVSMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
    setVolunteerOpenMenu(true);
  };

  const handleVSMenuClose = () => {
    setAnchorEl(null);
    setVolunteerOpenMenu(false);
  };

  const handleAUMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
    setAboutUsOpenMenu(true);
  };

  const handleAUMenuClose = () => {
    setAnchorEl(null);
    setAboutUsOpenMenu(false);
  };

  const handlePMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
    setProfileOpenMenu(true);
  };

  const handlePMenuClose = () => {
    setAnchorEl(null);
    setProfileOpenMenu(false);
  };

  const toggleDrawer = (open) => {
    setDrawerOpen(open);
  };

  return (
    <nav className="bg-[#FFFFFF] sticky top-0 h-[113px] w-full z-10 shadow-m p-4">
      <div className="flex items-center justify-between w-full px-2 h-full gap-2 sm:gap-4">
        {/* Logo aligned to the left */}
        <div
          className="flex items-center cursor-pointer"
          onClick={(e) => handleLinkClick(e, "/")}
        >
          <img src={LOGO} alt="Company Logo" className="w-[60px] h-[60px]" />
        </div>
        {/* Mobile Donate button - visible next to logo */}
        <div className="flex md:hidden items-center ml-2">
          <button
            onClick={(e) => handleLinkClick(e, "/donate")}
            className="bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600 flex items-center text-sm"
          >
            <VolunteerActivismOutlinedIcon className="mr-2 text-base" />
            {t("DONATE")}
          </button>
        </div>

        {/* Desktop Menu (visible only on larger screens) */}
        <div className="hidden md:flex items-center justify-center space-x-8 flex-1">
          {/* Showing Home button for guest users */}
          {!user?.userId && (
            <div className="relative">
              <button
                onClick={(e) => handleLinkClick(e, "/")}
                className="text-black hover:text-gray-600 flex items-center text-base md:ml-2"
              >
                <HomeOutlinedIcon className="mr-2" /> {t("HOME")}
              </button>
            </div>
          )}

          {/* Showing Home button for logged in users*/}
          {user?.userId && (
            <div className="relative">
              <button
                onClick={(e) => handleLinkClick(e, "/")}
                className="text-black hover:text-gray-600 flex items-center text-base md:ml-2"
              >
                <HomeOutlinedIcon className="mr-2" /> {t("HOME")}
              </button>
            </div>
          )}

          {/* Dashboard Button for logged in users - Land to Request Page */}
          {user?.userId && (
            <div className="relative">
              <button
                onClick={(e) => handleLinkClick(e, "/dashboard")}
                // className="text-black flex items-center hover:text-gray-600 text-base"
                className="text-black hover:text-gray-600 flex items-center text-base"
              >
                <DashboardCustomizeIcon className="mr-2" /> {t("DASHBOARD")}
              </button>
            </div>
          )}

          {/* About Us Dropdown */}
          <div className="relative">
            <button
              onClick={handleAUMenuClick}
              className="text-black flex items-center hover:text-gray-600 text-base"
            >
              <PeopleOutlinedIcon className="mr-2" /> {t("ABOUT")}
              <ArrowDropDownIcon />
            </button>
            {aboutUsOpenMenu && (
              <Menu
                anchorEl={anchorEl}
                open={aboutUsOpenMenu}
                onClose={handleAUMenuClose}
                PaperProps={{
                  style: {
                    position: "absolute",
                    right: 0,
                    top: "40px",
                    zIndex: 1300, // to appear above other elements
                    maxWidth: "fit-content",
                  },
                }}
              >
                <MenuItem onClick={(e) => handleLinkClick(e, "/our-team")}>
                  <GroupsIcon className="mr-2" /> {t("OUR_TEAM")}
                </MenuItem>
                <MenuItem onClick={(e) => handleLinkClick(e, "/our-mission")}>
                  <CrisisAlertIcon className="mr-2" /> {t("OUR_MISSION")}
                </MenuItem>
                {/* <MenuItem
                  onClick={(e) => handleLinkClick(e, "/news-our-stories")}
                >
                  <ArticleIcon className="mr-2" /> {t("In The News")}
                </MenuItem> */}
              </Menu>
            )}
          </div>

          {/* Volunteer Services Dropdown */}
          <div className="relative">
            <button
              onClick={handleVSMenuClick}
              className="text-black flex items-center hover:text-gray-600 text-base"
            >
              <Diversity1OutlinedIcon className="mr-2" />
              {t("VOLUNTEER_SERVICES")}
              <ArrowDropDownIcon />
            </button>
            {volunteerOpenMenu && (
              <Menu
                anchorEl={anchorEl}
                open={volunteerOpenMenu}
                onClose={handleVSMenuClose}
                PaperProps={{
                  style: {
                    position: "absolute",
                    right: 0,
                    top: "40px",
                    zIndex: 1300, // to appear above other elements
                    maxWidth: "fit-content",
                  },
                }}
              >
                <MenuItem
                  onClick={(e) => handleLinkClick(e, "/how-we-operate")}
                >
                  <GroupsIcon className="mr-2" /> {t("HOW_WE_OPERATE")}
                </MenuItem>
                <MenuItem onClick={(e) => handleLinkClick(e, "/collaborators")}>
                  <Diversity3Icon className="mr-2" /> {t("OUR_COLLABORATORS")}
                </MenuItem>
              </Menu>
            )}
          </div>

          <div className="relative">
            <button
              onClick={(e) => handleLinkClick(e, "/contact")}
              // className="text-black flex items-center hover:text-gray-600 text-base"
              className="text-black hover:text-gray-600 flex items-center text-base"
            >
              <ContactMailOutlinedIcon className="mr-2" /> {t("CONTACT")}
            </button>
          </div>

          {user?.userId && (
            <div className="relative">
              <button
                onClick={(e) => handleLinkClick(e, "/notifications")}
                // className="text-black flex items-center hover:text-gray-600 text-base"
                className="text-black hover:text-gray-600 flex items-center text-base"
              >
                <NotificationsIcon className="mr-2" /> {t("Notifications")}
              </button>
            </div>
          )}
          <div className="relative">
            <button
              onClick={(e) => handleLinkClick(e, "/donate")}
              className="bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600 flex items-center text-sm md:-ml-2"
            >
              <VolunteerActivismOutlinedIcon className="mr-2 text-base" />
              {t("DONATE")}
            </button>
          </div>
        </div>

        {/* Donate button aligned to the rightmost */}

        {/* Login Part */}
        {user?.userId ? (
          <div
            className="relative flex flex-col items-center mr-2"
            // ref={profileDropdownRef}
          >
            <div className="flex items-center">
              <IconButton color="inherit" edge="end">
                <img
                  src={profileIcon}
                  alt="Profile Icon"
                  className="w-8 h-8 rounded-full cursor-pointer"
                  onClick={(e) => {
                    if (hasUnsavedChanges) {
                      if (
                        window.confirm(
                          "You have unsaved changes. Do you want to proceed without saving?",
                        )
                      ) {
                        setHasUnsavedChanges(false);
                        handlePMenuClick(e);
                      }
                    } else {
                      handlePMenuClick(e);
                    }
                  }}
                />
              </IconButton>
            </div>
            {profileOpenMenu && (
              <Menu
                anchorEl={anchorEl}
                open={profileOpenMenu}
                onClose={handlePMenuClose}
                PaperProps={{
                  style: {
                    position: "absolute",
                    right: 0,
                    top: "40px",
                    zIndex: 1300, // to appear above other elements
                    maxWidth: "fit-content",
                  },
                }}
              >
                <MenuItem onClick={(e) => handleLinkClick(e, "/profile")}>
                  <AccountCircleIcon className="mr-2" />
                  {t("Profile")}
                </MenuItem>
                <MenuItem onClick={(e) => handleLogoutClick()}>
                  <LogoutIcon className="mr-2" />
                  {t("Logout")}
                </MenuItem>
              </Menu>
            )}
          </div>
        ) : (
          <NavLink
            to="/login"
            className="font-semibold flex flex-col items-center ml-2 mr-2"
            id="loginButton"
            onClick={(e) => handleLinkClick(e, "/login")}
          >
            <IoLogInOutline className="mr-1 text-xl" />
            {t("LOGIN")}
          </NavLink>
        )}

        {/* Logout Confirmation Modal */}
        {isLogoutModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="text-lg font-semibold mb-4">
                {
                  "Are you sure, you want to log out? There may be unsaved data on the page."
                }
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

        {/* Mobile Menu Icon (visible only on mobile) */}
        <div className=" md:hidden mr-4">
          <IconButton
            color="inherit"
            edge="end"
            onClick={() => toggleDrawer(true)}
            // sx={{ display: { xs: "block", sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
        </div>
      </div>

      {/* Mobile Drawer (Replaces Navbar on Mobile) */}
      <Drawer
        anchor="top"
        open={drawerOpen}
        onClose={() => toggleDrawer(false)}
        variant="temporary"
        sx={{
          "& .MuiDrawer-paper": {
            top: "113px", // Adjusting the top offset so it aligns with the navbar height
            width: "100%",
            paddingTop: "0",
            height: "auto",
          },
        }}
      >
        <div className="p-6 w-64">
          {/* Showing Home button for guest users */}
          {!user?.userId && (
            <div className="block text-black py-2 flex items-center">
              <button
                onClick={(e) => handleLinkClick(e, "/")}
                className="text-black flex items-center hover:text-blue-600"
              >
                <HomeOutlinedIcon className="mr-2" /> {t("HOME")}
              </button>
            </div>
          )}

          {/* Showing Home button for logged in users*/}
          {user?.userId && (
            <div className="block text-black py-2 flex items-center">
              <button
                onClick={(e) => handleLinkClick(e, "/")}
                className="text-black flex items-center hover:text-blue-600"
              >
                <HomeOutlinedIcon className="mr-2" /> {t("HOME")}
              </button>
            </div>
          )}

          {/* Dashboard Button for logged in users - Land to Request Page */}
          {user?.userId && (
            <div className="block text-black py-2 flex items-center">
              <button
                onClick={(e) => handleLinkClick(e, "/dashboard")}
                // className="text-black flex items-center hover:text-gray-600 text-base"
                className="text-black flex items-center hover:text-blue-600"
              >
                <DashboardCustomizeIcon className="mr-2" /> {t("DASHBOARD")}
              </button>
            </div>
          )}

          <div className="block text-black py-2 flex items-center">
            <button
              onClick={handleAUMenuClick}
              className="text-black flex items-center hover:text-blue-600"
            >
              <PeopleOutlinedIcon className="mr-2" /> {t("ABOUT")}
              <ArrowDropDownIcon />
            </button>
            {aboutUsOpenMenu && (
              <Menu
                anchorEl={anchorEl}
                open={aboutUsOpenMenu}
                onClose={handleAUMenuClose}
                PaperProps={{
                  style: {
                    position: "absolute",
                    right: 0,
                    top: "40px",
                    zIndex: 1300, // to appear above other elements
                    maxWidth: "fit-content",
                  },
                }}
              >
                <MenuItem onClick={(e) => handleDrawerClick(e, "/our-team")}>
                  <GroupsIcon className="mr-2" /> {t("OUR_TEAM")}
                </MenuItem>
                <MenuItem onClick={(e) => handleDrawerClick(e, "/our-mission")}>
                  <CrisisAlertIcon className="mr-2" /> {t("OUR_MISSION")}
                </MenuItem>
                {/* <MenuItem
                  onClick={(e) => handleDrawerClick(e, "/news-our-stories")}
                >
                  <ArticleIcon className="mr-2" /> {t("In the news")}
                </MenuItem> */}
              </Menu>
            )}
          </div>

          <div className="block text-black py-2 flex items-center">
            <button
              onClick={handleVSMenuClick}
              className="text-black flex items-center hover:text-blue-600"
            >
              <Diversity1OutlinedIcon className="mr-2" />
              {t("VOLUNTEER_SERVICES")}
              <ArrowDropDownIcon />
            </button>
            {volunteerOpenMenu && (
              <Menu
                anchorEl={anchorEl}
                open={volunteerOpenMenu}
                onClose={handleVSMenuClose}
                PaperProps={{
                  style: {
                    position: "absolute",
                    right: 0,
                    top: "40px",
                    zIndex: 1300,
                    maxWidth: "fit-content",
                  },
                }}
              >
                <MenuItem
                  onClick={(e) => handleDrawerClick(e, "/how-we-operate")}
                >
                  <GroupsIcon className="mr-2" /> {t("HOW_WE_OPERATE")}
                </MenuItem>
                <MenuItem
                  onClick={(e) => handleDrawerClick(e, "/collaborators")}
                >
                  <Diversity3Icon className="mr-2" /> {t("OUR_COLLABORATORS")}
                </MenuItem>
              </Menu>
            )}
          </div>

          <div className="block text-black py-2 flex items-center">
            <button
              onClick={(e) => handleDrawerClick(e, "/contact")}
              className="text-black flex items-center hover:text-blue-600"
            >
              <ContactMailOutlinedIcon className="mr-2" /> {t("CONTACT")}
            </button>
          </div>

          {user?.userId && (
            <div className="block text-black py-2 flex items-center">
              <button
                onClick={(e) => handleDrawerClick(e, "/notifications")}
                className="text-black flex items-center hover:text-blue-600"
              >
                <NotificationsIcon className="mr-2" /> {t("Notifications")}
              </button>
            </div>
          )}
        </div>
      </Drawer>
    </nav>
  );
};

export default Navbar;
