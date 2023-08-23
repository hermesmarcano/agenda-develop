import React, { useContext, useEffect, useState } from "react";

import { TiTicket } from "react-icons/ti";
import { AiOutlineDollarCircle } from "react-icons/ai";
import { IoMdCash } from "react-icons/io";
import { BsCreditCard } from "react-icons/bs";
import AppointmentsList from "./components/AppointmentsList";
import CashFlowSection from "./components/CashFlowSection";
import CommissionSection from "./components/CommissionSection";
import BillsSection from "./components/BillsSection";
import { SidebarContext } from "../../context/SidebarContext";
import { DarkModeContext } from "../../context/DarkModeContext";
import apiProvider from "../../axiosConfig/axiosConfig";

const Analytics = () => {
  const { shopId } = useContext(SidebarContext);
  const { isDarkMode } = useContext(DarkModeContext);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalEarningsLast30Days, setTotalEarningsLast30Days] = useState(0);
  const [totalSoldProducts, setTotalSoldProducts] = useState(0);
  const [transactionsPerPage, setTransactionsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [transactions, setTransactions] = useState([]);
  const [dataByDay, setDataByDay] = useState([]);
  const [dataByService, setDataByService] = useState([]);
  const [dataByProduct, setDataByProduct] = useState([]);
  const [currentSection, setCurrentSection] = useState(1);
  const token = localStorage.getItem("ag_app_shop_token");

  useEffect(() => {
    apiProvider
      .get(`http://localhost:4040/payments?shopId=${shopId}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => response.json())
      .then((data) => {
        setTransactions([...data.payments].reverse());

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

  const [products, setProducts] = useState([]);
  useEffect(() => {
    apiProvider
      .get(`products/shop?shopId=${shopId}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setProducts(response.data.products);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="flex w-full flex-col h-full p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold mb-5">Analytics</h1>
      </div>
      <div className="flex w-full flex-col gap-2 lg:flex-row h-full overflow-y-auto p-6">
        <div className="flex justify-between lg:block mb-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-1 gap-1 mx-auto">
            <div>
              <button
                className={`flex justify-center lg:justify-start items-center py-2 rounded-md lg:rounded-t-md lg:rounded-b-none ${
                  currentSection === 1
                    ? ` text-blue-500 animate-drop nav-item-selected lg:w-24 lg:flex lg:justify-center
                    ${isDarkMode ? "bg-gray-500" : "bg-gray-300"}
                    `
                    : `lg:w-auto text-gray-700
                    ${
                      isDarkMode
                        ? " hover:bg-gray-700 focus:bg-gray-700 "
                        : " hover:bg-gray-300 focus:bg-gray-300 "
                    }
                    `
                } focus:outline-none focus:text-blue-500 hover:text-blue-500 px-2 ${
                  currentSection !== 1 && "hover:rounded-md"
                }
                `}
                onClick={() => setCurrentSection(1)}
              >
                <span className="flex items-center">
                  <span className="mr-2">
                    <TiTicket className="w-5 h-5" />
                  </span>
                  <span
                    className={`lg:hidden ${
                      currentSection === 1 ? "animate-drop" : "opacity-100"
                    }`}
                  >
                    Tickets
                  </span>
                </span>
              </button>
              {currentSection === 1 && (
                <span
                  className={`hidden lg:flex justify-center shadow-inner lg:rounded-b-md text-sm
                ${
                  isDarkMode
                    ? "bg-gray-500 text-gray-300"
                    : "bg-gray-300 text-gray-500"
                }
                `}
                >
                  Tickets
                </span>
              )}
            </div>

            <div>
              <button
                className={`flex justify-center lg:justify-start items-center py-2 rounded-md lg:rounded-t-md lg:rounded-b-none ${
                  currentSection === 2
                    ? ` text-green-500 animate-drop nav-item-selected lg:w-24 lg:flex lg:justify-center
                    ${isDarkMode ? "bg-gray-500" : "bg-gray-300"}
                    `
                    : `lg:w-auto text-gray-700
                    ${
                      isDarkMode
                        ? " hover:bg-gray-700 focus:bg-gray-700 "
                        : " hover:bg-gray-300 focus:bg-gray-300 "
                    }
                    `
                } focus:outline-none focus:text-green-500 hover:text-green-500 px-2 ${
                  currentSection !== 2 && "hover:rounded-md"
                }
                `}
                onClick={() => setCurrentSection(2)}
              >
                <span className="flex items-center">
                  <span className="mr-2">
                    <IoMdCash className="w-5 h-5" />
                  </span>
                  <span
                    className={`lg:hidden ${
                      currentSection === 2 ? "animate-drop" : "opacity-100"
                    }`}
                  >
                    Cash Flow
                  </span>
                </span>
              </button>
              {currentSection === 2 && (
                <span
                  className={`hidden lg:flex justify-center shadow-inner lg:rounded-b-md text-sm
                ${
                  isDarkMode
                    ? "bg-gray-500 text-gray-300"
                    : "bg-gray-300 text-gray-500"
                }
                `}
                >
                  Cash Flow
                </span>
              )}
            </div>
            <div>
              <button
                className={`flex justify-center lg:justify-start items-center py-2 rounded-md lg:rounded-t-md lg:rounded-b-none ${
                  currentSection === 3
                    ? ` text-yellow-500 animate-drop nav-item-selected lg:w-24 lg:flex lg:justify-center
                    ${isDarkMode ? "bg-gray-500" : "bg-gray-300"}
                    `
                    : `lg:w-auto text-gray-700
                    ${
                      isDarkMode
                        ? " hover:bg-gray-700 focus:bg-gray-700 "
                        : " hover:bg-gray-300 focus:bg-gray-300 "
                    }
                    `
                } focus:outline-none focus:text-yellow-500 hover:text-yellow-500 px-2 ${
                  currentSection !== 3 && "hover:rounded-md"
                }
                `}
                onClick={() => setCurrentSection(3)}
              >
                <span className="flex items-center">
                  <span className="mr-2">
                    <BsCreditCard className="w-5 h-5" />
                  </span>
                  <span
                    className={`lg:hidden ${
                      currentSection === 3 ? "animate-drop" : "opacity-100"
                    }`}
                  >
                    Commission
                  </span>
                </span>
              </button>
              {currentSection === 3 && (
                <span
                  className={`hidden lg:flex justify-center shadow-inner lg:rounded-b-md text-sm
                ${
                  isDarkMode
                    ? "bg-gray-500 text-gray-300"
                    : "bg-gray-300 text-gray-500"
                }
                `}
                >
                  Commission
                </span>
              )}
            </div>

            <div>
              <button
                className={`flex justify-center lg:justify-start items-center py-2 rounded-md lg:rounded-t-md lg:rounded-b-none ${
                  currentSection === 4
                    ? ` text-red-500 animate-drop nav-item-selected lg:w-24 lg:flex lg:justify-center
                    ${isDarkMode ? "bg-gray-500" : "bg-gray-300"}
                    `
                    : `lg:w-auto text-gray-700
                    ${
                      isDarkMode
                        ? " hover:bg-gray-700 focus:bg-gray-700 "
                        : " hover:bg-gray-300 focus:bg-gray-300 "
                    }
                    `
                } focus:outline-none focus:text-red-500 hover:text-red-500 px-2 ${
                  currentSection !== 4 && "hover:rounded-md"
                }
                `}
                onClick={() => setCurrentSection(4)}
              >
                <span className="flex items-center">
                  <span className="mr-2">
                    <AiOutlineDollarCircle className="w-5 h-5" />
                  </span>
                  <span
                    className={`lg:hidden ${
                      currentSection === 4 ? "animate-drop" : "opacity-100"
                    }`}
                  >
                    Bills
                  </span>
                </span>
              </button>
              {currentSection === 4 && (
                <span
                  className={`hidden lg:flex justify-center shadow-inner lg:rounded-b-md text-sm
                ${
                  isDarkMode
                    ? "bg-gray-500 text-gray-300"
                    : "bg-gray-300 text-gray-500"
                }
                `}
                >
                  Bills
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Render the appropriate section based on the currentSection state */}
        {currentSection === 1 && (
          // Section 1: Tickets
          <div className="w-10/12 mx-auto">
            <TicketsSection />
          </div>
        )}
        {currentSection === 2 && (
          // Section 2: Cash Flow
          <div className="w-10/12 mx-auto">
            <CashFlowSection
              totalEarningsLast30Days={totalEarningsLast30Days}
              totalEarnings={totalEarnings}
              totalSoldProducts={totalSoldProducts}
              dataByDay={dataByDay}
              dataByService={dataByService}
            />
          </div>
        )}
        {currentSection === 3 && (
          // Section 3: Commissions
          <div className="w-10/12 mx-auto">
            <CommissionSection />
          </div>
        )}
        {currentSection === 4 && (
          // Section 4: Bills to Pay/Receive
          <div className="w-10/12 mx-auto">
            <BillsSection />
          </div>
        )}
      </div>
    </div>
  );
};

// Tickets Section component
const TicketsSection = () => {
  return <AppointmentsList />;
};

export default Analytics;
