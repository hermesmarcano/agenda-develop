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
import axios from "axios";
import Pagination from "./Pagination";
import { RiShoppingCartLine } from "react-icons/ri";
import { MdAttachMoney } from "react-icons/md";

const CashFlowSection = () => {
  const [customers, setCustomers] = useState([]);
  const { shopId } = useContext(SidebarContext);
  const token = localStorage.getItem("ag_app_shop_token");
  const [transactions, setTransactions] = useState([]);
  const [dataByDay, setDataByDay] = useState([]);
  const [dataByService, setDataByService] = useState([]);
  const [dataByProduct, setDataByProduct] = useState([]);
  const [dataByProfessional, setDataByProfessional] = useState([]);
  const [totalSoldProducts, setTotalSoldProducts] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalEarningsLast30Days, setTotalEarningsLast30Days] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage, setTransactionsPerPage] = useState(5);

  useEffect(() => {
    fetch(`http://localhost:4040/payments?shopId=${shopId}`, {
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
        let totalEarn = 0;
        let totalSoldProducts = 0;
        let totalEarnLast30Days = 0;

        data.payments.forEach((payment) => {
          // Earnings by day
          const date = new Date(payment.dateTime);

          // Get the date without the time component
          const day = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
          );

          if (earningsByDay[day]) {
            earningsByDay[day] += payment.amount;
          } else {
            earningsByDay[day] = payment.amount;
          }

          // Earnings by service
          if (payment.service.length > 0) {
            payment.service.forEach((service) => {
              if (earningsByService[service.name]) {
                earningsByService[service.name] += service.price;
              } else {
                earningsByService[service.name] = service.price;
              }
            });
          }

          // Earnings by product
          if (payment.product.length > 0) {
            const productName = payment.product.name;
            if (earningsByProduct[productName]) {
              earningsByProduct[productName] += payment.product.price;
            } else {
              earningsByProduct[productName] = payment.product.price;
            }
            totalSoldProducts++;
          }

          const timeDiff = Math.abs(new Date().getTime() - date.getTime());

          // Convert the time difference to days
          const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

          if (daysDiff <= 30) {
            totalEarnLast30Days += payment.amount;
          }
          totalEarn += payment.amount;
        });

        // Filter earnings by day to include only the last 7 days and calculate total earnings per day
        const currentDate = new Date();
        const lastSevenDays = [];
        for (let i = 6; i >= 0; i--) {
          const day = new Date(currentDate);
          day.setDate(currentDate.getDate() - i);
          const dayWithoutTime = new Date(
            day.getFullYear(),
            day.getMonth(),
            day.getDate()
          );
          const earnings = earningsByDay[dayWithoutTime] || 0;
          lastSevenDays.push({
            date: new Intl.DateTimeFormat("en", { weekday: "short" }).format(
              day
            ),
            earnings,
          });
        }

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
        currentDate.setHours(0, 0, 0, 0); // Set current date to the beginning of the day
        console.log(lastSevenDays);

        setDataByDay(lastSevenDays);
        setDataByService(dataByService);
        setDataByProduct(dataByProduct);
        setTotalEarnings(totalEarn);
        setTotalEarningsLast30Days(totalEarnLast30Days);
        setTotalSoldProducts(totalSoldProducts);
      });
  }, []);

  const totalPages = Math.ceil(transactions.length / transactionsPerPage);
  const lastTransactionIndex = currentPage * transactionsPerPage;
  const firstTransactionIndex = lastTransactionIndex - transactionsPerPage;
  const currentTransactions = transactions.slice(
    firstTransactionIndex,
    lastTransactionIndex
  );
  useEffect(() => {
    axios
      .get(`http://localhost:4040/customers/shop?shopId=${shopId}`, {
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

  const [appointments, setAppointments] = useState([]);
  const [nextSevenDaysAppointments, setNextSevenDaysAppointments] = useState(
    []
  );

  useEffect(() => {
    axios
      .get(`http://localhost:4040/appointments?shopId=${shopId}`, {
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

  const [expenses, setExpenses] = useState([]);
  const [expenseName, setExpenseName] = useState("");
  const [expenseDescription, setExpenseDescription] = useState("");
  const [expenseValue, setExpenseValue] = useState(0);
  const [expenseDate, setExpenseDate] = useState("");
  const [expensePicture, setExpensePicture] = useState(null);

  const handleAddExpense = () => {
    const newExpense = {
      name: expenseName,
      description: expenseDescription,
      value: expenseValue,
      date: expenseDate,
      picture: expensePicture,
    };
    setExpenses([...expenses, newExpense]);
    setExpenseName("");
    setExpenseDescription("");
    setExpenseValue(0);
    setExpenseDate("");
    setExpensePicture(null);
  };

  const handleDeleteExpense = (index) => {
    const updatedExpenses = [...expenses];
    updatedExpenses.splice(index, 1);
    setExpenses(updatedExpenses);
  };

  const handleExpenseNameChange = (event) => {
    setExpenseName(event.target.value);
  };

  const handleExpenseDescriptionChange = (event) => {
    setExpenseDescription(event.target.value);
  };

  const handleExpenseValueChange = (event) => {
    setExpenseValue(Number(event.target.value));
  };

  const handleExpenseDateChange = (event) => {
    setExpenseDate(event.target.value);
  };

  const handleExpensePictureChange = (event) => {
    setExpensePicture(event.target.files[0]);
  };

  // useEffect(() => {
  //   axios
  //     .get(`http://localhost:4040/bills?shopId=${shopId}`, {
  //       headers: {
  //         Authorization: token,
  //       },
  //     })
  //     .then((response) => {
  //       console.log(response.data);
  //       setExpenses(response.data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, []);

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white shadow-md rounded-md p-6">
          <h2 className="text-lg font-bold mb-4">Earnings</h2>
          <div className="flex flex-col sm:flex-row items-center justify-between bg-gray-100 rounded-lg p-4">
            <div className="mb-4 sm:mb-0 sm:mr-8">
              <div className="text-3xl font-bold text-blue-500">
                ${totalEarningsLast30Days.toFixed(2)}
              </div>
              <div className="text-lg font-semibold text-gray-500">
                Last 30 days
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-lg font-semibold text-gray-500">
                Total Earnings
              </div>
              <div className="text-2xl font-bold text-blue-500">
                ${totalEarnings.toFixed(2)}
              </div>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white shadow-md rounded-md p-6">
          <h2 className="text-lg font-bold mb-4">Earnings by Professional</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dataByProfessional}>
                <XAxis dataKey="professional" />
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
                  <th>Method</th>
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
                      {transaction.service
                        ?.reduce((uniqueServices, service) => {
                          const existingService = uniqueServices.find(
                            (s) => s._id === service._id
                          );

                          if (existingService) {
                            existingService.count += 1;
                          } else {
                            uniqueServices.push({ ...service, count: 1 });
                          }

                          return uniqueServices;
                        }, [])
                        .map((service, index) => (
                          <span key={index}>
                            {service.name}{" "}
                            {service.count > 1 ? `x${service.count}` : ""}
                          </span>
                        ))}
                    </td>

                    {transaction.product.length > 0 ? (
                      <td className="px-4 py-2">
                        {transaction.product
                          ?.reduce((uniqueProducts, product) => {
                            const existingProduct = uniqueProducts.find(
                              (p) => p._id === product._id
                            );

                            if (existingProduct) {
                              existingProduct.count += 1;
                            } else {
                              uniqueProducts.push({ ...product, count: 1 });
                            }

                            return uniqueProducts;
                          }, [])
                          .map((product, index) => (
                            <span key={index}>
                              {product.name}{" "}
                              {product.count > 1 ? `x${product.count}` : ""}
                            </span>
                          ))}
                      </td>
                    ) : (
                      <td className="px-4 py-2">-</td>
                    )}
                    <td>{transaction.method && transaction?.method}</td>
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
                    <td colSpan="7" className="px-4 py-2 text-center">
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
                <Pagination
                  itemsPerPage={1}
                  totalItems={totalPages}
                  onPageChange={handlePageClick}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-md p-6 mt-8">
        <h2 className="text-lg font-bold mb-4">Expenses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-medium">Name</label>
            <input
              type="text"
              value={expenseName}
              onChange={handleExpenseNameChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Description</label>
            <input
              type="text"
              value={expenseDescription}
              onChange={handleExpenseDescriptionChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Value</label>
            <input
              type="number"
              value={expenseValue}
              onChange={handleExpenseValueChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Date</label>
            <input
              type="date"
              value={expenseDate}
              onChange={handleExpenseDateChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleExpensePictureChange}
              className="w-full"
            />
          </div>
        </div>
        <button
          onClick={handleAddExpense}
          className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
        >
          Add Expense
        </button>
        <div className="mt-8">
          <table className="w-full table-auto">{/* Table body */}</table>
        </div>
      </div>
    </>
  );
};

export default CashFlowSection;
