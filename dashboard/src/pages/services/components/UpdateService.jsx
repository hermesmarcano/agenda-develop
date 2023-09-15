import React, { useContext, useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ImageUpload from "../../../components/ImageUpload";
import { FaTrash } from "react-icons/fa";
import instance from "../../../axiosConfig/axiosConfig";
import { NotificationContext } from "../../../context/NotificationContext";
import { DarkModeContext } from "../../../context/DarkModeContext";
import { storage } from "../../../services/fireBaseStorage";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { v4 } from "uuid";
import ProgressBar from "../../../components/ProgressBar";
import { Store } from "react-notifications-component";
import {
  DefaultInputDarkStyle,
  DefaultInputLightStyle,
  Hourglass,
  LoadingRegisterButton,
  LoadingUpdateButton,
} from "../../../components/Styled";

const UpdateService = ({ setModelState, serviceId }) => {
  const { sendNotification } = useContext(NotificationContext);
  const { isDarkMode } = useContext(DarkModeContext);
  const token = localStorage.getItem("ag_app_shop_token");
  const [serviceData, setServiceData] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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
      setIsUpdating(true);
      const token = localStorage.getItem("ag_app_shop_token");
      if (!token) {
        console.error("Token not found");
        return;
      }
      if (serviceData.serviceImg === null) {
        console.log("uploading ....");
        if (values.serviceImg === null) return;
        let imageName = v4(values.serviceImg.name);
        const fileRef = ref(storage, `services/${imageName}`);
        const uploadTask = uploadBytesResumable(fileRef, values.serviceImg);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            let progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(progress);
            setUploadProgress(progress);
          },
          (error) => {
            console.log("error");
          },
          () => {
            console.log("success");
            let serviceImg = null;
            getDownloadURL(uploadTask.snapshot.ref)
              .then((downloadURL) => {
                console.log(downloadURL);
                serviceImg = downloadURL;
              })
              .then(() => {
                const d = +values.duration;
                const patchData = {
                  name: values.name || serviceData.name,
                  price: values.price || serviceData.price,
                  duration: d || serviceData.duration,
                  serviceImg: serviceImg,
                };

                instance
                  .patch(`services/${serviceId}`, patchData, {
                    headers: {
                      Authorization: token,
                    },
                  })
                  .then((res) => {
                    console.log(res);
                    setServiceData((prev) => ({ ...prev, patchData }));
                    notify(
                      "Update",
                      `"Service ${values.name}" has been updated`,
                      "success"
                    );
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
                    setIsUpdating(false);
                    setModelState(false);
                  })
                  .catch((error) => {
                    notify(
                      "Error",
                      `Some of the data has already been registered before`,
                      "danger"
                    );
                  });
              });
          }
        );
      } else {
        const d = +values.duration;
        const patchData = {
          name: values.name || serviceData.name,
          price: values.price || serviceData.price,
          duration: d || serviceData.duration,
        };

        instance
          .patch(`services/${serviceId}`, patchData, {
            headers: {
              Authorization: token,
            },
          })
          .then((res) => {
            console.log(res);
            setServiceData((prev) => ({ ...prev, patchData }));
            notify(
              "Update",
              `"Service ${values.name}" has been updated`,
              "success"
            );
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
            setUploadProgress(100);
            setIsUpdating(false);
            setModelState(false);
          })
          .catch((error) => {
            notify(
              "Error",
              `Some of the data has already been registered before`,
              "danger"
            );
          });

        setSubmitting(false);
        setModelState(false);
      }
    } catch (error) {
      console.log(error);
    }

    setSubmitting(false);
  };

  const deleteServiceImg = () => {
    const desertRef = ref(storage, serviceData.serviceImg);

    deleteObject(desertRef)
      .then(() => {
        setServiceData((prev) => ({ ...prev, serviceImg: null }));
      })
      .then(() => {
        instance
          .patch(
            `services/${serviceId}`,
            { serviceImg: null },
            {
              headers: {
                Authorization: token,
              },
            }
          )
          .then((res) => {
            console.log(res.data);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div
      className={`bg-${
        isDarkMode ? "gray-800" : "white"
      } transition-all duration-300  shadow-lg rounded-md m-2`}
    >
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
                  placeholder="Enter the new name of the service"
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
                  className={`${
                    isDarkMode ? DefaultInputDarkStyle : DefaultInputLightStyle
                  }`}
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
                  className={`${
                    isDarkMode ? DefaultInputDarkStyle : DefaultInputLightStyle
                  }`}
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
                      src={serviceData.serviceImg}
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

              <div className="mb-4">
                <ProgressBar progress={uploadProgress} />
              </div>

              <div className="flex items-center justify-end mt-8">
                <LoadingUpdateButton
                  disabled={formikProps.isSubmitting}
                  isUpdating={isUpdating}
                />
              </div>
            </Form>
          )}
        </Formik>
      ) : (
        <div className="flex items-center justify-center h-screen">
          <Hourglass />
        </div>
      )}
    </div>
  );
};

export default UpdateService;
