import React, { useState, useContext, useEffect } from "react";
import { FiChevronLeft, FiChevronRight, FiSearch } from "react-icons/fi"; // Importing icons from react-icons library
import RegisterCustomer from "./components/RegisterCustomer";
import Popup from "../../components/Popup";
import { FaEdit, FaPlus, FaSearch } from "react-icons/fa";
import axios from "axios";
import UpdateCustomer from "./components/UpdateCustomer";
import { SidebarContext } from "../../context/SidebarContext";
import { DarkModeContext } from "../../context/DarkModeContext";
import apiProvider from "../../axiosConfig/axiosConfig";

const Clients = () => {
  const { shopId } = useContext(SidebarContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [clientsPerPage, setClientsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [clients, setClients] = useState([]);
  const [registerModelState, setRegisterModelState] = useState(false);
  const [updateModelState, setUpdateModelState] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [isDeleting, setDeleting] = useState(false);
  const { isDarkMode } = useContext(DarkModeContext);

  const token = localStorage.getItem("ag_app_shop_token");
  useEffect(() => {
    apiProvider
      .get(`customers/shop?shopId=${shopId}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setClients([...response.data].reverse());
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, [registerModelState, updateModelState, isDeleting]);

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filteredClients.length / clientsPerPage);
  const lastClientIndex = currentPage * clientsPerPage;
  const firstClientIndex = lastClientIndex - clientsPerPage;
  const currentClients = filteredClients.slice(
    firstClientIndex,
    lastClientIndex
  );

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };
  const handleClientsPerPageChange = (event) => {
    setClientsPerPage(parseInt(event.target.value));
    setCurrentPage(1);
  };
  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const pagination = [];
  for (let i = 1; i <= totalPages; i++) {
    pagination.push(
      <button
        key={i}
        className={`${
          currentPage === i
            ? "bg-gray-200 text-gray-700"
            : "bg-gray-100 text-gray-600"
        } px-4 py-2 mx-1 rounded-md`}
        onClick={() => handlePageClick(i)}
      >
        {i}
      </button>
    );
  }

  const [selectedIds, setSelectedIds] = useState([]);

  const handleCheckboxChange = (id) => {
    setSelectedIds((prevSelectedIds) => {
      if (prevSelectedIds.includes(id)) {
        // ID already exists, remove it from the array
        return prevSelectedIds.filter((selectedId) => selectedId !== id);
      } else {
        // ID doesn't exist, add it to the array
        return [...prevSelectedIds, id];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.length === currentClients.length) {
      // All IDs are selected, deselect all IDs
      setSelectedIds([]);
    } else {
      // Not all IDs are selected, select all IDs
      const allIds = currentClients.map((client) => client._id);
      setSelectedIds(allIds);
    }
  };

  const handleRemoveSelected = () => {
    selectedIds.forEach((id) => {
      apiProvider
        .delete(`customers/${id}`, {
          headers: {
            Authorization: token,
          },
        })
        .then((response) => {
          // Handle successful deletion
          setDeleting(false);
        })
        .catch((error) => {
          // Handle error
          console.error(`Failed to delete customer with ID ${id}.`, error);
        });
    });
  };

  const handleCancel = () => {
    setDeleting(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-5">Customers</h1>
      <div className="flex items-center relative">
        <input
          type="text"
          className={`py-2 pl-8 border-b-2  text-gray-800 border-gray-300 focus:outline-none focus:border-blue-500 w-full ${
            isDarkMode ? "bg-gray-500" : "bg-gray-100"
          }`}
          placeholder="Search clients..."
          value={searchQuery}
          onChange={handleSearchQueryChange}
        />
        <button className={`absolute right-0 mr-2 focus:outline-none`}>
          <FiSearch />
        </button>
      </div>

      <div className="flex items-center my-4">
        <button
          className={` ${
            isDarkMode
              ? "bg-gray-500 hover:bg-gray-400 text-gray-800"
              : "bg-gray-800 hover:bg-gray-600 text-gray-200"
          } text-sm font-semibold py-2 px-4 rounded flex items-center justify-center`}
          onClick={() => {
            setRegisterModelState(true);
          }}
        >
          <FaPlus className="mr-2" />
          Client
        </button>
        <Popup
          isOpen={registerModelState}
          onClose={() => setRegisterModelState(!registerModelState)}
          children={<RegisterCustomer setModelState={setRegisterModelState} />}
        />

        <button
          className={`ml-2 ${
            selectedIds.length === 0
              ? "bg-red-400"
              : "bg-red-500 hover:bg-red-700"
          } text-white text-sm font-semibold py-2 px-4 rounded`}
          onClick={() => setDeleting(true)}
          disabled={selectedIds.length === 0}
        >
          Remove Selected
        </button>
        <Popup
          isOpen={isDeleting}
          onClose={() => setDeleting(!isDeleting)}
          children={
            <div className="bg-white rounded-md p-4 flex justify-center items-center">
              <p className="text-gray-700">
                Are you sure you want to delete the selected items?
              </p>
              <div className="flex mt-4">
                <button
                  className="ml-2 bg-red-500 hover:bg-red-700 text-white text-sm font-semibold py-2 px-4 rounded"
                  onClick={handleRemoveSelected}
                >
                  Confirm
                </button>
                <button
                  className="ml-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-semibold py-2 px-4 rounded"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </div>
          }
        />
      </div>
      <div className="mb-6">
        <label htmlFor="clients-per-page" className="mr-4 font-medium text-sm">
          Show:
        </label>
        <select
          id="clients-per-page"
          className={`border border-gray-300 rounded px-2 py-1 mr-4 text-sm ${
            isDarkMode
              ? "bg-gray-500 text-gray-800"
              : "bg-gray-50 text-gray-500"
          }`}
          value={clientsPerPage}
          onChange={handleClientsPerPageChange}
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
        <span className="text-gray-600">
          {`${firstClientIndex + 1}-${Math.min(
            lastClientIndex,
            filteredClients.length
          )} of ${filteredClients.length}`}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table
          className={`w-full table-auto border ${
            isDarkMode
              ? "border-gray-700 divide-gray-700"
              : "border-gray-200 divide-gray-200"
          }`}
        >
          <thead>
            <tr
              className={`text-xs uppercase tracking-wider ${
                isDarkMode
                  ? "bg-gray-500 text-gray-800"
                  : "bg-gray-50 text-gray-500"
              }`}
            >
              <th className="py-3 pl-4 text-left">
                <input
                  type="checkbox"
                  checked={selectedIds.length === currentClients.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 text-left">Phone</th>
              <th className="py-3 text-left">Payments $</th>
              <th className="py-3 pr-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody
            className={`divide-y ${
              isDarkMode ? "bg-gray-700 text-gray-200" : "bg-white"
            }`}
          >
            {currentClients.map((client) => (
              <tr
                key={client.name}
                className="border-b border-gray-300  text-xs"
              >
                <td className="py-2 ps-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(client._id)}
                    onChange={() => handleCheckboxChange(client._id)}
                  />
                </td>
                <td className="py-2 px-3 text-left">{client.name}</td>
                <td className="py-2">{client.phone}</td>
                <td className="py-2">{client.payments.toFixed(2) || 0}</td>
                <td className="py-2 pr-6 text-center">
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => {
                      setUpdateModelState(!updateModelState);
                      setSelectedClientId(client._id);
                    }}
                  >
                    <FaEdit />
                  </button>
                  <Popup
                    isOpen={updateModelState}
                    onClose={() => setUpdateModelState(!updateModelState)}
                    children={
                      <UpdateCustomer
                        setModelState={setUpdateModelState}
                        customerId={selectedClientId}
                      />
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {clients.length === 0 && (
          <div className="flex flex-col items-center justify-center w-full mt-4">
            <div className="text-center">
              <FaSearch className="mx-auto text-gray-500 text-5xl mb-4" />
              <p className="text-gray-800 text-lg mb-2">No clients found</p>
              <p className="text-gray-500 text-sm">
                We couldn't find any clients that match your search
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-center mt-6">
        <div className="flex">
          <button
            className={`${
              currentPage === 1
                ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                : "bg-gray-100 text-gray-600 hover:bg-gray-300"
            } px-4 py-2 mx-1 rounded-md`}
            onClick={() => handlePageClick(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <FiChevronLeft />
          </button>
          {pagination}
          <button
            className={`${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                : "bg-gray-100 text-gray-600 hover:bg-gray-300"
            } px-4 py-2 mx-1 rounded-md`}
            onClick={() => handlePageClick(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <FiChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Clients;
