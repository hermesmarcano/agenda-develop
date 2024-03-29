import React, { useContext, useEffect, useState } from "react";
import { SidebarContext } from "../../../context/SidebarContext";
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
import Pagination from "../../../components/Pagination";
import { RiShoppingCartLine } from "react-icons/ri";
import { MdAttachMoney } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { DarkModeContext } from "../../../context/DarkModeContext";
import instance from "../../../axiosConfig/axiosConfig";
import { SaveButton } from "../../../components/Styled";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

const CashFlowSection = () => {
  const { t } = useTranslation();
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
  const [expenses, setExpenses] = useState([]);
  const { isDarkMode } = useContext(DarkModeContext);

  function getCurrentLanguage() {
    return i18next.language || "en";
  }

  useEffect(() => {
    instance
      .get(`payments?shopId=${shopId}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => response.data)
      .then((data) => {
        setTransactions([...data.payments].reverse());

        let earningsByDay = {};
        let earningsByService = {};
        let earningsByProduct = {};
        let earningsByProfessional = {};
        let totalEarn = 0;
        let totalSoldProducts = 0;
        let totalEarnLast30Days = 0;

        expenses.forEach((expense) => {
          // Earnings by day
          const date = new Date(expense.date);

          // Get the date without the time component
          const day = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
          );

          if (earningsByDay[day]) {
            if (earningsByDay[day].expenses) {
              earningsByDay[day].expenses += expense.value;
            } else {
              earningsByDay[day].expenses = expense.value;
            }
          } else {
            earningsByDay[day] = { expenses: expense.value };
          }
        });

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
            if (earningsByDay[day].earnings) {
              earningsByDay[day].earnings += payment.amount;
            } else {
              earningsByDay[day].earnings = payment.amount;
            }
          } else {
            earningsByDay[day] = { earnings: payment.amount };
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

          // Earnings by professional
          if (payment.professional) {
            const professionalName = payment.professional.name;
            if (earningsByProfessional[professionalName]) {
              earningsByProfessional[professionalName] += payment.amount;
            } else {
              earningsByProfessional[professionalName] = payment.amount;
            }
          }

          const timeDiff = Math.abs(new Date().getTime() - date.getTime());

          // Convert the time difference to days
          const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

          if (daysDiff <= 30) {
            totalEarnLast30Days += payment.amount;
          }
          totalEarn += payment.amount;
        });

        // Convert earnings by day to include only the last 7 days and calculate total earnings and expenses per day

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
          const dataPoint = earningsByDay[dayWithoutTime] || {
            earnings: 0,
            expenses: 0,
          };
          lastSevenDays.push({
            date: new Intl.DateTimeFormat("en", { weekday: "short" }).format(
              day
            ),
            earnings: dataPoint.earnings,
            expenses: dataPoint.expenses,
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

        const dataByProfessional = Object.entries(earningsByProfessional).map(
          ([professional, earnings]) => ({
            professional,
            earnings,
          })
        );

        // Calculate total earnings for the last 30 days
        currentDate.setHours(0, 0, 0, 0); // Set current date to the beginning of the day

        setDataByDay(lastSevenDays);
        setDataByService(dataByService);
        setDataByProduct(dataByProduct);
        setDataByProfessional(dataByProfessional);
        setTotalEarnings(totalEarn);
        setTotalEarningsLast30Days(totalEarnLast30Days);
        setTotalSoldProducts(totalSoldProducts);
      });
  }, [expenses]);

  const totalPages = Math.ceil(transactions.length / transactionsPerPage);
  const lastTransactionIndex = currentPage * transactionsPerPage;
  const firstTransactionIndex = lastTransactionIndex - transactionsPerPage;
  const currentTransactions = transactions.slice(
    firstTransactionIndex,
    lastTransactionIndex
  );
  useEffect(() => {
    instance
      .get(`customers/shop?shopId=${shopId}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
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
    instance
      .get(`appointments?shopId=${shopId}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setAppointments(response.data.appointments);

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

  useEffect(() => {
    instance
      .get(`managers/id`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setExpenses(response.data.expenses);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div
          className={`shadow-md rounded-md p-6
        ${isDarkMode ? "bg-gray-800" : "bg-white"}
        `}
        >
          <h2 className="text-lg font-bold mb-4">{t("Earnings")}</h2>
          <div
            className={`flex flex-col sm:flex-row items-center justify-between rounded-lg p-4
          ${isDarkMode ? "bg-gray-900" : "bg-gray-100"}
          `}
          >
            <div className="mb-4 sm:mb-0 sm:mr-8">
              <div className="text-3xl font-bold text-blue-500">
                ${totalEarningsLast30Days.toFixed(2)}
              </div>
              <div className="text-lg font-semibold text-gray-500">
                {t("Last 30 days")}
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-lg font-semibold text-gray-500">
                {t("Total Earnings")}
              </div>
              <div className="text-2xl font-bold text-blue-500">
                ${totalEarnings.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
        <div
          className={`shadow-md rounded-md p-6
        ${isDarkMode ? "bg-gray-800" : "bg-white"}
        `}
        >
          <h2 className="text-lg font-bold mb-4">{t("Total Customers")}</h2>
          <div className="flex items-center justify-between">
            <div className="text-4xl font-bold text-green-500">
              {customers.length}
            </div>
            <div className="text-lg font-semibold text-gray-500">
              {t("All time")}
            </div>
          </div>
        </div>
        <div
          className={`shadow-md rounded-md p-6
        ${isDarkMode ? "bg-gray-800" : "bg-white"}
        `}
        >
          <h2 className="text-lg font-bold mb-4">{t("Total Sold Products")}</h2>
          <div className="flex items-center justify-between">
            <div className="text-4xl font-bold text-red-500">
              {totalSoldProducts}
            </div>
            <div className="text-lg font-semibold text-gray-500">
              {t("All time")}
            </div>
          </div>
        </div>
        <div
          className={`shadow-md rounded-md p-6
        ${isDarkMode ? "bg-gray-800" : "bg-white"}
        `}
        >
          <h2 className="text-lg font-bold mb-4">
            {t("Reserved Appointments")}
          </h2>
          <div className="flex items-center justify-between">
            <div className="text-4xl font-bold text-purple-500">
              {nextSevenDaysAppointments.length}
            </div>
            <div className="text-lg font-semibold text-gray-500">
              {t("Next 7 days")}
            </div>
          </div>
        </div>
      </div>

      <div
        className={`shadow-md rounded-md p-6 mt-8 mb-8
        ${isDarkMode ? "bg-gray-800" : "bg-white"}
        `}
      >
        <h2 className="text-lg font-bold mb-4">
          {t("Earnings/Expenses Per Day")}
        </h2>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dataByDay}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="earnings"
                stroke="#3B82F6"
                name="Earnings"
              />
              {/* Add the line for expenses */}
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="#FF0000"
                name="Expenses"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 mx-auto w-full gap-8">
        <div className="mb-8">
          <div
            className={`shadow-md rounded-md p-6
        ${isDarkMode ? "bg-gray-800" : "bg-white"}
        `}
          >
            <h2 className="text-lg font-bold mb-4">
              {t("Earnings by Service")}
            </h2>
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

        <div className="mb-8">
          <div
            className={`shadow-md rounded-md p-6
        ${isDarkMode ? "bg-gray-800" : "bg-white"}
        `}
          >
            <h2 className="text-lg font-bold mb-4">
              {t("Earnings by Professional")}
            </h2>
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
      </div>

      <div
        className={`shadow-md rounded-md p-6
        ${isDarkMode ? "bg-gray-800" : "bg-white"}
        `}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">{t("Transactions")}</h2>
        </div>
        <div className="mt-8">
          <div className="overflow-x-auto">
            <table
              className={`w-full table-auto border border-gray-300 divide-gray-300`}
            >
              <thead>
                <tr
                  className={`text-xs uppercase tracking-wider font-medium text-left border-b border-gray-300 ${
                    isDarkMode
                      ? "bg-gray-500 text-gray-800"
                      : "bg-gray-50 text-gray-500"
                  }`}
                >
                  <th className="px-4 py-2">{t("ID")}</th>
                  <th className="px-4 py-2">{t("Customer")}</th>
                  <th className="px-4 py-2">{t("Professional")}</th>
                  <th className="px-4 py-2">{t("Service")}</th>
                  <th className="px-4 py-2">{t("Product")}</th>
                  <th>{t("Method")}</th>
                  <th>Date</th>
                  <th className="px-4 py-2">{t("Amount Paid")}</th>
                </tr>
              </thead>
              <tbody
                className={`text-sm font-normal text-left divide-y divide-gray-300
              ${isDarkMode ? "bg-gray-700 text-gray-200" : "bg-white"}
              `}
              >
                {currentTransactions.map((transaction, index) => (
                  <tr key={transaction._id}>
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
                          {t("No transactions yet.")}
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

      <div
        className={`shadow-md rounded-md p-6 mt-8
        ${isDarkMode ? "bg-gray-800" : "bg-white"}
        `}
      >
        <h2 className="text-lg font-bold mb-4">{t("Expenses")}</h2>
        <Formik
          initialValues={{
            name: "",
            description: "",
            value: "",
            date: "",
          }}
          onSubmit={(values, { resetForm }) => {
            let newBill = {
              name: values.name,
              description: values.description,
              value: values.value,
              date: new Date(values.date),
            };
            let patchData = { expenses: [...expenses, newBill] };
            instance
              .patch("managers", JSON.stringify(patchData), {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: token,
                },
              })
              .then((response) => {})
              .catch((error) => console.log(error));
            resetForm();
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-medium" htmlFor="name">
                    {t("Name")}
                  </label>
                  <Field
                    type="text"
                    id="name"
                    name="name"
                    className={`w-full p-2 border border-gray-300 rounded-lg ${
                      isDarkMode ? "bg-gray-500" : "bg-gray-100"
                    }`}
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 mt-1"
                  />
                </div>
                <div>
                  <label
                    className="block mb-2 font-medium"
                    htmlFor="description"
                  >
                    {t("Description")}
                  </label>
                  <Field
                    type="text"
                    id="description"
                    name="description"
                    className={`w-full p-2 border border-gray-300 rounded-lg ${
                      isDarkMode ? "bg-gray-500" : "bg-gray-100"
                    }`}
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-red-500 mt-1"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium" htmlFor="value">
                    {t("Value")}
                  </label>
                  <Field
                    type="number"
                    id="value"
                    name="value"
                    className={`w-full p-2 border border-gray-300 rounded-lg ${
                      isDarkMode ? "bg-gray-500" : "bg-gray-100"
                    }`}
                  />
                  <ErrorMessage
                    name="value"
                    component="div"
                    className="text-red-500 mt-1"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium" htmlFor="date">
                    {t("Date")}
                  </label>
                  <Field
                    type="date"
                    id="date"
                    name="date"
                    className={`w-full p-2 border border-gray-300 rounded-lg ${
                      isDarkMode ? "bg-gray-500" : "bg-gray-100"
                    }`}
                    locale={getCurrentLanguage()}
                  />
                  <ErrorMessage
                    name="date"
                    component="div"
                    className="text-red-500 mt-1"
                  />
                </div>
              </div>
              <div className="mt-4">
                <SaveButton disabled={isSubmitting} />
              </div>
            </Form>
          )}
        </Formik>
        <div className="mt-8">
          <table className="w-full table-auto">{/* Table body */}</table>
        </div>
      </div>
    </>
  );
};

export default CashFlowSection;
