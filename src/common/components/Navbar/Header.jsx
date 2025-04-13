import React, { useState } from "react";
import { Drawer, Menu, MenuItem, IconButton } from "@mui/material";
import LOGO from "../../../assets/logo.svg";

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
  const [openMenu, setOpenMenu] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpenMenu(true);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setOpenMenu(false);
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
          <a
            href="#home"
            className="text-black hover:text-gray-600 flex items-center text-base"
          >
            <HomeOutlinedIcon className="mr-2" /> Home
          </a>
          <a
            href="#about-us"
            className="text-black hover:text-gray-600 flex items-center text-base"
          >
            <PeopleOutlinedIcon className="mr-2" /> About Us
          </a>
          <a
            href="#contact-us"
            className="text-black hover:text-gray-600 flex items-center text-base"
          >
            <ContactMailOutlinedIcon className="mr-2" /> Contact Us
          </a>

          {/* Volunteer Services Dropdown */}
          <div className="relative">
            <button
              onClick={handleMenuClick}
              className="text-black flex items-center hover:text-gray-600 text-base"
            >
              <Diversity1OutlinedIcon className="mr-2" /> Volunteer Services
              <ArrowDropDownIcon />
            </button>
            {openMenu && (
              <Menu
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleMenuClose}
                PaperProps={{
                  style: {
                    position: "absolute",
                    right: 0,
                    top: "40px",
                    zIndex: 1300, // to appear above other elements
                  },
                }}
              >
                <MenuItem onClick={handleMenuClose}>
                  <VolunteerActivismOutlinedIcon className="mr-2" /> Volunteer
                  Option 1
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <VolunteerActivismOutlinedIcon className="mr-2" /> Volunteer
                  Option 2
                </MenuItem>
              </Menu>
            )}
          </div>
        </div>

        {/* Donate button aligned to the rightmost */}
        <a
          href="#donate"
          className="bg-blue-500 text-white py-2 px-6 rounded-full hover:bg-blue-600 ml-auto flex items-center"
        >
          <VolunteerActivismOutlinedIcon className="mr-2 text-base" /> Donate
        </a>

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
          <a
            href="#home"
            className="block text-black py-2 flex items-center"
            onClick={() => toggleDrawer(false)}
          >
            <HomeOutlinedIcon className="mr-2" /> Home
          </a>
          <a
            href="#about-us"
            className="block text-black py-2 flex items-center"
            onClick={() => toggleDrawer(false)}
          >
            <PeopleOutlinedIcon className="mr-2" /> About Us
          </a>
          <a
            href="#contact-us"
            className="block text-black py-2 flex items-center"
            onClick={() => toggleDrawer(false)}
          >
            <ContactMailOutlinedIcon className="mr-2" /> Contact Us
          </a>
          <a
            href="#volunteer-services"
            className="block text-black py-2 flex items-center"
            onClick={() => toggleDrawer(false)}
          >
            <Diversity1OutlinedIcon className="mr-2" /> Volunteer Services
          </a>
          <a
            href="#donate"
            className="block text-black py-2 flex items-center"
            onClick={() => toggleDrawer(false)}
          >
            <FavoriteBorderIcon className="mr-2" /> Donate
          </a>
        </div>
      </Drawer>
    </nav>
  );
};

export default Navbar;
