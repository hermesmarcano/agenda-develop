import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../../axiosConfig/axiosConfig";
import { CiCircleCheck } from "react-icons/ci"; // Importing React Icons
import { FaSpinner } from "react-icons/fa";

const SubscriptionSuccess = () => {
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState("");
  const token = localStorage.getItem("ag_app_shop_token");
  const [loading, setLoading] = useState(false);

  const [plans, setPlans] = useState([]);

  useEffect(() => {
    if(!token){
      navigate('/login')
    }
  }, [token])

  useEffect(() => {
    instance
      .get("admin/plans")
      .then((response) => {
        const plansArr = Object.keys(response.data.plans).map((key) => {
          return { name: key, ...response.data.plans[key] };
        });
        setPlans(plansArr);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    instance
      .get("managers/id", {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        console.log(response.data.subscription);
        if (response.data.subscription.sessionId) {
          setSessionId(response.data.subscription.sessionId);
        } else {
          navigate("/");
        }
      })
      .catch((error) => console.log(error));
  }, []);

  const handlePaymentSuccess = () => {
    setLoading(true);
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
      .then((res) => {
        if (res.status === 200) {
          console.log(res.data.message);
          instance
            .get("managers/id", {
              headers: {
                Authorization: token,
              },
            })
            .then((res) => {
              const matchingPlan = plans.find(
                (obj) => obj.name === res.data.subscription.planType
              );
              console.log(res.data.subscription.planType);
              console.log(plans);
              console.log(matchingPlan);
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

              console.log(planData);

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
              setLoading(false);
              navigate("/");
            });
        } else {
          return res.json().then((json) => Promise.reject(json));
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
        <button
          onClick={handlePaymentSuccess}
          className="mt-8 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-xl font-medium text-white bg-green-600 hover:bg-green-700"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <FaSpinner className="animate-spin mr-2" />
              {" Updating plan data ..."}
            </span>
          ) : (
            <span>Proceed</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default SubscriptionSuccess;
