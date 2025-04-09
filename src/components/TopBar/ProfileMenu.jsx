import React, { useState, useEffect } from "react";
import { LuLogOut } from "react-icons/lu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { getUserInformation } from "../../api/auth"; 
import JwtDecoder from "../../utils/jwtDecoder";

const ProfileMenu = () => {
  // State for dropdown visibility
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // State for user information
  const [userInfo, setUserInfo] = useState(null);

  // Decode the token using JwtDecoder
  const { decodedToken, isTokenValid } = JwtDecoder();

  // Extract user ID from the valid decoded token
  const userId = isTokenValid ? decodedToken?.id : null;

  // Fetch user information
  useEffect(() => {
    if (!userId) return;
  
    const fetchUserInfo = async () => {
      try {
        const data = await getUserInformation(userId);
        setUserInfo(data.data);
      } catch (error) {
        console.error("Failed to fetch user information:", error);
      }
    };
  
    fetchUserInfo();
  }, [userId]);

  // Toggle dropdown visibility
  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/"; // Redirect to sign-in page
  };

  return (
    <div className="relative block">
      {/* Profile Button */}
      <button
        className="p-2 rounded-full bg-blue-600 w-[40px] h-[40px] text-white hover:bg-blue-700 transition duration-200"
        type="button"
        aria-haspopup="true"
        aria-expanded={isMenuOpen}
        onClick={toggleMenu}
      >
        <FontAwesomeIcon icon={faUser} />
      </button>

      {/* Dropdown Menu */}
      {isMenuOpen && (
        <div
          className="absolute right-0 mt-2 w-72 rounded-md shadow-lg bg-white"
          style={{ zIndex: 2000 }}
        >
          {userInfo ? (
            <div className="pb-1" role="menu" aria-labelledby="menu">
              <p className="mb-1 text-white text-sm bg-[#0056FD] opacity-[76%] rounded-t-md py-2 px-4 font-medium tracking-wide">
                Signed in as
              </p>
              <div className="cursor-pointer block px-4 py-2">
                <span className="flex flex-col justify-start">
                  <h1 className="text-gray-600 text-lg font-medium tracking-wide">
                    {userInfo.firstname} {userInfo.middlename} {userInfo.lastname}
                  </h1>
                  <p className="text-[#979696] text-sm font-normal tracking-wide">
                    {userInfo.email}
                  </p>
                  <p className="text-gray-500 text-sm font-normal tracking-wide">
                    {userInfo.role.toUpperCase()}
                  </p>
                </span>
              </div>
              <hr />
              <button
                className="flex gap-2 justify-start items-center px-4 py-2 text-md text-gray-600 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                onClick={handleLogout}
              >
                <LuLogOut className="text-lg" />
                Logout
              </button>
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              Loading user information...
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
