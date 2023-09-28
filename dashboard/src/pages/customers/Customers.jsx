import React, { useState, useContext, useEffect } from "react";
import { FiChevronLeft, FiChevronRight, FiSearch } from "react-icons/fi"; // Importing icons from react-icons library
import RegisterCustomer from "./components/RegisterCustomer";
import Popup from "../../components/Popup";
import { FaEdit, FaPlus, FaSearch, FaUsers } from "react-icons/fa";
import UpdateCustomer from "./components/UpdateCustomer";
import { SidebarContext } from "../../context/SidebarContext";
import { DarkModeContext } from "../../context/DarkModeContext";
import instance from "../../axiosConfig/axiosConfig";
import Drawer from "../../components/Drawer";
import {
  AddButton,
  RemoveSelectedButton,
  titleDarkStyle,
  titleLightStyle,
} from "../../components/Styled";
import CustomerCard from "./components/CustomerCard";

const Customers = () => {
  const { shopId } = useContext(SidebarContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [customersPerPage, setCustomersPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [customers, setCustomers] = useState([]);
  const [registerModelState, setRegisterModelState] = useState(false);
  const [updateModelState, setUpdateModelState] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [isDeleting, setDeleting] = useState(false);
  const { isDarkMode } = useContext(DarkModeContext);
  const [view, setView] = useState("table");

  const token = localStorage.getItem("ag_app_shop_token");
  useEffect(() => {
    instance
      .get(`customers/shop?shopId=${shopId}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setCustomers([...response.data].reverse());
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, [registerModelState, updateModelState, isDeleting]);

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);
  const lastCustomerIndex = currentPage * customersPerPage;
  const firstCustomerIndex = lastCustomerIndex - customersPerPage;
  const currentCustomers = filteredCustomers.slice(
    firstCustomerIndex,
    lastCustomerIndex
  );

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };
  const handleCustomersPerPageChange = (event) => {
    setCustomersPerPage(parseInt(event.target.value));
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
    if (selectedIds.length === currentCustomers.length) {
      // All IDs are selected, deselect all IDs
      setSelectedIds([]);
    } else {
      // Not all IDs are selected, select all IDs
      const allIds = currentCustomers.map((customer) => customer._id);
      setSelectedIds(allIds);
    }
  };

  const handleRemoveSelected = () => {
    selectedIds.forEach((id) => {
      instance
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

  const handleCustomerActiveState = () => {};

  const handleSelectCustomer = (profId) => {
    if (selectedIds.includes(profId)) {
      const filteredIds = selectedIds.filter(
        (selectedId) => selectedId !== profId
      );
      setSelectedIds(filteredIds);
    } else {
      setSelectedIds((prev) => [...prev, profId]);
    }
  };

  return (
    <>
      <Drawer
        modelState={updateModelState}
        setModelState={() => setUpdateModelState(!updateModelState)}
        title={"Update Customer"}
        children={
          <UpdateCustomer
            setModelState={setUpdateModelState}
            customerId={selectedCustomerId}
          />
        }
      />
      <div className="p-6 overflow-y-auto h-full">
        <div className={isDarkMode ? titleDarkStyle : titleLightStyle}>
          <div className="flex items-center justify-center">
            <FaUsers className="mr-2 text-xl" /> {/* Add the user tie icon */}
            <span>Customers</span>
          </div>
        </div>

        <div className="relative w-full">
          <label className="sr-only" htmlFor="search">
            {" "}
            Search{" "}
          </label>

          <input
            className="h-10 w-full rounded-lg border-none bg-white pe-10 ps-4 text-sm shadow-sm outline-teal-600"
            id="search"
            type="search"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={handleSearchQueryChange}
          />

          <span className="absolute end-1 top-1/2 -translate-y-1/2 rounded-md bg-gray-100 p-2 text-gray-600 transition hover:text-gray-700">
            <span className="sr-only">Search</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
        </div>
        <div className="flex items-center my-4">
          <AddButton
            onClick={() => {
              setRegisterModelState(true);
            }}
          />

          <Drawer
            modelState={registerModelState}
            setModelState={() => setRegisterModelState(!registerModelState)}
            title={"Register Customer"}
            children={
              <RegisterCustomer setModelState={setRegisterModelState} />
            }
          />

          <RemoveSelectedButton
            onClick={() => setDeleting(true)}
            disabled={selectedIds.length === 0}
          />
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
        <div className="flex justify-between items-center">
          <div className="mb-6">
            <label
              htmlFor="customers-per-page"
              className="mr-4 font-medium text-sm"
            >
              Show:
            </label>
            <select
              id="customers-per-page"
              className={`border border-gray-300 rounded px-2 py-1 mr-4 text-sm ${
                isDarkMode
                  ? "bg-gray-500 text-white"
                  : "bg-gray-50 text-gray-500"
              }`}
              value={customersPerPage}
              onChange={handleCustomersPerPageChange}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span className={`${isDarkMode ? "text-white" : "text-gray-600"}`}>
              {`${firstCustomerIndex + 1}-${Math.min(
                lastCustomerIndex,
                filteredCustomers.length
              )} of ${filteredCustomers.length}`}
            </span>
          </div>
          <div className="flex rounded shadow">
            <button
              className={`inline-flex h-10 w-10 items-center justify-center rounded-l ${
                isDarkMode
                  ? view === "cards"
                    ? "bg-teal-600 text-white"
                    : "bg-gray-800 text-white"
                  : view === "cards"
                  ? "bg-teal-100 text-gray-600"
                  : "bg-white text-gray-600"
              } transition hover:bg-gray-50 hover:text-gray-700`}
              onClick={() => setView("cards")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
                />
              </svg>
            </button>

            <button
              className={`inline-flex h-10 w-10 items-center justify-center rounded-r ${
                isDarkMode
                  ? view === "table"
                    ? "bg-teal-600 text-white"
                    : "bg-gray-800 text-white"
                  : view === "table"
                  ? "bg-teal-100 text-gray-600"
                  : "bg-white text-gray-600"
              } transition hover:bg-gray-50 hover:text-gray-700`}
              onClick={() => setView("table")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          {view === "table" ? (
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
                      checked={selectedIds.length === currentCustomers.length}
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
                {currentCustomers.map((customer) => (
                  <tr
                    key={customer.name}
                    className="border-b border-gray-300  text-xs"
                  >
                    <td className="py-2 ps-4 text-left">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(customer._id)}
                        onChange={() => handleCheckboxChange(customer._id)}
                      />
                    </td>
                    <td className="py-2 px-3 text-left">{customer.name}</td>
                    <td className="py-2">{customer.phone}</td>
                    <td className="py-2">
                      {customer.payments.toFixed(2) || 0}
                    </td>
                    <td className="py-2 pr-6 text-center">
                      <button
                        className="text-teal-500 hover:text-teal-700"
                        onClick={() => {
                          setUpdateModelState(!updateModelState);
                          setSelectedCustomerId(customer._id);
                        }}
                      >
                        <FaEdit />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <>
              <div
                className={`w-full ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                } mb-2 py-2 pl-4 flex justify-start items-center rounded-md shadow`}
              >
                <label className="font-semibold mr-2">Select All</label>
                <input
                  type="checkbox"
                  checked={selectedIds.length === currentCustomers.length}
                  onChange={handleSelectAll}
                />
              </div>
              <div className="flex flex-wrap gap-3">
                {currentCustomers.map((customer, index) => {
                  return (
                    <button
                      key={[customer._id]}
                      onClick={() => handleSelectCustomer(customer._id)}
                    >
                      <CustomerCard
                        key={customer._id}
                        customer={customer}
                        selectedIds={selectedIds}
                        handleCheckboxChange={handleCheckboxChange}
                        handleProfessionalActiveState={
                          handleCustomerActiveState
                        }
                        updateModelState={updateModelState}
                        setUpdateModelState={setUpdateModelState}
                        setSelectiedCustomerId={setSelectedCustomerId}
                      />
                    </button>
                  );
                })}
              </div>
            </>
          )}
          {customers.length === 0 && (
            <div className="flex flex-col items-center justify-center w-full mt-4">
              <div className="text-center">
                <FaSearch className="mx-auto text-gray-500 text-5xl mb-4" />
                <p className="text-gray-800 text-lg mb-2">No customers found</p>
                <p className="text-gray-500 text-sm">
                  We couldn't find any customers that match your search
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end mt-6">
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
    </>
  );
};

export default Customers;
