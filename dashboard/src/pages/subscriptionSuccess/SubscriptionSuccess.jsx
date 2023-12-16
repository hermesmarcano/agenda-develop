import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../../axiosConfig/axiosConfig";
import { CiCircleCheck } from "react-icons/ci"; // Importing React Icons

const SubscriptionSuccess = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [sessionId, setSessionId] = useState("");
  const token = localStorage.getItem("ag_app_shop_token");
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState(null);
  const [subscription, setSubscription] = useState(null);

  const [plans, setPlans] = useState([]);

  useEffect(() => {
    instance
      .get("admin/plans")
      .then((response) => {
        console.log(response.data.plans);
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
        // console.log(response.data.plan);
        setSubscription(response.data.subscription)
        setPlan(response.data,plan)
        if (response.data.subscription.sessionId) {
            setSessionId(response.data.subscription.sessionId);
        } else {
          navigate("/");
        }
        setLoading(false);
      })
      .catch((error) => console.log(error));
  }, []);

  const handlePaymentSuccess = () => {
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
          // console.log(res.data.message);
          const matchingPlan = plans.find(obj => obj.name === subscription.planType);
          console.log(matchingPlan);
          matchingPlan.expiryDate = subscription.planEndDate

          const planData = {
            name: subscription.planType,
            customers: plan?.customers ? plan.customers + matchingPlan.customers : matchingPlan.customers,
            professionals: plan?.professionals ? plan.professionals + matchingPlan.professionals : matchingPlan.professionals,
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
              setPlan(currentPlan);
              console.log(response);
            });
          navigate("/");
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
          Proceed
        </button>
      </div>
    </div>
  );
};

export default SubscriptionSuccess;
