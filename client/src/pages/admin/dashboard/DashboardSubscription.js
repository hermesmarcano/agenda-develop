import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import instance from "../../../axiosConfig/axiosConfig";
import { FaEdit } from "react-icons/fa";
import { FiCheck } from "react-icons/fi";
import Switch from "react-switch";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import { useTranslation } from "react-i18next";

const DashboardSubscription = () => {
  const { t } = useTranslation();
  const [plans, setPlans] = useState([]);
  const [plansObj, setPlansObj] = useState([]);
  const [editingPlan, setEditingPlan] = useState(null);
  const [updatedPlan, setUpdatedPlan] = useState(null);

  useEffect(() => {
    instance.get("admin/plans").then((response) => {
      const plansData = response.data.plans;
      setPlansObj(response.data.plans);
      const plansArray = Object.keys(plansData).map((key) => ({
        ...plansData[key],
        name: key,
      }));
      setPlans(plansArray);
    });
  }, []);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Plan Name is required"),
    price: Yup.string().required("Price is required"),
    professionals: Yup.number().required("Professionals is required"),
    customers: Yup.number().required("Customers is required"),
  });

  const createNotification = (title, message, type) => {
    switch (type) {
      case "success":
        NotificationManager.success(message, title);
        break;
      case "error":
        NotificationManager.error(message, title, 5000, () => {
          alert("callback");
        });
        break;
      default:
        break;
    }
  };

  const handlePlanUpdate = (values) => {
    const updatedPlans = {
      ...plansObj,
      [values.name]: values,
    };
    console.log(updatedPlans);
    const token = localStorage.getItem("ag_app_admin_token");
    instance
      .patch(
        "admin/",
        { plans: updatedPlans },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((res) => {
        createNotification(
          "Update",
          values.name + " plan " + t("data saved successfully"),
          "success"
        );
        console.log(res.data);
        setEditingPlan(null);
        setUpdatedPlan(null);
      });
  };

  const handleEditClick = (plan) => {
    setEditingPlan(plan.name);
    setUpdatedPlan(plan);
  };

  return (
    <>
      <NotificationContainer />
      <div className="flex flex-col items-center justify-center w-full">
        <h1 className="text-3xl font-bold mb-4">Current Subscription Plans</h1>
        <div className="flex justify-center items-center flex-wrap gap-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center transition duration-300 transform hover:scale-105"
            >
              {editingPlan === plan.name ? (
                <Formik
                  initialValues={updatedPlan}
                  validationSchema={validationSchema}
                  onSubmit={(values) => handlePlanUpdate(values)}
                >
                  {({ values, setFieldValue }) => (
                    <Form className="flex flex-col bg-white rounded-lg p-6">
                      <h2 className="text-2xl font-bold mb-4 flex items-center">
                        <FaEdit className="mr-2" /> {plan.name}
                      </h2>
                      <label className="block mt-4">
                        <span className="text-gray-700 capitalize">
                          Plan Name
                        </span>
                        <Field
                          type="text"
                          name="name"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                        <ErrorMessage
                          name="name"
                          component="div"
                          className="text-red-500 mt-1"
                        />
                      </label>
                      <label className="block mt-4">
                        <span className="text-gray-700 capitalize">Price</span>
                        <Field
                          type="text"
                          name="price"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                        <ErrorMessage
                          name="price"
                          component="div"
                          className="text-red-500 mt-1"
                        />
                      </label>

                      <label className="block mt-4">
                        <span className="text-gray-700 capitalize">Promotional price</span>
                        <Field
                          type="text"
                          name="promotionalPrice"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                        <ErrorMessage
                          name="promotionalPrice"
                          component="div"
                          className="text-red-500 mt-1"
                        />
                      </label>

                      <label className="block mt-4">
                        <span className="text-gray-700 capitalize">Annual Price</span>
                        <Field
                          type="text"
                          name="annualPrice"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                        <ErrorMessage
                          name="annualPrice"
                          component="div"
                          className="text-red-500 mt-1"
                        />
                      </label>

                      <label className="block mt-4">
                        <span className="text-gray-700 capitalize">
                          Professionals
                        </span>
                        <Field
                          type="number"
                          name="professionals"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                        <ErrorMessage
                          name="professionals"
                          component="div"
                          className="text-red-500 mt-1"
                        />
                      </label>

                      <label className="flex items-center justify-between mt-4">
                        <span className="text-gray-700 capitalize">
                          Agenda
                        </span>
                        <Field
                          as={CustomSwitch}
                          name="agenda"
                          checked={values.agenda}
                          onChange={(e) => setFieldValue("agenda", e)}
                        />
                      </label>

                      <label className="flex items-center justify-between mt-4">
                        <span className="text-gray-700 capitalize mr-2">
                          Business Admin
                        </span>
                        <Field
                          as={CustomSwitch}
                          name="businessAdmin"
                          checked={values.businessAdmin}
                          onChange={(e) => setFieldValue("businessAdmin", e)}
                        />
                      </label>

                      <label className="flex items-center justify-between mt-4">
                        <span className="text-gray-700 capitalize mr-2">
                          Reservation Page
                        </span>
                        <Field
                          as={CustomSwitch}
                          name="agendaLinkPage"
                          checked={values.agendaLinkPage}
                          onChange={(e) => setFieldValue("agendaLinkPage", e)}
                        />
                      </label>

                      <label className="flex items-center justify-between mt-4">
                        <span className="text-gray-700 capitalize mr-2">
                          WhatsApp Integration
                        </span>
                        <Field
                          as={CustomSwitch}
                          name="whatsAppIntegration"
                          checked={values.whatsAppIntegration}
                          onChange={(e) =>
                            setFieldValue("whatsAppIntegration", e)
                          }
                        />
                      </label>

                      <label className="flex items-center justify-between mt-4">
                        <span className="text-gray-700 capitalize mr-2">
                          Appointment Reminders
                        </span>
                        <Field
                          as={CustomSwitch}
                          name="appointmentReminders"
                          checked={values.appointmentReminders}
                          onChange={(e) =>
                            setFieldValue("appointmentReminders", e)
                          }
                        />
                      </label>

                      <button
                        type="submit"
                        className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-full mt-4 flex items-center justify-center"
                      >
                        <FiCheck className="mr-2" />
                        Update Plan
                      </button>
                    </Form>
                  )}
                </Formik>
              ) : (
                <div>
                  <h2 className="text-xl font-bold mb-4 capitalize">
                    {plan.name}
                  </h2>
                  <p className="text-gray-500 mb-4">
                    Monthly Price: <span className="font-bold">{plan.price}</span>
                  </p>
                  <p className="text-gray-500 mb-4">
                    Promotional Price: <span className="font-bold">{plan.promotionalPrice}</span>
                  </p>
                  <p className="text-gray-500 mb-4">
                    Annual Price: <span className="font-bold">{plan.annualPrice}</span>
                  </p>
                  <p className="text-gray-500 mb-4">
                    Professionals:{" "}
                    <span className="font-bold">{plan.professionals}</span>
                  </p>
                  <p className="text-gray-500 mb-4">
                    Customers:{" "}
                    <span className="font-bold">{plan.customers}</span>
                  </p>
                  <p className="text-gray-500 mb-4">
                    Agenda:{" "}
                    <span className="font-bold">
                      {plan.agenda ? "Yes" : "No"}
                    </span>
                  </p>
                  <p className="text-gray-500 mb-4">
                    Business Admin:{" "}
                    <span className="font-bold">
                      {plan.businessAdmin ? "Yes" : "No"}
                    </span>
                  </p>
                  <p className="text-gray-500 mb-4">
                    Reservation Page:{" "}
                    <span className="font-bold">
                      {plan.agendaLinkPage ? "Yes" : "No"}
                    </span>
                  </p>
                  <p className="text-gray-500 mb-4">
                    WhatsApp Integration:{" "}
                    <span className="font-bold">
                      {plan.whatsAppIntegration ? "Yes" : "No"}
                    </span>
                  </p>
                  <p className="text-gray-500 mb-4">
                    Appointment Reminders:{" "}
                    <span className="font-bold">
                      {plan.appointmentReminders ? "Yes" : "No"}
                    </span>
                  </p>
                  <button
                    className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-full mt-4 flex items-center justify-center"
                    onClick={() => handleEditClick(plan)}
                  >
                    <FaEdit className="mr-2" />
                    Modify Plan
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default DashboardSubscription;

const CustomSwitch = ({ field, form, ...props }) => (
  <Switch
    checked={field?.value || false}
    onChange={() => form.setFieldValue(field.name, !field.value)}
    onColor="#38A89D"
    onHandleColor="#047481"
    handleDiameter={24}
    uncheckedIcon={false}
    checkedIcon={false}
    boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
    activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
    height={20}
    width={48}
    {...props}
  />
);
