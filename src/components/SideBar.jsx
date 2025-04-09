import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faChartLine, faHistory, faBoxes, faUsers, faHouse, faCube } from '@fortawesome/free-solid-svg-icons';

const SideBar = ({ roles }) => {
  return (
    <div className="h-screen w-60 bg-indigo-950 text-white flex flex-col fixed">
      <div className="flex items-center justify-center h-16 border-b border-white-700">
      <h1 className="text-2xl font-semibold text-orange-400">Menu</h1>
      </div>
      <nav className="flex-grow p-4">
        <ul>
          <li className="mb-4">
            <NavLink
              to="/dashboard"
              className="block p-2 rounded hover:bg-gray-700 flex items-center"
            >
              <FontAwesomeIcon icon={faHouse} className="mr-2" /> Dashboard
            </NavLink>
          </li>

          {/* Admin-specific menu items */}
          {roles === "admin" && (
            <>
              <li className="mb-4">
                <NavLink
                  to="/dashboard/create-order"
                  className="block p-2 rounded hover:bg-gray-700 flex items-center"
                >
                  <FontAwesomeIcon icon={faShoppingCart} className="mr-2" /> Create New Order
                </NavLink>
              </li>
              <li className="mb-4">
                <NavLink
                  to="/dashboard/manage-inventory"
                  className="block p-2 rounded hover:bg-gray-700 flex items-center"
                >
                  <FontAwesomeIcon icon={faBoxes} className="mr-2" /> Manage Inventory
                </NavLink>
              </li>
              <li className="mb-4">
                <NavLink
                  to="/dashboard/manage-users"
                  className="block p-2 rounded hover:bg-gray-700 flex items-center"
                >
                  <FontAwesomeIcon icon={faUsers} className="mr-2" /> Manage Users
                </NavLink>
              </li>
              <li className="mb-4">
                <NavLink
                  to="/dashboard/supplier"
                  className="block p-2 rounded hover:bg-gray-700 flex items-center"
                >
                  <FontAwesomeIcon icon={faCube} className="mr-2" /> Suppliers
                </NavLink>
              </li>
              <li className="mb-4">
                <NavLink
                  to="/dashboard/low-stocks"
                  className="block p-2 rounded hover:bg-gray-700 flex items-center"
                >
                  <FontAwesomeIcon icon={faCube} className="mr-2" /> Low Stocks
                </NavLink>
              </li>
              <li className="mb-4">
                <NavLink
                  to="/dashboard/out-of-stocks"
                  className="block p-2 rounded hover:bg-gray-700 flex items-center"
                >
                  <FontAwesomeIcon icon={faCube} className="mr-2" /> Out of Stocks
                </NavLink>
              </li>
            </>
          )}

          {/* Menu items for roles with report access */}
          {(roles === "admin" || roles === "president") && (
            <li className="mb-4">
              <NavLink
                to="/dashboard/view-reports"
                className="block p-2 rounded hover:bg-gray-700 flex items-center"
              >
                <FontAwesomeIcon icon={faChartLine} className="mr-2" /> View Reports
              </NavLink>
            </li>
          )}
          {(roles === "service engineer") && (
            <li className="mb-4">
              <NavLink
                to="/dashboard/view-service-engineer-reports"
                className="block p-2 rounded hover:bg-gray-700 flex items-center"
              >
                <FontAwesomeIcon icon={faChartLine} className="mr-2" /> View Reports
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default SideBar;
