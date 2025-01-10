import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/Layout";
import DashboardPage from "../components/Dashboard/DashboardPage";
import Reports from "../components/Reports/ViewReports";
import ManageInventory from "../components/Inventory/ManageInventory";
import CreateOrderPage from "../components/CreateOrder/CreateNewOrder";
import UserManagement from "../components/UserManagement/ManageUsers";
import EngineerReports from "../components/Reports/ServiceEngineerReports";
import ManageClients from "../components/Supplier/ManageSupplier";

const ProtectedRoute = ({ roles }) => {
  return (
    <Layout roles={roles}>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Routes for Admin */}
        {roles === "admin" && (
          <>
            <Route path="/dashboard/view-reports" element={<Reports />} />
            <Route path="/dashboard/manage-inventory" element={<ManageInventory />} />
            <Route path="/dashboard/create-order" element={<CreateOrderPage />} />
            <Route path="/dashboard/manage-users" element={<UserManagement />} />
            <Route path="/dashboard/supplier" element={<ManageClients />} />
          </>
        )}

        {/* Routes for President */}
        {roles === "president" && (
          <Route path="/dashboard/view-reports" element={<Reports />} />
        )}

        {/* Routes for Service Engineer */}
        {roles === "service engineer" && (
          <>
            <Route path="/dashboard/view-service-engineer-reports" element={<EngineerReports />} />
          </>
        )}
      </Routes>
    </Layout>
  );
};

export default ProtectedRoute;
