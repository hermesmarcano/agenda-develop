import React, { useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { SidebarContext } from "../../../context/SidebarContext";
import instance from "../../../axiosConfig/axiosConfig";
import { AlertContext } from "../../../context/AlertContext";
import { NotificationContext } from "../../../context/NotificationContext";
import { DarkModeContext } from "../../../context/DarkModeContext";
import { FaBirthdayCake, FaAddressCard, FaEnvelope } from "react-icons/fa"; // Import React Icons
import {
  DefaultInputDarkStyle,
  DefaultInputLightStyle,
  IconInputDarkStyle,
  IconInputLightStyle,
  RegisterButton,
} from "../../../components/Styled";
import { Store } from "react-notifications-component";
import i18next from "i18next";
import { useTranslation } from "react-i18next";

const RegisterCustomer = ({ setModelState }) => {
  const { t } = useTranslation();
  const { sendNotification } = useContext(NotificationContext);
  const { shopId } = useContext(SidebarContext);
  const { isDarkMode } = useContext(DarkModeContext);

  const initialValues = {
    name: "",
    phone: "",
    email: "",
    birthday: "",
    address: "",
  };

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

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t("Name is required")),
    phone: Yup.string().required(t("Phone is required")),
    email: Yup.string().email(t("Invalid email format")),
    birthday: Yup.date().nullable(),
    address: Yup.string(),
  });

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    const postData = {
      name: values.name,
      phone: values.phone,
      managerId: shopId,
    };

    if (values.email) {
      postData.email = values.email;
    }

    if (values.birthday) {
      postData.birthday = values.birthday;
    }

    if (values.address) {
      postData.address = values.address;
    }

    function getCurrentLanguage() {
      return i18next.language || "en";
    }

    const fetchRequest = async () => {
      try {
        const response = await instance.post("customers/", postData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("ag_app_shop_token"),
          },
        });
        notify(
          t("New Customer"),
          `${t("New Customer")} "${values.name}" ${t("has registered")}`,
          "success"
        );
        sendNotification(
          `${t("New Customer")} - ` +
            new Intl.DateTimeFormat(getCurrentLanguage(), {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }).format(new Date())
        );
      } catch (e) {
        notify(
          t("Error"),
          t(`Some of the data has already been registered before`),
          "danger"
        );
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
        isDarkMode ? "gray-800" : "white"
      } transition-all duration-300  shadow-lg rounded-md m-2`}
    >
      <Formik
        initialValues={initialValues}
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
                className={`block text-sm text-${
                  isDarkMode ? "white" : "gray-700"
                } font-bold mb-2`}
              >
                {t("Name")}
              </label>
              <Field
                type="text"
                id="name"
                name="name"
                placeholder="John Doe"
                className={`${
                  isDarkMode ? DefaultInputDarkStyle : DefaultInputLightStyle
                }`}
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
                {t("Phone")}
              </label>
              <Field
                type="tel"
                id="phone"
                name="phone"
                placeholder="123-456-7890"
                className={`${
                  isDarkMode ? DefaultInputDarkStyle : DefaultInputLightStyle
                }`}
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
                className={`block text-sm text-${
                  isDarkMode ? "white" : "gray-700"
                } font-bold mb-2`}
              >
                {t("Email")}{" "}
                <span className="text-xs text-gray-400">({t("optional")})</span>
              </label>
              <Field
                type="email"
                id="email"
                name="email"
                placeholder={t("example@example.com")}
                className={`${
                  isDarkMode ? DefaultInputDarkStyle : DefaultInputLightStyle
                }`}
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
                className={`block text-sm text-${
                  isDarkMode ? "white" : "gray-700"
                } font-bold mb-2`}
              >
                {t("Birthday")}{" "}
                <span className="text-xs text-gray-400">({t("optional")})</span>
              </label>
              <div className="relative">
                <Field
                  type="date"
                  id="birthday"
                  name="birthday"
                  className={`${
                    isDarkMode ? IconInputDarkStyle : IconInputLightStyle
                  }`}
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
                className={`block text-sm text-${
                  isDarkMode ? "white" : "gray-700"
                } font-bold mb-2`}
              >
                {t("Address")}{" "}
                <span className="text-xs text-gray-400">({t("optional")})</span>
              </label>
              <div className="relative">
                <Field
                  type="text"
                  id="address"
                  name="address"
                  placeholder={t("123 Main St")}
                  className={`${
                    isDarkMode ? IconInputDarkStyle : IconInputLightStyle
                  }`}
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
              <RegisterButton />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default RegisterCustomer;
