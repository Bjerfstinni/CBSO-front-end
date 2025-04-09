import React from "react";
import logoImage from "../../assets/logo1.png";
import ProfileMenu from "./ProfileMenu"; // Import the ProfileMenu component

const NavBar = () => {
  return (
    <div className="flex justify-between items-center p-4 bg-white shadow-md">
      {/* Left side - Logo */}
      <div className="flex items-center">
        <img src={logoImage} alt="logo" className="h-10 w-50 mr-4" /> {/* Adjust the size as needed */}
      </div>

      {/* Right side - Profile Menu */}
      <div className="flex items-center space-x-4">
        <ProfileMenu />
      </div>
    </div>
  );
};

export default NavBar;
