import React, { useState, useContext, useEffect } from "react";
import { FiChevronLeft, FiChevronRight, FiSearch } from "react-icons/fi"; // Importing icons from react-icons library
import Popup from "../components/Popup";
import RegisterProfessional from "../components/RegisterProfessional";
import { FaEdit, FaPlus, FaSearch } from "react-icons/fa";
import SidebarContext from "../context/SidebarContext";
import axios from "axios";
import UpdateProfessional from "../components/UpdateProfessional";

const Professionals = () => {
  const { shopName } = useContext(SidebarContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [professionalsPerPage, setProfessionalsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [professionals, setProfessionals] = useState([]);
  const token = localStorage.getItem("ag_app_shop_token");
  const [registerModelState, setRegisterModelState] = useState(false);
  const [updateModelState, setUpdateModelState] = useState(false);
  const [selectiedProfessionalId, setSelectiedProfessionalId] = useState("");

  useEffect(() => {
    axios
      .get(
        `http://localhost:4040/professionals/shopname?shopName=${shopName}`,
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((response) => setProfessionals([...response.data.data].reverse()))
      .catch((error) => console.error(error.message));
  }, [registerModelState, updateModelState]);

  const filteredProfessionals = professionals.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(
    filteredProfessionals.length / professionalsPerPage
  );
  const lastProfessionalIndex = currentPage * professionalsPerPage;
  const firstProfessionalIndex = lastProfessionalIndex - professionalsPerPage;
  const currentProfessionals = filteredProfessionals.slice(
    firstProfessionalIndex,
    lastProfessionalIndex
  );

  const handleProfessionalsPerPageChange = (event) => {
    setProfessionalsPerPage(parseInt(event.target.value));
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
    if (selectedIds.length === currentProfessionals.length) {
      // All IDs are selected, deselect all IDs
      setSelectedIds([]);
    } else {
      // Not all IDs are selected, select all IDs
      const allIds = currentProfessionals.map(
        (professional) => professional.id
      );
      setSelectedIds(allIds);
    }
  };

  const handleRemoveSelected = () => {
    selectedIds.forEach((id) => {
      axios
        .delete(`http://localhost:4040/professionals/${id}`, {
          headers: {
            Authorization: token,
          },
        })
        .then((response) => {
          // Handle successful deletion
          console.log(`Professional with ID ${id} has been deleted.`);
        })
        .catch((error) => {
          // Handle error
          console.error(`Failed to delete professional with ID ${id}.`, error);
        });
    });
  };

  const [isDeleting, setDeleting] = useState(false);

  const handleCancel = () => {
    setDeleting(false);
  };

  const handleProfessionalActiveState = () => {};

  return (
    <div className="p-6 bg-gray-200">
      <h1 className="text-2xl text-gray-800 font-bold mb-5">Professionals</h1>
      <div className="flex items-center my-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded flex items-center justify-center"
          onClick={() => setRegisterModelState(true)}
        >
          <FaPlus className="mr-2" /> Professional
        </button>
        <Popup
          isOpen={registerModelState}
          onClose={() => setRegisterModelState(!registerModelState)}
          children={
            <RegisterProfessional setModelState={setRegisterModelState} />
          }
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
          className="border border-gray-300 rounded px-2 py-1 mr-4 text-sm"
          value={professionalsPerPage}
          onChange={handleProfessionalsPerPageChange}
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
        <span className="text-gray-600">
          {`${firstProfessionalIndex + 1}-${Math.min(
            lastProfessionalIndex,
            filteredProfessionals.length
          )} of ${filteredProfessionals.length}`}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border border-gray-200 divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <th className="py-3 pl-2 text-center">
                <input
                  type="checkbox"
                  checked={selectedIds.length === currentProfessionals.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="py-3 text-left">ID</th>
              <th className="py-3 text-left">Name</th>
              <th className="py-3 text-left">Office Hours</th>
              <th className="py-3 pr-6 text-left">Description</th>
              <th className="py-3 pr-6 text-right">Activated?</th>
              <th className="py-3 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentProfessionals.map((professional, index) => (
              <tr
                key={professional.name}
                className="border-b border-gray-300 text-gray-800 text-xs"
              >
                <td className="py-2 ps-2 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(professional.id)}
                    onChange={() => handleCheckboxChange(professional.id)}
                  />
                </td>
                <td className="py-2">{index + 1}</td>
                <td className="py-2">{professional.name}</td>
                <td className="py-2">{professional.officeHours}</td>
                <td className="py-2">{professional.description}</td>
                <td className="py-2 pr-6 text-center">
                  {/* {professional.activated ? "active" : "inactive"} */}
                  <div className="flex justify-center items-center">
                    <input
                      type="checkbox"
                      id="switch"
                      checked={professional.activated}
                      onChange={handleProfessionalActiveState}
                      className="hidden"
                    />
                    <label
                      htmlFor="switch"
                      className={`relative flex items-center justify-between w-8 h-4 rounded-full cursor-pointer ${
                        professional.activated ? "bg-green-400" : "bg-gray-400"
                      }`}
                    >
                      <span
                        className={`absolute left-0 bg-gray-100 transition-all duration-300 ease-in-out w-4 h-4 rounded-full shadow-md transform ${
                          !professional.activated
                            ? "translate-x-full"
                            : "translate-x-0"
                        }`}
                      ></span>
                    </label>
                  </div>
                </td>
                <td className="py-2 text-center pr-4">
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => {
                      setUpdateModelState(!updateModelState);
                      setSelectiedProfessionalId(professional._id);
                    }}
                  >
                    <FaEdit />
                  </button>
                  <Popup
                    isOpen={updateModelState}
                    onClose={() => setUpdateModelState(!updateModelState)}
                    children={
                      <UpdateProfessional
                        setModelState={setUpdateModelState}
                        professionalId={selectiedProfessionalId}
                      />
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {professionals.length === 0 && (
          <div className="flex flex-col items-center justify-center w-full mt-4">
            <div className="text-center">
              <FaSearch className="mx-auto text-gray-500 text-5xl mb-4" />
              <p className="text-gray-800 text-lg mb-2">
                No professionals found
              </p>
              <p className="text-gray-500 text-sm">
                We couldn't find any professionals that match your search
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

export default Professionals;
