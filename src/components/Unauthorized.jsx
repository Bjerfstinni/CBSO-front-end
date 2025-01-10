import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-red-600">Unauthorized Access</h1>
      <p className="mt-4 text-gray-700">
        You do not have permission to access this page.
      </p>
      <Link
        to="/dashboard"
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Go to Dashboard
      </Link>
    </div>
  );
};

export default Unauthorized;
