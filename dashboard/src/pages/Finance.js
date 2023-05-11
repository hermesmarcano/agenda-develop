import React, { useContext, useEffect, useState } from "react";
import SidebarContext from "../context/SidebarContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Bar,
  BarChart,
} from "recharts";
import sumBy from "lodash/sumBy";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { RiShoppingCartLine } from "react-icons/ri";

import { MdAttachMoney } from "react-icons/md";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import axios from "axios";

const Finance = () => {
  const { shopName } = useContext(SidebarContext);
  let [totalEarnings, setTotalEarnings] = useState(0);
  let [totalEarningsLast30Days, setTotalEarningsLast30Days] = useState(0);
  let [totalSoldProducts, setTotalSoldProducts] = useState(0);
  const [transactionsPerPage, setTransactionsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [transactions, setTransactions] = useState([]);
  const [dataByDay, setDataByDay] = useState([]);
  const [dataByService, setDataByService] = useState([]);
  const [dataByProduct, setDataByProduct] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`http://localhost:4040/payments?shopName=${shopName}`, {
      method: "GET",
      headers: {
        Authorization: token,
      },
    })
      .then((response) => response.json())

      .then((data) => {
        setTransactions([...data.payments].reverse());
        console.log(data);

        let earningsByDay = {};
        let earningsByService = {};
        let earningsByProduct = {};
        let totalEarnings = 0;
        let totalSoldProducts = 0;

        data.payments.forEach((payment) => {
          // Earnings by day
          const date = new Date(payment.dateTime).toLocaleDateString();
          if (earningsByDay[date]) {
            earningsByDay[date] += payment.amount;
          } else {
            earningsByDay[date] = payment.amount;
          }

          // Earnings by service
          if (payment.service) {
            payment.service.forEach((service) => {
              if (earningsByService[service.name]) {
                earningsByService[service.name] += service.price;
              } else {
                earningsByService[service.name] = service.price;
              }
            });
          }

          // Earnings by product
          if (payment.product) {
            const productName = payment.product.name;
            if (earningsByProduct[productName]) {
              earningsByProduct[productName] += payment.product.price;
            } else {
              earningsByProduct[productName] = payment.product.price;
            }
            totalSoldProducts++;
          }

          totalEarnings += payment.amount;
        });

        // Convert earnings by day to an array of objects
        const dataByDay = Object.entries(earningsByDay).map(
          ([date, earnings]) => ({
            date: new Intl.DateTimeFormat("en", { weekday: "short" }).format(
              new Date(date)
            ),
            earnings,
          })
        );

        // Convert earnings by service to an array of objects
        const dataByService = Object.entries(earningsByService).map(
          ([service, earnings]) => ({
            service,
            earnings,
          })
        );

        // Convert earnings by product to an array of objects
        const dataByProduct = Object.entries(earningsByProduct).map(
          ([product, earnings]) => ({
            product,
            earnings,
          })
        );

        // Calculate total earnings for the last 30 days
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0); // Set current date to the beginning of the day
        const last30Days = new Array(30).fill().map((_, index) => {
          const date = new Date(currentDate);
          date.setDate(date.getDate() - index);
          return date.toLocaleDateString();
        });
        const totalEarningsLast30Days = last30Days.reduce(
          (sum, date) => sum + (earningsByDay[date] || 0),
          0
        );

        // Modify dataByDay to store the maximum of the past 7 days
        const maxEarningsLast30Days = last30Days.reduce((max, date) => {
          const earnings = earningsByDay[date] || 0;
          return earnings > max ? earnings : max;
        }, 0);
        const modifiedDataByDay = dataByDay.map((entry) => ({
          ...entry,
          maxEarningsLast30Days: maxEarningsLast30Days,
        }));

        setDataByDay(modifiedDataByDay);
        setDataByService(dataByService);
        setDataByProduct(dataByProduct);
        setTotalEarnings(totalEarningsLast30Days);
        setTotalEarningsLast30Days(totalEarningsLast30Days);
        setTotalSoldProducts(totalSoldProducts);
        ////////////////////////////////////////////////////////////////
      });
  }, []);

  const totalPages = Math.ceil(transactions.length / transactionsPerPage);
  const lastTransactionIndex = currentPage * transactionsPerPage;
  const firstTransactionIndex = lastTransactionIndex - transactionsPerPage;
  const currentTransactions = transactions.slice(
    firstTransactionIndex,
    lastTransactionIndex
  );

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

  const [appointments, setAppointments] = useState([]);
  const [nextSevenDaysAppointments, setNextSevenDaysAppointments] = useState(
    []
  );

  useEffect(() => {
    axios
      .get(`http://localhost:4040/appointments?shopName=${shopName}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        console.log(response.data.appointments);
        setAppointments(response.data.appointments);

        // Get the next 7 days' appointments
        const today = new Date();
        const nextSevenDays = [];
        for (let i = 1; i <= 7; i++) {
          const day = new Date(today);
          day.setDate(today.getDate() + i);
          nextSevenDays.push(day.toLocaleDateString());
        }

        const nextSevenDaysAppointments = response.data.appointments.filter(
          (appointment) =>
            nextSevenDays.includes(
              new Date(appointment.dateTime).toLocaleDateString()
            )
        );
        setNextSevenDaysAppointments(nextSevenDaysAppointments);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const [customers, setCustomers] = useState([]);
  useEffect(() => {
    axios
      .get(`http://localhost:4040/customers/shopname?shopName=${shopName}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        console.log(response.data);
        setCustomers(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const [products, setProducts] = useState([]);
  useEffect(() => {
    axios
      .get(`http://localhost:4040/products/shopname?shopName=${shopName}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        console.log(response.data.products);
        setProducts(response.data.products);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="flex w-full flex-col h-full overflow-y-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl text-gray-800 font-bold mb-5">Finance</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white shadow-md rounded-md p-6">
          <h2 className="text-lg font-bold mb-4">Total Earnings</h2>
          <div className="flex items-center justify-between">
            <div className="text-4xl font-bold text-blue-500">
              ${totalEarnings}
            </div>
            <div className="text-lg font-semibold text-gray-500">
              Last 30 days
            </div>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-md p-6">
          <h2 className="text-lg font-bold mb-4">Total Customers</h2>
          <div className="flex items-center justify-between">
            <div className="text-4xl font-bold text-green-500">
              {customers.length}
            </div>
            <div className="text-lg font-semibold text-gray-500">All time</div>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-md p-6">
          <h2 className="text-lg font-bold mb-4">Total Sold Products</h2>
          <div className="flex items-center justify-between">
            <div className="text-4xl font-bold text-red-500">
              {totalSoldProducts}
            </div>
            <div className="text-lg font-semibold text-gray-500">All time</div>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-md p-6">
          <h2 className="text-lg font-bold mb-4">Reserved Appointments</h2>
          <div className="flex items-center justify-between">
            <div className="text-4xl font-bold text-purple-500">
              {nextSevenDaysAppointments.length}
            </div>
            <div className="text-lg font-semibold text-gray-500">
              Next 7 days
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white shadow-md rounded-md p-6">
          <h2 className="text-lg font-bold mb-4">Earnings by Day</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dataByDay}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="earnings" stroke="#3B82F6" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-md p-6">
          <h2 className="text-lg font-bold mb-4">Earnings by Service</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dataByService}>
                <XAxis dataKey="service" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="earnings" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="bg-white shadow-md rounded-md p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">Transactions</h2>
        </div>
        <div className="mt-8">
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-200">
                <tr className="text-xs font-medium tracking-wider text-left text-gray-600 uppercase border-b border-gray-300">
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">Customer</th>
                  <th className="px-4 py-2">Professional</th>
                  <th className="px-4 py-2">Service</th>
                  <th className="px-4 py-2">Product</th>
                  <th>Date</th>
                  <th className="px-4 py-2">Amount Paid</th>
                </tr>
              </thead>
              <tbody className="text-sm font-normal text-left text-gray-700 divide-y divide-gray-300">
                {currentTransactions.map((transaction, index) => (
                  <tr key={transaction.id}>
                    <td className="px-4 py-2">
                      {firstTransactionIndex + index + 1}
                    </td>
                    <td className="px-4 py-2">{transaction.customer.name}</td>
                    <td className="px-4 py-2">
                      {transaction.professional.name}
                    </td>
                    <td className="px-4 py-2">
                      {transaction.service?.map((ser) => ser.name).join(", ") ||
                        ""}
                    </td>

                    {transaction.product ? (
                      <td className="px-4 py-2">{transaction.product.name}</td>
                    ) : (
                      <td className="px-4 py-2">-</td>
                    )}
                    <td>
                      {new Intl.DateTimeFormat(["ban", "id"]).format(
                        new Date(transaction.dateTime)
                      )}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center">
                        <span className="mr-1">
                          <MdAttachMoney />
                        </span>
                        <span>{transaction.amount.toFixed(2)}</span>
                      </div>
                    </td>
                  </tr>
                ))}
                {transactions.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-4 py-2 text-center">
                      <div className="flex flex-col items-center justify-center w-full mt-8">
                        <RiShoppingCartLine size={96} color="#CBD5E0" />
                        <p className="mt-8 text-gray-500 text-xl font-medium">
                          No transactions yet.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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
        </div>
      </div>
    </div>
  );
};

export default Finance;
