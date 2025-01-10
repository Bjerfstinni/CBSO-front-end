import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "../components/Login/LoginPage";
const UnProtectedRoute = () => {
  return (
    <Routes>
        <Route path="/" element={<LoginPage />} />
    </Routes>
  )
}


export default UnProtectedRoute;
