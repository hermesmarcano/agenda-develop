import React, { useContext, useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { SidebarContext } from "../../../context/SidebarContext";
import instance from "../../../axiosConfig/axiosConfig";
import { NotificationContext } from "../../../context/NotificationContext";
import { DarkModeContext } from "../../../context/DarkModeContext";
import { FaBirthdayCake, FaAddressCard } from "react-icons/fa"; // Import React Icons
import { Store } from "react-notifications-component";
import { DefaultInputDarkStyle, DefaultInputLightStyle, Hourglass, IconInputDarkStyle, IconInputLightStyle, UpdateButton } from "../../../components/Styled";

const UpdateCustomer = ({ setModelState, customerId }) => {
  const { sendNotification } = useContext(NotificationContext);
  const { isDarkMode } = useContext(DarkModeContext);
  const [customerData, setCustomerData] = useState(null);
  const token = localStorage.getItem("ag_app_shop_token");

  const notify = (title, message, type) => {
    Store.addNotification({
      title: title,
      message: message,
      type: type,
      insert: "top",
      container: "bottom-center",
      animationIn: ["animated", "fadeIn"],
      animationOut: ["animated", "fadeOut"],
      dismiss: {
        duration: 5000,
        onScreen: true,
      },
      onNotificationRemoval: () => this.remove(),
    });
  };

  const remove = () => {
    Store.removeNotification({});
  };

  useEffect(() => {
    instance
      .get(`customers/${customerId}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        console.log(response.data);
        setCustomerData(response.data);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, []);

  const { shopId } = useContext(SidebarContext);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    phone: Yup.string().required("Phone is required"),
    email: Yup.string().email("Invalid email format"),
    birthday: Yup.date().nullable(),
    address: Yup.string(),
  });

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    const patchData = {
      name: values.name,
      phone: values.phone,
      email: values.email,
      birthday: values.birthday,
      address: values.address,
      managerId: shopId,
    };

    const fetchRequest = async () => {
      try {
        const response = await instance.patch(
          `customers/${customerId}`,
          patchData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("ag_app_shop_token"),
            },
          }
        );
        notify(
          "Update",
          `Customer "${values.name}" info has been updated`,
          "success"
        );
        sendNotification(
          "Customer updated - " +
            new Intl.DateTimeFormat("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }).format(new Date())
        );
      } catch (e) {
        notify(
          "Error",
          `Some of the data has already been registered before`,
          "danger"
        );
      }
    };

    fetchRequest();
    setSubmitting(false);
    resetForm();
    setModelState(false);
  };

  if (!customerData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Hourglass />
      </div>
    );
  }

  return (
    <div
      className={`bg-${
        isDarkMode ? "gray-800" : "white"
      } transition-all duration-300  shadow-lg rounded-md m-2`}
    >
      <Formik
        initialValues={{
          name: customerData?.name || "",
          phone: customerData?.phone || "",
          email: customerData?.email || "",
          birthday: customerData?.birthday || "",
          address: customerData?.address || "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form
          className={`bg-${
            isDarkMode ? "gray-800" : "white"
          } rounded px-8 pt-6 pb-8 mb-4`}
        >
            <div className="mb-4">
              <label
                htmlFor="name"
                className={`block text-sm font-bold mb-2 text-${
                  isDarkMode ? "white" : "gray-700"
                }`}
              >
                Name
              </label>
              <Field
                type="text"
                id="name"
                name="name"
                placeholder="John Doe"
                className={`${isDarkMode ? DefaultInputDarkStyle : DefaultInputLightStyle}`}
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
                className={`block text-sm font-bold mb-2 text-${
                  isDarkMode ? "white" : "gray-700"
                }`}
              >
                Phone
              </label>
              <Field
                type="tel"
                id="phone"
                name="phone"
                placeholder="123-456-7890"
                className={`${isDarkMode ? DefaultInputDarkStyle : DefaultInputLightStyle}`}
                />
              <ErrorMessage
                name="phone"
                component="p"
                className="text-red-500 text-xs italic"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className={`block text-sm font-bold mb-2 text-${
                  isDarkMode ? "white" : "gray-700"
                }`}
              >
                Email <span className="text-xs text-gray-400">(optional)</span>
              </label>
              <Field
                type="email"
                id="email"
                name="email"
                placeholder="example@example.com"
                className={`${isDarkMode ? DefaultInputDarkStyle : DefaultInputLightStyle}`}
                />
              <ErrorMessage
                name="email"
                component="p"
                className="text-red-500 text-xs italic"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="birthday"
                className={`block text-sm font-bold mb-2 text-${
                  isDarkMode ? "white" : "gray-700"
                }`}
              >
                Birthday{" "}
                <span className="text-xs text-gray-400">(optional)</span>
              </label>
              <div className="relative">
                <Field
                  type="date"
                  id="birthday"
                  name="birthday"
                  className={`${isDarkMode ? IconInputDarkStyle : IconInputLightStyle}`}
                  />
                <FaBirthdayCake className="absolute left-2 top-3 text-gray-400" />
              </div>
              <ErrorMessage
                name="birthday"
                component="p"
                className="text-red-500 text-xs italic"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="address"
                className={`block text-sm font-bold mb-2 text-${
                  isDarkMode ? "white" : "gray-700"
                }`}
              >
                Address{" "}
                <span className="text-xs text-gray-400">(optional)</span>
              </label>
              <div className="relative">
                <Field
                  type="text"
                  id="address"
                  name="address"
                  placeholder="123 Main St"
                  className={`${isDarkMode ? IconInputDarkStyle : IconInputLightStyle}`}
                />
                <FaAddressCard className="absolute left-2 top-3 text-gray-400" />
              </div>
              <ErrorMessage
                name="address"
                component="p"
                className="text-red-500 text-xs italic"
              />
            </div>
            <div className="flex items-center justify-end mt-8">
                <UpdateButton disabled={isSubmitting} />
              </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default UpdateCustomer;
