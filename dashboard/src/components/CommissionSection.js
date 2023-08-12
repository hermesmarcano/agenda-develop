import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { FaSpinner, FaSyncAlt } from "react-icons/fa";
import { MdMonetizationOn } from "react-icons/md";
import { startOfWeek, subWeeks } from "date-fns";
import { SidebarContext } from "../context/SidebarContext";
import { DarkModeContext } from "../context/DarkModeContext";

const CommissionSection = () => {
  const [professionals, setProfessionals] = useState([]);
  const [totalSoldProducts, setTotalSoldProducts] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalServicesEarnings, setTotalServicesEarnings] = useState(0);
  const [totalProductsEarnings, setTotalProductsEarnings] = useState(0);
  const [totalCommission, setTotalCommission] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const { shopId } = useContext(SidebarContext);
  const { isDarkMode } = useContext(DarkModeContext);
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
      .then((response) => {})
      .catch((error) => console.error(error));
  };

  return (
    <div
      className={`shadow-md rounded-md p-6 
    ${isDarkMode ? "bg-gray-700" : "bg-white"}`}
    >
      <h2 className="text-lg font-bold mb-4">Commissions</h2>
      <div
        className={`flex flex-wrap items-center justify-between rounded-lg p-4 ${
          isDarkMode ? "bg-gray-900" : "bg-gray-100"
        }`}
      >
        <div className="flex items-center">
          <MdMonetizationOn size={24} className="mr-2 text-blue-500" />
          <div className="flex flex-wrap">
            <div className="text-xl font-bold text-blue-500 mr-2">
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
                className={`flex flex-wrap items-center justify-between rounded-lg p-4 ${
                  isDarkMode ? "bg-gray-900" : "bg-gray-100"
                }`}
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
                      className={`border rounded-md px-2 py-1 w-20 my-1 ${
                        isDarkMode ? "bg-gray-500" : "bg-gray-100"
                      }`}
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
                      className={`border rounded-md px-2 py-1 w-20 my-1 ${
                        isDarkMode ? "bg-gray-500" : "bg-gray-100"
                      }`}
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

export default CommissionSection;
