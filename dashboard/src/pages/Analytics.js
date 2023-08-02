import React, { useContext, useEffect, useState } from "react";
import SidebarContext from "../context/SidebarContext";

import { MdShoppingCart, MdAttachMoney } from "react-icons/md";
import { TiTicket } from "react-icons/ti";
import { AiOutlineDollarCircle } from "react-icons/ai";
import { MdMonetizationOn } from "react-icons/md";
import { IoMdCash } from "react-icons/io";
import { BsCreditCard } from "react-icons/bs";
import axios from "axios";
import AppointmentsList from "../components/AppointmentsList";
import CashFlowSection from "../components/CashFlowSection";
import { Link, useNavigate } from "react-router-dom";
import { FaSpinner, FaSyncAlt } from "react-icons/fa";
import Pagination from "../components/Pagination";
import { startOfWeek, subWeeks } from "date-fns";

const Analytics = () => {
  const { shopId } = useContext(SidebarContext);
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

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const [products, setProducts] = useState([]);
  useEffect(() => {
    axios
      .get(`http://localhost:4040/products/shop?shopId=${shopId}`, {
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
    <div className="flex w-full flex-col h-full p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl text-gray-800 font-bold mb-5">Analytics</h1>
      </div>
      <div className="flex w-full flex-col gap-2 lg:flex-row h-full overflow-y-auto p-6">
        <div className="flex justify-between lg:block mb-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-1 gap-1 mx-auto">
            <div>
              <button
                className={`flex justify-center lg:justify-start items-center py-2 rounded-md lg:rounded-t-md lg:rounded-b-none ${
                  currentSection === 1
                    ? "bg-gray-300 text-blue-500 animate-drop nav-item-selected lg:w-24 lg:flex lg:justify-center"
                    : "text-gray-700 hover:bg-gray-300 focus:bg-gray-300 lg:w-auto"
                } focus:outline-none focus:text-blue-500 hover:text-blue-500 hover:rounded-md px-2
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
                <span className="hidden lg:flex justify-center shadow-inner bg-gray-300 lg:rounded-b-md text-sm text-gray-500">
                  Tickets
                </span>
              )}
            </div>

            <div>
              <button
                className={`flex justify-center lg:justify-start items-center py-2 rounded-md lg:rounded-t-md lg:rounded-b-none ${
                  currentSection === 2
                    ? "bg-gray-300 text-green-500 animate-drop nav-item-selected lg:w-24 lg:flex lg:justify-center" /* Background and text color for selected item */
                    : "text-gray-700 hover:bg-gray-300 focus:bg-gray-300 lg:w-auto"
                } focus:outline-none focus:text-green-500 hover:text-green-500 hover:rounded-md px-2`}
                onClick={() => setCurrentSection(2)}
              >
                <span className="flex items-center">
                  <span className="mr-2">
                    <IoMdCash className="w-5 h-5" />
                  </span>
                  <span className="lg:hidden">Cash Flow</span>
                </span>
              </button>
              {currentSection === 2 && (
                <span className="hidden lg:flex justify-center shadow-inner bg-gray-300 lg:rounded-b-md text-sm text-gray-500">
                  Cash Flow
                </span>
              )}
            </div>
            <div>
              <button
                className={`flex justify-center lg:justify-start items-center py-2 rounded-md lg:rounded-t-md lg:rounded-b-none ${
                  currentSection === 3
                    ? "bg-gray-300 text-yellow-500  animate-drop nav-item-selected lg:w-24 lg:flex lg:justify-center" /* Background and text color for selected item */
                    : "text-gray-700 hover:bg-gray-300 focus:bg-gray-300 lg:w-auto"
                } focus:outline-none focus:text-yellow-500 hover:text-yellow-500 hover:rounded-md px-2`}
                onClick={() => setCurrentSection(3)}
              >
                <span className="flex items-center">
                  <span className="mr-2">
                    <BsCreditCard className="w-5 h-5" />
                  </span>
                  <span className="lg:hidden">Commissions</span>
                </span>
              </button>
              {currentSection === 3 && (
                <span className="hidden lg:flex justify-center shadow-inner bg-gray-300 lg:rounded-b-md text-sm text-gray-500">
                  Commissions
                </span>
              )}
            </div>

            <div>
              <button
                className={`flex justify-center lg:justify-start items-center py-2 rounded-md lg:rounded-t-md lg:rounded-b-none ${
                  currentSection === 4
                    ? "bg-gray-300 text-red-500  animate-drop nav-item-selected lg:w-24 lg:flex lg:justify-center" /* Background and text color for selected item */
                    : "text-gray-700 hover:bg-gray-300 focus:bg-gray-300 lg:w-auto"
                } focus:outline-none focus:text-red-500 hover:text-red-500 hover:rounded-md px-2`}
                onClick={() => setCurrentSection(4)}
              >
                <span className="flex items-center">
                  <span className="mr-2">
                    <AiOutlineDollarCircle className="w-5 h-5" />
                  </span>
                  <span className="lg:hidden">Bills</span>
                </span>
              </button>
              {currentSection === 4 && (
                <span className="hidden lg:flex justify-center shadow-inner bg-gray-300 lg:rounded-b-md text-sm text-gray-500">
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
            <CommissionsSection />
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

// Separate components for each section can be defined here

// Tickets Section component
const TicketsSection = () => {
  // Implement the logic and UI for managing tickets
  return <AppointmentsList />;
};

// Commissions Section component
const CommissionsSection = () => {
  const [professionals, setProfessionals] = useState([]);
  const [totalSoldProducts, setTotalSoldProducts] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalServicesEarnings, setTotalServicesEarnings] = useState(0);
  const [totalProductsEarnings, setTotalProductsEarnings] = useState(0);
  const [totalCommission, setTotalCommission] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  const { shopId } = useContext(SidebarContext);
  const token = localStorage.getItem("ag_app_shop_token");

  useEffect(() => {
    axios
      .get(`http://localhost:4040/professionals/shop?shopId=${shopId}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setProfessionals(response.data.data.reverse());

        // Set dataLoaded to true when professionals data is loaded
        setDataLoaded(true);
      })
      .catch((error) => console.error(error.message));
  }, []);

  const setDefaultCommissions = () => {
    const updatedProfessionals = professionals.map((professional) => {
      if (!professional.commissionPercentServices) {
        professional.commissionPercentServices = 10; // Set default commission for services (10%)
      }
      if (!professional.commissionPercentProducts) {
        professional.commissionPercentProducts = 5; // Set default commission for products (5%)
      }
      return professional;
    });
    setProfessionals(updatedProfessionals);
  };

  useEffect(() => {
    if (dataLoaded && professionals.length !== 0) {
      // Check if professionals data contains commissionPercentServices and commissionPercentProducts
      const isCommissionDataAvailable = professionals.every(
        (professional) =>
          typeof professional.commissionPercentServices === "number" &&
          typeof professional.commissionPercentProducts === "number"
      );

      // If commission data is not available, set default commission values
      if (!isCommissionDataAvailable) {
        setDefaultCommissions();
      }

      axios
        .get(`http://localhost:4040/payments?shopId=${shopId}`, {
          headers: {
            Authorization: token,
          },
        })
        .then((response) => {
          // Get the date of the previous Monday
          const previousMonday = startOfWeek(new Date(), { weekStartsOn: 1 }); // Assuming Monday is considered the first day of the week

          let earningsByProfessional = {};
          let totalSoldProducts = 0;
          let totalEarn = 0;

          if (professionals.length !== 0) {
            response.data.payments.forEach((payment) => {
              // Check if the payment is associated with any professional
              const professionalId = payment.professional._id;

              const matchingProfessional = professionals.find(
                (professional) => professional._id === professionalId
              );

              // Check if the payment date is on or after the previous Monday
              const paymentDate = new Date(payment.dateTime);
              if (paymentDate >= previousMonday) {
                // Initialize earnings for the professional if not already present
                if (!earningsByProfessional[professionalId]) {
                  earningsByProfessional[professionalId] = {
                    ...matchingProfessional,
                    servicesEarnings: 0,
                    productsEarnings: 0,
                  };
                }

                // Earnings by service
                if (payment.service?.length > 0) {
                  payment.service.forEach((service) => {
                    earningsByProfessional[professionalId].servicesEarnings +=
                      service.price;
                  });
                }

                // Earnings by product
                if (payment.product?.length > 0) {
                  payment.product.forEach((product) => {
                    earningsByProfessional[professionalId].productsEarnings +=
                      product.price;
                  });
                }
                totalEarn += payment.amount;
              }
            });

            // Calculate and update total earnings from services
            const totalServicesEarnings = Object.values(
              earningsByProfessional
            ).reduce(
              (acc, professional) => acc + professional.servicesEarnings,
              0
            );

            const totalProductsEarnings = Object.values(
              earningsByProfessional
            ).reduce(
              (acc, professional) => acc + professional.productsEarnings,
              0
            );

            setTotalSoldProducts(totalSoldProducts);
            setTotalEarnings(totalEarn);
            setTotalServicesEarnings(totalServicesEarnings);
            setTotalProductsEarnings(totalProductsEarnings); // New state for products earnings
            setProfessionals(Object.values(earningsByProfessional));
            setInitialDataLoaded(true);
          }
        });
    }
  }, [dataLoaded]);

  // Function to calculate total commission
  const calculateTotalCommission = () => {
    // Ensure professionals data is loaded before calculating
    const total = professionals.reduce((acc, professional) => {
      const professionalEarnings =
        professional.servicesEarnings *
          (professional.commissionPercentServices / 100) +
        professional.productsEarnings *
          (professional.commissionPercentProducts / 100);

      return acc + professionalEarnings;
    }, 0);
    console.log(professionals);
    setTotalCommission(total);
  };

  // Watch for changes in relevant state values and calculate total commission
  useEffect(() => {
    if (initialDataLoaded && professionals.length !== 0) {
      calculateTotalCommission();
    }
  }, [totalEarnings, initialDataLoaded, professionals]);

  // Update professionals' commission percentage
  const handleCommissionChange = (e, professionalId, commissionType) => {
    const updatedProfessionals = professionals.map((professional) => {
      if (professional._id === professionalId) {
        const value = parseFloat(e.target.value);
        // Ensure the commission input cannot be less than 0
        const commission = Math.max(value, 0);

        if (commissionType === "services") {
          return { ...professional, commissionPercentServices: commission };
        } else if (commissionType === "products") {
          return { ...professional, commissionPercentProducts: commission };
        }
      }
      return professional;
    });
    setProfessionals(updatedProfessionals);
  };

  if (!dataLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col justify-center items-center space-x-2">
          <FaSpinner className="animate-spin text-4xl text-blue-500" />
          <span className="mt-2">Loading...</span>
        </div>
      </div>
    );
  }

  const handleUpdateCommission = (professionalId) => {
    const professional = professionals.find(
      (professional) => professional._id === professionalId
    );

    let patchData = {
      commissionPercentServices: professional.commissionPercentServices,
      commissionPercentProducts: professional.commissionPercentProducts,
    };

    axios
      .patch(
        `http://localhost:4040/professionals/${professionalId}`,
        patchData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("ag_app_shop_token"),
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        console.log(
          `Updated commission for ${professional.name}:`,
          professional.commissionPercentServices,
          professional.commissionPercentProducts
        );
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="bg-white shadow-md rounded-md p-6">
      <h2 className="text-lg font-bold mb-4">Commissions</h2>
      <div className="flex flex-wrap items-center justify-between bg-gray-100 rounded-lg p-4">
        <div className="flex items-center">
          <MdMonetizationOn size={24} className="mr-2 text-blue-500" />
          <div className="flex flex-wrap">
            <div className="text-xl font-bold text-blue-500">
              ${totalCommission.toFixed(2)}
            </div>
            <div className="text-sm font-semibold text-gray-500">
              Total Commissions
            </div>
          </div>
        </div>
        <div className="text-sm font-semibold text-gray-500">
          All professionals
        </div>
      </div>
      <div className="mt-8">
        {professionals.length === 0 ? (
          <p className="text-gray-500">
            No earnings have been generated this week.
          </p>
        ) : (
          <ul className="space-y-4">
            {professionals.map((professional) => (
              <li
                key={professional._id}
                className="flex flex-wrap items-center justify-between bg-gray-100 rounded-lg p-4"
              >
                <div>
                  <div className="mr-2 font-bold">{professional.name}</div>
                  <div className="flex items-center">
                    <label
                      htmlFor={`commissionInputServices_${professional._id}`}
                      className="mr-2"
                    >
                      Commission for Services:
                    </label>
                    <input
                      type="number"
                      id={`commissionInputServices_${professional._id}`} // Use professional's _id to make the ID unique
                      className="border rounded-md px-2 py-1 w-20"
                      value={professional.commissionPercentServices}
                      onChange={(e) =>
                        handleCommissionChange(e, professional._id, "services")
                      }
                    />
                    <span className="ml-2">%</span>
                  </div>
                  <div className="flex items-center">
                    <label
                      htmlFor={`commissionInputProducts_${professional._id}`}
                      className="mr-2"
                    >
                      Commission for Products:
                    </label>
                    <input
                      type="number"
                      id={`commissionInputProducts_${professional._id}`} // Use professional's _id to make the ID unique
                      className="border rounded-md px-2 py-1 w-20"
                      value={professional.commissionPercentProducts}
                      onChange={(e) =>
                        handleCommissionChange(e, professional._id, "products")
                      }
                    />
                    <span className="ml-2">%</span>
                  </div>
                </div>
                <div className="text-sm font-semibold text-gray-500">
                  Total: $
                  {(
                    professional.servicesEarnings +
                    professional.productsEarnings
                  ).toFixed(2)}
                </div>
                <button
                  className="flex items-center justify-center text-sm bg-blue-500 text-white px-4 py-2 rounded-md transition-colors hover:bg-blue-600"
                  onClick={() => handleUpdateCommission(professional._id)}
                >
                  <FaSyncAlt className="mr-2" />
                  Update
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

// Bills to Pay/Receive Section component
const BillsSection = () => {
  const dummyPendingCheckouts = [
    {
      id: 1,
      customer: "John Doe",
      total: 50.99,
    },
    {
      id: 2,
      customer: "Jane Smith",
      total: 75.5,
    },
    {
      id: 3,
      customer: "Bob Johnson",
      total: 30.0,
    },
  ];
  const [pendingCheckouts, setPendingCheckouts] = useState(
    dummyPendingCheckouts
  );
  const { shopId } = useContext(SidebarContext);
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const token = localStorage.getItem("ag_app_shop_token");
  const [currentAppointments, setCurrentAppointments] = useState([]);
  const navigate = useNavigate();
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;

  useEffect(() => {
    fetchAppointmentData();
  }, []);

  const fetchAppointmentData = () =>
    axios
      .get(`http://localhost:4040/appointments?shopId=${shopId}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        const registeredAppointments = response.data.appointments
          .filter(
            (appt) =>
              !appt.blocking &&
              (appt.status === "pending" || appt.status === "updating")
          )
          .reverse();
        console.log(registeredAppointments);
        setPendingAppointments(registeredAppointments);
        setCurrentAppointments(
          registeredAppointments.slice(firstIndex, lastIndex)
        );
      })
      .catch((error) => {
        console.log(error);
      });

  useEffect(() => {
    // Fetch pending checkouts data from the API
    const fetchPendingCheckouts = async () => {
      try {
        // Replace the URL with the appropriate API endpoint for fetching pending checkouts
        const response = await fetch("http://localhost:4040/pending-checkouts");
        const data = await response.json();
        setPendingCheckouts(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchPendingCheckouts();
  }, []);

  const handleCheckout = (selectedAppointment) => {
    // Perform checkout logic here
    console.log(selectedAppointment);
    selectedAppointment.status === "pending"
      ? localStorage.setItem(
          "ag_app_booking_info",
          JSON.stringify({
            customer: selectedAppointment.customer._id,
            professional: selectedAppointment.professional._id,
            service: selectedAppointment.service.map((s) => s._id),
            duration: selectedAppointment.service.reduce(
              (totalDuration, s) => totalDuration + s.duration,
              0
            ),
            dateTime: new Date(selectedAppointment.dateTime),
            amount: selectedAppointment.service.reduce(
              (totalPrice, s) => totalPrice + s.price,
              0
            ),
            appointmentId: selectedAppointment._id,
            managerId: shopId,
            checkoutType: "registering",
          })
        )
      : localStorage.setItem(
          "ag_app_booking_info",
          JSON.stringify({
            customer: selectedAppointment.customer._id,
            professional: selectedAppointment.professional._id,
            service: selectedAppointment.service.map((s) => s._id),
            product: selectedAppointment.product.map((p) => p._id),
            duration: selectedAppointment.service.reduce(
              (totalDuration, s) => totalDuration + s.duration,
              0
            ),
            dateTime: new Date(selectedAppointment.dateTime),
            amount:
              selectedAppointment.service.reduce(
                (totalPrice, s) => totalPrice + s.price,
                0
              ) +
              selectedAppointment.product.reduce(
                (totalPrice, p) => totalPrice + p.price,
                0
              ),
            appointmentId: selectedAppointment._id,
            managerId: shopId,
            checkoutType: "updating",
          })
        );

    navigate("/checkout");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    setCurrentAppointments(pendingAppointments.slice(startIndex, endIndex));
  };

  return (
    <>
      <div className="bg-white shadow-md rounded-md p-6">
        <h2 className="text-lg font-bold mb-4">Pending Checkouts</h2>
        <div className="grid grid-cols-1 gap-2">
          {currentAppointments.length === 0 ? (
            <p className="text-gray-500">No pending checkouts.</p>
          ) : (
            currentAppointments.map((checkout) => (
              <div
                key={checkout._id}
                className="bg-gray-100 rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <MdShoppingCart size={24} className="mr-2 text-blue-500" />
                  <div>
                    <div className="font-bold">{checkout.customer.name}</div>
                    <div className="text-sm text-gray-500">
                      Total: $
                      {checkout?.product?.length > 0
                        ? (
                            checkout.service.reduce(
                              (totalPrice, s) => totalPrice + s.price,
                              0
                            ) +
                            checkout.product.reduce(
                              (totalPrice, p) => totalPrice + p.price,
                              0
                            )
                          ).toFixed(2)
                        : checkout.service
                            .reduce((totalPrice, s) => totalPrice + s.price, 0)
                            .toFixed(2)}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleCheckout(checkout)}
                  className="flex items-center text-blue-500"
                >
                  <MdAttachMoney size={24} className="mr-2" />
                  Checkout
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      <Pagination
        itemsPerPage={itemsPerPage}
        totalItems={pendingAppointments.length}
        onPageChange={handlePageChange}
      />
    </>
  );
};

export default Analytics;
