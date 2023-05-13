import React, { useState, useContext, useEffect } from "react";
import { FiChevronLeft, FiChevronRight, FiSearch } from "react-icons/fi"; // Importing icons from react-icons library
import Popup from "../components/Popup";
import RegisterService from "../components/RegisterService";
import { FaEdit, FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import SidebarContext from "../context/SidebarContext";
import axios from "axios";

const Services = () => {
  const { shopName } = useContext(SidebarContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [servicesPerPage, setServicesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [services, setServices] = useState([]);
  const token = localStorage.getItem("ag_app_shop_token");
  const [modelState, setModelState] = useState(false);
  useEffect(() => {
    axios
      .get(`http://localhost:4040/services/shopname?shopName=${shopName}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setServices([...response.data.services].reverse());
        console.log(services);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [modelState]);

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filteredServices.length / servicesPerPage);
  const lastServiceIndex = currentPage * servicesPerPage;
  const firstServiceIndex = lastServiceIndex - servicesPerPage;
  const currentServices = filteredServices.slice(
    firstServiceIndex,
    lastServiceIndex
  );

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };
  const handleServicesPerPageChange = (event) => {
    setServicesPerPage(parseInt(event.target.value));
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

  async function deleteService(id) {
    console.log(id);
    await fetch(`http://localhost:4040/services/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: token,
      },
    })
      .then((response) => response.json())

      .then((data) => console.log(data));
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

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      // Select all IDs
      const allIds = currentServices.map((service) => service["_id"]);
      setSelectedIds(allIds);
    } else {
      // Deselect all IDs
      setSelectedIds([]);
    }
  };

  const handleRemoveSelected = () => {
    selectedIds.forEach((id) => {
      axios
        .delete(`http://localhost:4040/services/${id}`, {
          headers: {
            Authorization: token,
          },
        })
        .then((response) => {
          // Handle successful deletion
          console.log(`Service with ID ${id} has been deleted.`);
        })
        .catch((error) => {
          // Handle error
          console.error(`Failed to delete service with ID ${id}.`, error);
        });
    });
  };

  const [isDeleting, setDeleting] = useState(false);

  const handleCancel = () => {
    setDeleting(false);
  };

  return (
    <div className="p-6 bg-gray-200">
      <h1 className="text-2xl text-gray-800 font-bold mb-5">Services</h1>
      <div className="flex items-center relative">
        <input
          type="text"
          className="py-2 pl-8 border-b-2 border-gray-300 text-gray-700 focus:outline-none focus:border-blue-500 w-full"
          placeholder="Search by service..."
          value={searchQuery}
          onChange={handleSearchQueryChange}
        />
        <button className="absolute right-0 mr-2 focus:outline-none">
          <FiSearch className="text-gray-500" />
        </button>
      </div>

      <div className="flex items-center my-4">
        <div className="flex items-center my-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded flex items-center justify-center"
            onClick={() => setModelState(true)}
          >
            <FaPlus className="mr-2" /> New Service
          </button>
          <Popup
            isOpen={modelState}
            onClose={() => setModelState(!modelState)}
            children={<RegisterService setModelState={setModelState} />}
          />
        </div>
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
          className="border border-gray-300 rounded px-2 py-1 mr-4 text-sm"
          value={servicesPerPage}
          onChange={handleServicesPerPageChange}
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
        <span className="text-gray-600">
          {`${firstServiceIndex + 1}-${Math.min(
            lastServiceIndex,
            filteredServices.length
          )} of ${filteredServices.length}`}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border border-gray-200 divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <th className="py-3 pl-4 text-start">
                <input type="checkbox" onChange={handleSelectAll} />
              </th>
              <th className="py-3 px-4 text-left">Code</th>
              <th className="py-3 px-4 text-left">Name</th>
              {/* <th className="py-3 px-4 text-left">Speciality</th> */}
              <th className="py-3 px-4 text-left">Price</th>
              <th className="py-3 px-4 text-left">Duration</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentServices.map((service, index) => (
              <tr
                key={service.name}
                className="border-b border-gray-300 text-gray-800 text-xs"
              >
                <td className="py-2 pl-4 text-start">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(service["_id"])}
                    onChange={() => handleCheckboxChange(service["_id"])}
                  />
                </td>
                <td className="py-2 px-4">{index + 1}</td>
                <td className="py-2 px-4">{service.name}</td>
                {/* <td className="py-2 px-4">{service.speciality}</td> */}
                <td className="py-2 px-4">{service.price}</td>
                <td className="py-2 px-4">{service.duration}</td>
                <td className="py-2 text-right pr-4">
                  <button className="text-blue-500 hover:text-blue-700">
                    <FaEdit />
                  </button>
                  {/* <button
                    className="text-red-500 hover:text-red-700 ml-4"
                    onClick={() => deleteService(service["_id"])}
                  >
                    <FaTrash />
                  </button> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {services.length === 0 && (
          <div className="flex flex-col items-center justify-center w-full mt-4">
            <div className="text-center">
              <FaSearch className="mx-auto text-gray-500 text-5xl mb-4" />
              <p className="text-gray-800 text-lg mb-2">No services found</p>
              <p className="text-gray-500 text-sm">
                We couldn't find any services that match your search
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

export default Services;
