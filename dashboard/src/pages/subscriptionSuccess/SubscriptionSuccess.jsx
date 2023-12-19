import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../../axiosConfig/axiosConfig";
import { CiCircleCheck } from "react-icons/ci"; // Importing React Icons
import { FaSpinner } from "react-icons/fa";

const SubscriptionSuccess = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("ag_app_shop_token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token]);

  useEffect(() => {
    instance
      .get("admin/plans")
      .then((response) => {
        const plansArr = Object.keys(response.data.plans).map((key) => {
          return { name: key, ...response.data.plans[key] };
        });
        instance
          .get("managers/id", {
            headers: {
              Authorization: token,
            },
          })
          .then((response) => {
            console.log(response.data.subscription);
            if (response.data.subscription.sessionId) {
              handlePaymentSuccess(
                response.data.subscription.sessionId,
                plansArr
              );
            } else {
              navigate("/");
            }
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));
  }, []);

  const handlePaymentSuccess = (sessionId, plansArr) => {
    instance
      .patch(
        "managers/payment-success",
        JSON.stringify({ sessionId: sessionId }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          console.log();
          instance
            .get("managers/id", {
              headers: {
                Authorization: token,
              },
            })
            .then((res) => {
              const matchingPlan = plansArr.find(
                (obj) => obj.name === res.data.subscription.planType
              );

              matchingPlan.expiryDate = res.data.subscription.planEndDate;

              const planData = {
                name: res.data.subscription.planType,
                customers: res.data.plan?.customers
                  ? res.data.plan.customers + matchingPlan.customers
                  : matchingPlan.customers,
                professionals: res.data.plan?.professionals
                  ? res.data.plan.professionals + matchingPlan.professionals
                  : matchingPlan.professionals,
                agenda: matchingPlan.agenda,
                businessAdmin: matchingPlan.businessAdmin,
                agindaLinkPage: matchingPlan.agendaLinkPage,
                appointmentReminders: matchingPlan.appointmentReminders,
                whatsAppIntegration: matchingPlan.whatsAppIntegration,
                expiryDate: matchingPlan.expiryDate,
              };

              instance
                .patch(`managers/plan`, JSON.stringify(planData), {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                  },
                })
                .then((response) => {
                  console.log(response.data.manager.plan);
                  const currentPlan = response.data.manager.plan;
                  currentPlan.expiryDate =
                    response.data.manager.subscription.planEndDate;
                  if (
                    currentPlan &&
                    currentPlan.expiryDate &&
                    new Date(currentPlan.expiryDate.toString()).getTime() >
                      new Date().getTime()
                  ) {
                    currentPlan.active = true;
                  } else {
                    currentPlan.active = false;
                  }
                  currentPlan.expiryDate = new Intl.DateTimeFormat("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  }).format(new Date(currentPlan.expiryDate.toString()));
                });
              navigate("/");
            });
        } else {
          return response.json().then((json) => Promise.reject(json));
        }
      })
      .catch((e) => {
        console.log(e.error);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded shadow-md w-full max-w-md mx-auto">
        <CiCircleCheck className="w-16 h-16 mx-auto text-green-500" />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Payment Successful
        </h2>
        <p className="flex justify-center items-center mt-8 w-full text-xl font-medium">
          <FaSpinner className="animate-spin mr-2" />
          <span>Updating plan data ...</span>
        </p>
      </div>
    </div>
  );
};

export default SubscriptionSuccess;
