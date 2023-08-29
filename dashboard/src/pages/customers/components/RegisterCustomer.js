import React, { useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { SidebarContext } from "../../../context/SidebarContext";
import instance from "../../../axiosConfig/axiosConfig";
import { AlertContext } from "../../../context/AlertContext";
import { NotificationContext } from "../../../context/NotificationContext";
import { DarkModeContext } from "../../../context/DarkModeContext";

const RegisterCustomer = ({ setModelState }) => {
  const { setAlertOn, setAlertMsg, setAlertMsgType } =
    React.useContext(AlertContext);
  const { sendNotification } = useContext(NotificationContext);
  const { shopId } = useContext(SidebarContext);
  const { isDarkMode } = useContext(DarkModeContext);
  const initialValues = {
    name: "",
    phone: "",
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    phone: Yup.string().required("Phone is required"),
  });

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    const data = {
      name: values.name,
      phone: values.phone,
      managerId: shopId,
    };

    const fetchRequest = async () => {
      try {
        const response = await instance.post("customers/", data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("ag_app_shop_token"),
          },
        });
        setAlertMsg("New Customer has been registered");
        setAlertMsgType("success");
        setAlertOn(true);
        sendNotification(
          "New Customer - " +
            new Intl.DateTimeFormat("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }).format(new Date())
        );
      } catch (e) {
        console.error(e.message);
      }
    };

    fetchRequest();

    setSubmitting(false);
    resetForm();
    setModelState(false);
  };

  return (
    <div
      className={`bg-${
        isDarkMode ? "gray-700" : "white"
      } transition-all duration-300`}
    >
      <h2
        className={`text-xl font-bold mb-4 text-${
          isDarkMode ? "white" : "gray-700"
        }`}
      >
        Register a Customer
      </h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form
            className={`bg-${
              isDarkMode ? "gray-700" : "white"
            } rounded px-8 pt-6 pb-8 mb-4 min-w-[350px] sm:min-w-[500px] mx-auto`}
          >
            <div className="mb-4">
              <label
                htmlFor="name"
                className={`block text-sm text-${
                  isDarkMode ? "white" : "gray-700"
                } font-bold mb-2`}
              >
                Name
              </label>
              <Field
                type="text"
                id="name"
                name="name"
                placeholder="John Doe"
                className={`py-2 pl-8 border-b-2 border-${
                  isDarkMode ? "gray-600" : "gray-300"
                } text-${isDarkMode ? "white" : "gray-700"}
                bg-${!isDarkMode ? "white" : "gray-500"}
                focus:outline-none focus:border-blue-500 w-full`}
              />
              <ErrorMessage
                name="name"
                component="p"
                className="text-red-500 text-xs italic"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="phone"
                className={`block text-sm text-${
                  isDarkMode ? "white" : "gray-700"
                } font-bold mb-2`}
              >
                Phone
              </label>
              <Field
                type="tel"
                id="phone"
                name="phone"
                placeholder="123-456-7890"
                className={`py-2 pl-8 border-b-2 border-${
                  isDarkMode ? "gray-600" : "gray-300"
                } text-${isDarkMode ? "white" : "gray-700"} 
                bg-${
                  !isDarkMode ? "white" : "gray-500"
                } focus:outline-none focus:border-blue-500 w-full`}
              />
              <ErrorMessage
                name="phone"
                component="p"
                className="text-red-500 text-xs italic"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-${isDarkMode ? "gray-600" : "gray-800"} hover:bg-${
                isDarkMode ? "gray-400" : "gray-600"
              } text-white text-sm font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
            >
              Register
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default RegisterCustomer;
