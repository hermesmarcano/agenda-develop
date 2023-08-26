import React, { useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ImageUpload from "../../../components/ImageUpload";
import { SidebarContext } from "../../../context/SidebarContext";
import instance from "../../../axiosConfig/axiosConfig";
import { AlertContext } from "../../../context/AlertContext";
import { NotificationContext } from "../../../context/NotificationContext";
import { DarkModeContext } from "../../../context/DarkModeContext";

const RegisterService = ({ setModelState }) => {
  const { setAlertOn, setAlertMsg, setAlertMsgType } =
    React.useContext(AlertContext);
  const { sendNotification } = useContext(NotificationContext);
  const { shopId } = useContext(SidebarContext);
  const { isDarkMode } = useContext(DarkModeContext);
  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    price: Yup.number().required("Required"),
    duration: Yup.string().required("Duration is required"),
    serviceImg: Yup.mixed().required("Service Picture is required"),
  });

  const handleFormSubmit = async (values, { setSubmitting }) => {
    try {
      const token = localStorage.getItem("ag_app_shop_token");
      if (!token) {
        console.error("Token not found");
        return;
      }
      const formData = new FormData();
      formData.append("serviceImg", values.serviceImg);

      // Upload the image
      const uploadResponse = await instance.post(
        "services/imageUpload",
        formData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Get the uploaded image name from the response
      const { filename } = uploadResponse.data;

      // Update the admin data with new values (including the image name)
      const d = +values.duration;
      const postData = {
        name: values.name,
        price: values.price,
        duration: d,
        serviceImg: filename,
        managerId: shopId,
      };

      const updateResponse = await instance.post("services", postData, {
        headers: {
          Authorization: token,
        },
      });
      setAlertMsg("New Service has been registered");
      setAlertMsgType("success");
      setAlertOn(true);
      sendNotification(
        "New Service - " +
          new Intl.DateTimeFormat("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }).format(new Date())
      );
    } catch (error) {
      console.log(error);
    }

    setSubmitting(false);
    setModelState(false);
  };

  return (
    <>
      <h2
        className={`text-xl font-bold mb-4 text-${
          isDarkMode ? "white" : "gray-700"
        }`}
      >
        Register a Service
      </h2>
      <Formik
        initialValues={{
          name: "",
          price: "",
          duration: "",
          serviceImg: null,
        }}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
      >
        {(formikProps) => (
          <Form
            className={`bg-${
              isDarkMode ? "gray-700" : "white"
            } rounded px-8 pt-6 pb-8 mb-4 overflow-y-auto min-w-[350px] sm:min-w-[500px] mx-auto`}
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
                placeholder="Enter the name of the service"
                className={`py-2 pl-8 border-b-2 border-${
                  isDarkMode ? "gray-600" : "gray-300"
                } text-${isDarkMode ? "white" : "gray-700"} bg-${
                  !isDarkMode ? "white" : "gray-500"
                } focus:outline-none focus:border-blue-500 w-full`}
              />
              <ErrorMessage
                name="name"
                component="p"
                className="text-red-500 text-xs italic"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="price"
                className={`block text-sm font-bold mb-2 text-${
                  isDarkMode ? "white" : "gray-700"
                }`}
              >
                Price
              </label>
              <Field
                type="number"
                id="price"
                name="price"
                placeholder="0.00"
                className={`py-2 pl-8 border-b-2 border-${
                  isDarkMode ? "gray-600" : "gray-300"
                } text-${isDarkMode ? "white" : "gray-700"} bg-${
                  !isDarkMode ? "white" : "gray-500"
                } focus:outline-none focus:border-blue-500 w-full`}
              />
              <ErrorMessage
                name="price"
                component="p"
                className="text-red-500 text-xs italic"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="duration"
                className={`block text-sm font-bold mb-2 text-${
                  isDarkMode ? "white" : "gray-700"
                }`}
              >
                Duration
              </label>
              <Field
                name="duration"
                as="select"
                className={`py-2 pl-8 border-b-2 border-${
                  isDarkMode ? "gray-600" : "gray-300"
                } text-${isDarkMode ? "white" : "gray-700"} bg-${
                  !isDarkMode ? "white" : "gray-500"
                } focus:outline-none focus:border-blue-500 w-full`}
              >
                <option value="">Select Duration</option>
                <option value="5">5 min</option>
                <option value="10">10 min</option>
                <option value="15">15 min</option>
                <option value="20">20 min</option>
                <option value="25">25 min</option>
                <option value="30">30 min</option>
                <option value="35">35 min</option>
                <option value="40">40 min</option>
                <option value="45">45 min</option>
                <option value="50">50 min</option>
                <option value="55">55 min</option>
                <option value="60">1 h</option>
              </Field>
              <ErrorMessage
                name="duration"
                component="p"
                className="text-red-500 text-xs italic"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="serviceImg"
                className={`block text-sm font-bold mb-2 text-${
                  isDarkMode ? "white" : "gray-700"
                }`}
              >
                Image
              </label>
              <ImageUpload
                field={{
                  name: `serviceImg`,
                  value: formikProps.values.serviceImg,
                  onChange: (file) =>
                    formikProps.setFieldValue(`serviceImg`, file),
                  onBlur: formikProps.handleBlur,
                }}
                form={formikProps}
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className={`bg-gray-800 hover:bg-gray-600 text-white text-sm font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
                disabled={formikProps.isSubmitting}
              >
                Register
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default RegisterService;
