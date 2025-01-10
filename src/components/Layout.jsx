import React from 'react';
import Sidebar from './SideBar';  
import NavBar from './TopBar/NavBar';  
import { Outlet } from 'react-router-dom';

const Layout = ({children, roles}) => {

  return (
    <div className="flex h-screen">
      <Sidebar roles={roles}/>
      <div className="flex-grow bg-gray-100 flex flex-col ml-60"> {/* Adjusted here */}
        <NavBar />
        <main className='flex-grow px-4 py-4 overflow-y-auto bg-gray-200'>
          {children}
        </main>
        <footer>
          <h1 className='text-sm bg-white py-2 border-t text-center text-gray-700'>
            ©2024 | Carewell Biomedical Inventory System
          </h1>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
