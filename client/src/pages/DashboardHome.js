import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import { Table, Tbody, Tr, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { FaStore, FaUsers, FaMoneyBillWave } from "react-icons/fa";
import axios from "axios";

const DashboardHome = () => {
  const [shops, setShops] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState(0);
  const [payments, setPayments] = useState([]);
  const [customersPerShop, setCustomersPerShop] = useState([]);
  const [paymentsPerShop, setPaymentsPerShop] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("adminToken");
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

        setShops(shopsResponse.data);
        setCustomers(customersResponse.data.customers);
        setPayments(paymentsResponse.data.payments);

        const customersPShop = shopsResponse.data.map((shop) => {
          const matchingCustomers = customersResponse.data.customers.filter(
            (customer) => customer.shopName === shop.shopName
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
            (payment) => payment.shopName === shop.shopName
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
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Rest of your code...

  const handleDeleteShop = (shopId) => {
    setShops((prevShops) => prevShops.filter((shop) => shop._id !== shopId));
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
              ${transactions || 0}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl mb-4">Shops</h2>
        <div className="overflow-x-auto">
          <Table className="w-full border border-gray-300">
            <thead>
              <tr>
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
                <th className="py-2 px-4 text-left bg-gray-100"></th>
              </tr>
            </thead>
            <Tbody>
              {shops.map((shop, index) => (
                <Tr key={shop._id}>
                  <Td className="py-2 px-4">{shop.name}</Td>
                  <Td className="py-2 px-4">{shop.shopName}</Td>
                  <Td className="py-2 px-4">
                    {customersPerShop[index].customerCount || "-"}
                  </Td>
                  <Td className="py-2 px-4">
                    {paymentsPerShop[index].paymentCount ? "$ " : ""}
                    {paymentsPerShop[index].paymentCount || "-"}
                  </Td>
                  <Td className="py-2 px-4">
                    <button
                      onClick={() => handleDeleteShop(shop._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
