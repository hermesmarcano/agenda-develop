import React, { useState, useEffect } from "react";
import { Table, Tbody, Tr, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { FaStore, FaUsers, FaMoneyBillWave } from "react-icons/fa";
import axios from "axios";
import Popup from "../components/Popup";

const DashboardHome = () => {
  const [shops, setShops] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState(0);
  const [payments, setPayments] = useState([]);
  const [modelState, setModelState] = useState(false);
  const [selectedShops, setSelectedShops] = useState([]);
  const [customersPerShop, setCustomersPerShop] = useState([]);
  const [paymentsPerShop, setPaymentsPerShop] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("ag_app_admin_token");
        if (!token) {
          console.error("Token not found");
          return;
        }

        const [shopsResponse, customersResponse, paymentsResponse] =
          await Promise.all([
            axios.get("http://localhost:4040/admin/shops", {
              headers: {
                Authorization: token,
              },
            }),
            axios.get("http://localhost:4040/admin/customers", {
              headers: {
                Authorization: token,
              },
            }),
            axios.get("http://localhost:4040/admin/payments", {
              headers: {
                Authorization: token,
              },
            }),
          ]);

        console.log(shopsResponse.data);
        setShops(shopsResponse.data);
        setCustomers(customersResponse.data.customers);
        setPayments(paymentsResponse.data.payments);

        const customersPShop = shopsResponse.data.map((shop) => {
          const matchingCustomers = customersResponse.data.customers.filter(
            (customer) => customer.managerId === shop._id
          );
          return {
            shopName: shop.shopName,
            customerCount: matchingCustomers.length,
          };
        });
        setCustomersPerShop(customersPShop);

        const sum = paymentsResponse.data.payments.reduce(
          (acc, item) => acc + item.amount,
          0
        );
        setTransactions(sum);

        const paymentsPShop = shopsResponse.data.map((shop) => {
          const matchingPayments = paymentsResponse.data.payments.filter(
            (payment) => payment.managerId === shop._id
          );
          const paymentCount = matchingPayments.reduce(
            (acc, item) => acc + item.amount,
            0
          );
          return {
            shopName: shop.shopName,
            paymentCount,
          };
        });
        setPaymentsPerShop(paymentsPShop);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  const handleDeleteShop = async (shopId) => {
    const token = localStorage.getItem("ag_app_admin_token");
    try {
      await axios.delete(`http://localhost:4040/admin/shops/${shopId}`, {
        headers: {
          Authorization: token,
        },
      });
      // Remove the deleted shop from the state
      setShops((prevShops) => prevShops.filter((shop) => shop._id !== shopId));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSelectShop = (shopId) => {
    if (selectedShops.includes(shopId)) {
      setSelectedShops((prevSelectedShops) =>
        prevSelectedShops.filter((id) => id !== shopId)
      );
    } else {
      setSelectedShops((prevSelectedShops) => [...prevSelectedShops, shopId]);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedShops.length === 0) return;
    for (const shopId of selectedShops) {
      await handleDeleteShop(shopId);
    }
    setSelectedShops([]);
  };

  const handleSelectAll = () => {
    if (selectedShops.length === shops.length) {
      setSelectedShops([]);
    } else {
      const allShopIds = shops.map((shop) => shop._id);
      setSelectedShops(allShopIds);
    }
  };

  const handleCancelDelete = () => {
    setModelState(false);
    setSelectedShops([]);
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const filteredShops = shops.filter((shop) => {
    if (searchTerm === "") {
      return shop;
    } else if (
      (shop.shopName &&
        shop.shopName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (shop.ownerName &&
        shop.ownerName.toLowerCase().includes(searchTerm.toLowerCase()))
    ) {
      return shop;
    }
    return null;
  });

  const currentShops = filteredShops.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredShops.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDeleteConfirm = () => {
    console.log(selectedShops);
    setModelState(true);
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-indigo-200 p-6 shadow-md rounded-md flex justify-center items-center">
          <div className="mr-4">
            <FaStore className="text-indigo-500 text-4xl md:text-3xl lg:text-4xl" />
          </div>
          <div>
            <h3 className="text-xl md:text-lg lg:text-xl mb-2">
              Total Registered Shops
            </h3>
            <p className="text-4xl md:text-3xl lg:text-4xl">
              {shops.length || 0}
            </p>
          </div>
        </div>
        <div className="bg-pink-200 p-6 shadow-md rounded-md flex justify-center items-center">
          <div className="mr-4">
            <FaUsers className="text-pink-500 text-4xl md:text-3xl lg:text-4xl" />
          </div>
          <div>
            <h3 className="text-xl md:text-lg lg:text-xl mb-2">
              Total Customers
            </h3>
            <p className="text-4xl md:text-3xl lg:text-4xl">
              {customers.length || 0}
            </p>
          </div>
        </div>
        <div className="bg-green-200 p-6 shadow-md rounded-md flex justify-center items-center">
          <div className="mr-4">
            <FaMoneyBillWave className="text-green-500 text-4xl md:text-3xl lg:text-4xl" />
          </div>
          <div>
            <h3 className="text-xl md:text-lg lg:text-xl mb-2">
              Total Transactions
            </h3>
            <p className="text-4xl md:text-3xl lg:text-4xl">
              ${transactions.toFixed(2) || 0}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl mb-4">Shops</h2>
        <div className="overflow-x-auto">
          <input
            type="text"
            placeholder="Search by shop name"
            className="mb-4 px-2 py-1 border border-gray-300 rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="flex justify-end mb-4">
            <button
              className={`mr-2 ${
                selectedShops.length === 0
                  ? "bg-red-400"
                  : "bg-red-500 hover:bg-red-700"
              } text-white text-sm font-semibold py-2 px-4 rounded`}
              onClick={handleDeleteConfirm}
              disabled={selectedShops.length === 0}
            >
              Delete Selected
            </button>
          </div>

          <Table className="w-full border border-gray-300">
            <thead>
              <tr>
                <th className="py-2 px-4 text-left bg-gray-100">
                  <input
                    type="checkbox"
                    // checked={selectedShops.includes(shop._id)}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="py-2 px-4 text-left bg-gray-100 font-medium text-gray-600 uppercase tracking-wider">
                  Manager
                </th>
                <th className="py-2 px-4 text-left bg-gray-100 font-medium text-gray-600 uppercase tracking-wider">
                  Shop Name
                </th>
                <th className="py-2 px-4 text-left bg-gray-100 font-medium text-gray-600 uppercase tracking-wider">
                  Customers
                </th>
                <th className="py-2 px-4 text-left bg-gray-100 font-medium text-gray-600 uppercase tracking-wider">
                  Earnings
                </th>
                {/* <th className="py-2 px-4 text-left bg-gray-100"></th> */}
              </tr>
            </thead>
            <Tbody>
              {currentShops.map((shop, index) => (
                <Tr key={shop._id}>
                  <Td className="py-2 px-4">
                    <input
                      type="checkbox"
                      checked={selectedShops.includes(shop._id)}
                      onChange={() => handleSelectShop(shop._id)}
                    />
                  </Td>
                  <Td className="py-2 px-4">{shop.name}</Td>
                  <Td className="py-2 px-4">{shop.shopName}</Td>
                  <Td className="py-2 px-4">
                    {customersPerShop[index].customerCount || "-"}
                  </Td>
                  <Td className="py-2 px-4">
                    {paymentsPerShop[index].paymentCount ? "$ " : ""}
                    {paymentsPerShop[index].paymentCount || "-"}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <Popup
            isOpen={modelState}
            onClose={() => setModelState(false)}
            children={
              <div className="bg-white rounded-md p-4 flex justify-center items-center">
                <p className="text-gray-700">
                  Are you sure you want to delete the selected shop?
                </p>
                <div className="ml-4 flex">
                  <button
                    className="mr-2 bg-red-500 hover:bg-red-700 text-white text-sm font-semibold py-2 px-4 rounded"
                    onClick={handleDeleteSelected}
                  >
                    Delete
                  </button>
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded"
                    onClick={handleCancelDelete}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            }
          />
          <div className="flex justify-between items-center mt-4">
            <div>
              <p className="text-sm text-gray-600">
                Showing {indexOfFirstItem + 1} to{" "}
                {Math.min(indexOfLastItem, filteredShops.length)} of{" "}
                {filteredShops.length} entries
              </p>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => paginate(currentPage - 1)}
                className={`${
                  currentPage === 1 ? "hidden" : ""
                } bg-blue-500 hover:bg-blue-700 text-white text-sm font-semibold py-1 px-2 rounded-l`}
              >
                Previous
              </button>
              <div className="flex h-8 items-center mx-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => paginate(i + 1)}
                    className={`${
                      currentPage === i + 1
                        ? "bg-blue-500 text-white"
                        : "bg-white text-blue-500"
                    } text-sm px-2 py-1 border border-gray-300 rounded`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => paginate(currentPage + 1)}
                className={`${
                  currentPage === totalPages ? "hidden" : ""
                } bg-blue-500 hover:bg-blue-700 text-white text-sm font-semibold py-1 px-2 rounded-r`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
