import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import PaginateButton from "../CustomComponents/PaginateButton";
import CreateSupplierModal from "../Modals/CreateSupplierModal";
import { getAllSuppliers, deleteSupplier } from "../../api/supplier";

const ManageSuppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch all suppliers
  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const allSuppliers = await getAllSuppliers();
      const formattedSuppliers = allSuppliers.map((supplier) => ({
        id: supplier.id,
        name: supplier.supplier_name,
        address: `${supplier.house_number || ""}, ${supplier.street_name || ""}, ${supplier.barangay_name || ""}, ${supplier.city_name || ""}, ${supplier.region_name || ""},${supplier.province_name || ""}`,
        dateCreated: supplier.createdAt ? new Date(supplier.createdAt).toISOString().split("T")[0] : "N/A",
        status: supplier.status === "active" ? "Active" : "Inactive",
      }));
      setSuppliers(formattedSuppliers);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  const handleDeleteSupplier = async (id) => {
    if (!window.confirm("Are you sure you want to delete this supplier?")) {
      return;
    }

    try {
      await deleteSupplier(id);
      setSuppliers((prevSuppliers) => prevSuppliers.filter((supplier) => supplier.id !== id));
      alert("Supplier deleted successfully.");
    } catch (error) {
      alert("Failed to delete supplier. Please try again.");
      console.error("Error deleting supplier:", error);
    }
  };

  const paginatedSuppliers = suppliers.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalRecords = suppliers.length;
  const numberOfPages = Math.max(1, Math.ceil(totalRecords / itemsPerPage));

  return (
    <div className="min-h-screen mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Supplier Management</h1>
      <CreateSupplierModal />
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg table-fixed">
          <thead className="text-xs text-gray-500 uppercase bg-gray-100">
            <tr>
              <th className="py-3 px-6 text-left w-1/4">Name</th>
              <th className="py-3 px-6 text-center w-1/6">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedSuppliers.map((supplier) => (
              <tr key={supplier.id} className="border-b">
                <td className="py-3 px-6 truncate">{supplier.name}</td>
                <td className="py-3 px-6 text-center space-x-2">
                  <button
                    className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition duration-200"
                    onClick={() => handleDeleteSupplier(supplier.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <PaginateButton
        dataLength={totalRecords}
        numberOfPage={numberOfPages}
        setPage={setPage}
        page={page}
        data={paginatedSuppliers}
        spanCSS="flex justify-between items-center gap-x-3"
        divTailwindcss="flex justify-between items-center mt-1"
        bttnTailwindcss="bg-white border border-blue-300 px-2 gap-2 h-8 text-gray-700 rounded-md px-2 focus:shadow-outline focus:outline-none focus:ring-1 ring-blue-300 ring-offset-2"
      />
    </div>
  );
};

export default ManageSuppliers;
