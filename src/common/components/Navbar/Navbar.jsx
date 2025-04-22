import React, { useState, useEffect } from "react";
import { Drawer, Menu, MenuItem, IconButton } from "@mui/material";
import LOGO from "../../../assets/logo.svg";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

// Individual imports for outlined icons
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactMailOutlinedIcon from "@mui/icons-material/ContactMailOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Diversity1OutlinedIcon from "@mui/icons-material/Diversity1Outlined";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MenuIcon from "@mui/icons-material/Menu";
import VolunteerActivismOutlinedIcon from "@mui/icons-material/VolunteerActivismOutlined";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import GroupsIcon from "@mui/icons-material/Groups";
import CrisisAlertIcon from "@mui/icons-material/CrisisAlert";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import DEFAULT_PROFILE_ICON from "../../../assets/Landingpage_images/ProfileImage.jpg";
import { IoLogInOutline } from "react-icons/io5";
import { logout } from "../../../redux/features/authentication/authActions";

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [volunteerOpenMenu, setVolunteerOpenMenu] = useState(false);
  const [aboutUsOpenMenu, setAboutUsOpenMenu] = useState(false);
  const [profileOpenMenu, setProfileOpenMenu] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [profileIcon, setProfileIcon] = useState(DEFAULT_PROFILE_ICON);
  const { user } = useSelector((state) => state.auth);

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

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
    <nav className="bg-[#FFFFFF] sticky top-0 h-[113px] w-full z-10 shadow-m font-josefin p-4">
      <div className="flex items-center justify-between w-full px-4 h-full">
        {/* Logo aligned to the left */}
        <div
          className="flex items-center cursor-pointer"
          onClick={(e) => handleLinkClick(e, "/")}
        >
          <img src={LOGO} alt="Company Logo" className="w-[60px] h-[60px]" />
        </div>

        {/* Desktop Menu (visible only on larger screens) */}
        <div className="hidden md:flex items-center space-x-8 ml-auto">
          <div className="relative">
            <button
              onClick={(e) => handleLinkClick(e, "/")}
              // className="text-black flex items-center hover:text-gray-600 text-base"
              className="text-black hover:text-gray-600 flex items-center text-base"
            >
              <HomeOutlinedIcon className="mr-2" /> {t("Home")}
            </button>
          </div>

          {/* About Us Dropdown */}
          <div className="relative">
            <button
              onClick={handleAUMenuClick}
              className="text-black flex items-center hover:text-gray-600 text-base"
            >
              <PeopleOutlinedIcon className="mr-2" /> {t("About Us")}
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
                <MenuItem onClick={(e) => handleLinkClick(e, "/directors")}>
                  <GroupsIcon className="mr-2" /> {t("Our Team")}
                </MenuItem>
                <MenuItem onClick={(e) => handleLinkClick(e, "/our-mission")}>
                  <CrisisAlertIcon className="mr-2" /> {t("Our Mission")}
                </MenuItem>
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
              {t("Volunteer Services")}
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
                  <GroupsIcon className="mr-2" /> {t("How We Operate")}
                </MenuItem>
                <MenuItem onClick={(e) => handleLinkClick(e, "/collaborators")}>
                  <Diversity3Icon className="mr-2" /> {t("Our Collaborators")}
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
              <ContactMailOutlinedIcon className="mr-2" /> {t("Contact Us")}
            </button>
          </div>
        </div>

        {/* Donate button aligned to the rightmost */}

        <div className="ml-auto mr-3">
          <button
            onClick={(e) => handleLinkClick(e, "/donate")}
            // className="text-black flex items-center hover:text-gray-600 text-base"
            className="bg-blue-500 text-white py-2 px-6 rounded-full hover:bg-blue-600 ml-auto flex items-center"
          >
            <VolunteerActivismOutlinedIcon className="mr-2 text-base" />
            {t("Donate")}
          </button>
        </div>

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
            className="font-semibold flex flex-col items-center mr-2"
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
        <div className="md:hidden mr-4">
          <IconButton
            color="inherit"
            edge="end"
            onClick={() => toggleDrawer(true)}
            sx={{ display: { xs: "block", sm: "none" } }}
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
          <div className="block text-black py-2 flex items-center">
            <button
              onClick={(e) => handleDrawerClick(e, "/")}
              className="text-black flex items-center hover:text-blue-600"
            >
              <HomeOutlinedIcon className="mr-2" /> {t("Home")}
            </button>
          </div>

          <div className="block text-black py-2 flex items-center">
            <button
              onClick={handleAUMenuClick}
              className="text-black flex items-center hover:text-blue-600"
            >
              <PeopleOutlinedIcon className="mr-2" /> {t("About Us")}
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
                <MenuItem onClick={(e) => handleDrawerClick(e, "/directors")}>
                  <GroupsIcon className="mr-2" /> {t("Our Team")}
                </MenuItem>
                <MenuItem onClick={(e) => handleDrawerClick(e, "/vision")}>
                  <CrisisAlertIcon className="mr-2" /> {t("Our Vision")}
                </MenuItem>
              </Menu>
            )}
          </div>

          <div className="block text-black py-2 flex items-center">
            <button
              onClick={handleVSMenuClick}
              className="text-black flex items-center hover:text-blue-600"
            >
              <Diversity1OutlinedIcon className="mr-2" />
              {t("Volunteer Services")}
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
                  onClick={(e) => handleDrawerClick(e, "/how-we-operate")}
                >
                  <GroupsIcon className="mr-2" /> {t("How We Operate")}
                </MenuItem>
                <MenuItem
                  onClick={(e) => handleDrawerClick(e, "/how-we-operate")}
                >
                  <Diversity3Icon className="mr-2" /> {t("Our Collaborators")}
                </MenuItem>
              </Menu>
            )}
          </div>

          <div className="block text-black py-2 flex items-center">
            <button
              onClick={(e) => handleDrawerClick(e, "/contact")}
              className="text-black flex items-center hover:text-blue-600"
            >
              <ContactMailOutlinedIcon className="mr-2" /> {t("Contact Us")}
            </button>
          </div>

          <div className="block text-black py-2 flex items-center">
            <button
              onClick={(e) => handleDrawerClick(e, "/donate")}
              className="text-black flex items-center hover:text-blue-600"
            >
              <FavoriteBorderIcon className="mr-2" /> {t("Donate")}
            </button>
          </div>
        </div>
      </Drawer>
    </nav>
  );
};

export default Navbar;
