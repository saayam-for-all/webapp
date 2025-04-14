import React, { useState } from "react";
import { Drawer, Menu, MenuItem, IconButton } from "@mui/material";
import LOGO from "../../../assets/logo.svg";
import { useNavigate } from "react-router-dom";

// Individual imports for outlined icons
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactMailOutlinedIcon from "@mui/icons-material/ContactMailOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Diversity1OutlinedIcon from "@mui/icons-material/Diversity1Outlined";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MenuIcon from "@mui/icons-material/Menu";
import VolunteerActivismOutlinedIcon from "@mui/icons-material/VolunteerActivismOutlined";

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [volunteerOpenMenu, setVolunteerOpenMenu] = useState(false);
  const [aboutUsOpenMenu, setAboutUsOpenMenu] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const handleLinkClick = (e, route) => {
    // Close all dropdowns
    setVolunteerOpenMenu(false);
    setAboutUsOpenMenu(false);

    navigate(route);
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

  const toggleDrawer = (open) => {
    setDrawerOpen(open);
  };

  return (
    <nav className="bg-[#FFFFFF] sticky top-0 h-[113px] w-full z-10 shadow-m font-josefin p-4">
      <div className="flex items-center justify-between w-full px-4 h-full">
        {/* Logo aligned to the left */}
        <div className="flex items-center">
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
              <HomeOutlinedIcon className="mr-2" /> Home
            </button>
          </div>

          {/* About Us Dropdown */}
          <div className="relative">
            <button
              onClick={handleAUMenuClick}
              className="text-black flex items-center hover:text-gray-600 text-base"
            >
              <PeopleOutlinedIcon className="mr-2" /> About Us
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
                  <VolunteerActivismOutlinedIcon className="mr-2" /> Our Team
                </MenuItem>
                <MenuItem onClick={(e) => handleLinkClick(e, "/vision")}>
                  <VolunteerActivismOutlinedIcon className="mr-2" /> Our Vison
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
              <PeopleOutlinedIcon className="mr-2" /> Contact Us
            </button>
          </div>

          {/* Volunteer Services Dropdown */}
          <div className="relative">
            <button
              onClick={handleVSMenuClick}
              className="text-black flex items-center hover:text-gray-600 text-base"
            >
              <Diversity1OutlinedIcon className="mr-2" /> Volunteer Services
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
                  <VolunteerActivismOutlinedIcon className="mr-2" /> How We
                  Operate
                </MenuItem>
                <MenuItem
                  onClick={(e) => handleLinkClick(e, "/how-we-operate")}
                >
                  <VolunteerActivismOutlinedIcon className="mr-2" /> Our
                  Collaborators
                </MenuItem>
              </Menu>
            )}
          </div>
        </div>

        {/* Donate button aligned to the rightmost */}

        <div className="ml-auto">
          <button
            onClick={(e) => handleLinkClick(e, "/donate")}
            // className="text-black flex items-center hover:text-gray-600 text-base"
            className="bg-blue-500 text-white py-2 px-6 rounded-full hover:bg-blue-600 ml-auto flex items-center"
          >
            <VolunteerActivismOutlinedIcon className="mr-2 text-base" /> Donate
          </button>
        </div>

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
              <HomeOutlinedIcon className="mr-2" /> Home
            </button>
          </div>
          {/* <a
            href="#home"
            className="block text-black py-2 flex items-center"
            onClick={() => toggleDrawer(false)}
          >
            <HomeOutlinedIcon className="mr-2" /> Home
          </a> */}
          <div className="block text-black py-2 flex items-center">
            <button
              onClick={handleAUMenuClick}
              className="text-black flex items-center hover:text-blue-600"
            >
              <PeopleOutlinedIcon className="mr-2" /> About Us
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
                  <VolunteerActivismOutlinedIcon className="mr-2" /> Our Team
                </MenuItem>
                <MenuItem onClick={(e) => handleDrawerClick(e, "/vision")}>
                  <VolunteerActivismOutlinedIcon className="mr-2" /> Our Vison
                </MenuItem>
              </Menu>
            )}
          </div>
          {/* <a
            href="#about-us"
            className="block text-black py-2 flex items-center"
            onClick={() => toggleDrawer(false)}
          >
            <PeopleOutlinedIcon className="mr-2" /> About Us
          </a> */}
          <div className="block text-black py-2 flex items-center">
            <button
              onClick={(e) => handleDrawerClick(e, "/contact")}
              className="text-black flex items-center hover:text-blue-600"
            >
              <ContactMailOutlinedIcon className="mr-2" /> Contact Us
            </button>
          </div>
          {/* <a
            href="#contact-us"
            className="block text-black py-2 flex items-center"
            onClick={() => toggleDrawer(false)}
          >
            <ContactMailOutlinedIcon className="mr-2" /> Contact Us
          </a> */}
          <div className="block text-black py-2 flex items-center">
            <button
              onClick={handleVSMenuClick}
              className="text-black flex items-center hover:text-blue-600"
            >
              <Diversity1OutlinedIcon className="mr-2" /> Volunteer Services
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
                  <VolunteerActivismOutlinedIcon className="mr-2" /> How We
                  Operate
                </MenuItem>
                <MenuItem
                  onClick={(e) => handleDrawerClick(e, "/how-we-operate")}
                >
                  <VolunteerActivismOutlinedIcon className="mr-2" /> Our
                  Collaborators
                </MenuItem>
              </Menu>
            )}
          </div>
          {/* <a
            href="#volunteer-services"
            className="block text-black py-2 flex items-center"
            onClick={() => toggleDrawer(false)}
          >
            <Diversity1OutlinedIcon className="mr-2" /> Volunteer Services
          </a> */}
          <div className="block text-black py-2 flex items-center">
            <button
              onClick={(e) => handleDrawerClick(e, "/donate")}
              className="text-black flex items-center hover:text-blue-600"
            >
              <FavoriteBorderIcon className="mr-2" /> Donate
            </button>
          </div>
        </div>
      </Drawer>
    </nav>
  );
};

export default Navbar;
