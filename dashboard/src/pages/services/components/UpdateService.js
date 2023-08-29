import React, { useContext, useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ImageUpload from "../../../components/ImageUpload";
import { FaSpinner, FaTrash } from "react-icons/fa";
import instance from "../../../axiosConfig/axiosConfig";
import { AlertContext } from "../../../context/AlertContext";
import { NotificationContext } from "../../../context/NotificationContext";
import { DarkModeContext } from "../../../context/DarkModeContext";

const UpdateService = ({ setModelState, serviceId }) => {
  const { setAlertOn, setAlertMsg, setAlertMsgType } =
    React.useContext(AlertContext);
  const { sendNotification } = useContext(NotificationContext);
  const { isDarkMode } = useContext(DarkModeContext);
  const token = localStorage.getItem("ag_app_shop_token");
  const [serviceData, setServiceData] = useState(null);
  useEffect(() => {
    instance
      .get(`services/${serviceId}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setServiceData(response.data.service);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, []);

  const validationSchema = Yup.object({
    name: Yup.string(),
    price: Yup.number(),
    duration: Yup.string(),
  });

  const handleFormSubmit = async (values, { setSubmitting }) => {
    try {
      const token = localStorage.getItem("ag_app_shop_token");
      if (!token) {
        console.error("Token not found");
        return;
      }
      const formData = new FormData();
      if (values.serviceImg) {
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
        values.serviceImg = filename;
      }

      // Update the admin data with new values (including the image name)
      const d = +values.duration;
      const patchData = {
        name: values.name || serviceData.name,
        price: values.price || serviceData.price,
        duration: d || serviceData.duration,
        serviceImg: values.serviceImg || serviceData.serviceImg,
      };

      const updateResponse = await instance.patch(
        `services/${serviceId}`,
        patchData,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setAlertMsg("Service has been updated");
      setAlertMsgType("success");
      setAlertOn(true);
      sendNotification(
        "Service updated - " +
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

  const deleteServiceImg = () => {
    instance
      .delete(`services/image/${serviceData.serviceImg}`, {
        headers: {
          Authorization: token,
        },
        data: {
          id: serviceData._id,
        },
      })
      .then((response) => {
        // Update serviceData with the empty service image
        setServiceData({ ...serviceData, serviceImg: "" });
      })
      .catch((error) => console.log(error));
  };

  return (
    <>
      <h2
        className={`text-xl font-bold mb-4 text-${
          isDarkMode ? "white" : "gray-700"
        }`}
      >
        Update Service
      </h2>
      {serviceData ? (
        <Formik
          initialValues={{
            name: serviceData.name,
            price: serviceData.price,
            duration: serviceData.duration,
            serviceImg: null,
          }}
          validationSchema={validationSchema}
          onSubmit={handleFormSubmit}
        >
          {(formikProps) => (
            <Form
              className={`bg-${
                isDarkMode ? "gray-700" : "white"
              } text-left rounded px-8 pt-6 pb-8 mb-4 overflow-y-auto min-w-[350px] sm:min-w-[500px] mx-auto`}
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
                  placeholder="Enter the new name of the service"
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
                {serviceData.serviceImg ? (
                  <div className="relative h-40 border-2 border-dashed rounded-md flex items-center justify-center">
                    <img
  src={
    process.env.REACT_APP_DEVELOPMENT === "true"
      ? `${process.env.REACT_APP_IMAGE_URI_DEV}uploads/services/${serviceData.serviceImg}`
      : `${process.env.REACT_APP_IMAGE_URI}uploads/services/${serviceData.serviceImg}`
  }
  alt={serviceData.serviceImg}
  className="rounded-md h-[100%]"
/>

                    <button
                      type="button"
                      className="absolute right-2 top-2 hover:bg-gray-800 hover:bg-opacity-25 rounded-full w-8 h-8 flex justify-center items-center"
                      onClick={deleteServiceImg}
                    >
                      <FaTrash size={15} className="text-red-500" />
                    </button>
                  </div>
                ) : (
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
                )}
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className={`bg-gray-800 hover:bg-gray-600 text-white text-sm font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
                  disabled={formikProps.isSubmitting}
                >
                  Update
                </button>
              </div>
            </Form>
          )}
        </Formik>
      ) : (
        <div className="flex items-center justify-center h-screen">
          <div className="flex flex-col justify-center items-center space-x-2">
            <FaSpinner className="animate-spin text-4xl text-blue-500" />
            <span className="mt-2">Loading...</span>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateService;
