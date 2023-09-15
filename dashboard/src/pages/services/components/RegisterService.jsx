import React, { useContext, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ImageUpload from "../../../components/ImageUpload";
import { SidebarContext } from "../../../context/SidebarContext";
import instance from "../../../axiosConfig/axiosConfig";
import { NotificationContext } from "../../../context/NotificationContext";
import { DarkModeContext } from "../../../context/DarkModeContext";
import { v4 } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../../services/fireBaseStorage";
import ProgressBar from "../../../components/ProgressBar";
import { Store } from "react-notifications-component";
import { DefaultInputDarkStyle, DefaultInputLightStyle, LoadingRegisterButton } from "../../../components/Styled";

const RegisterService = ({ setModelState }) => {
  const { sendNotification } = useContext(NotificationContext);
  const { shopId } = useContext(SidebarContext);
  const { isDarkMode } = useContext(DarkModeContext);
  const [isRegistering, setIsRegistering] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0);

  const notify = (title, message, type) => {
    Store.addNotification({
      title: title,
      message: message,
      type: type,
      insert: 'top',
      container: 'bottom-center',
      animationIn: ['animated', 'fadeIn'],
      animationOut: ['animated', 'fadeOut'],
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

  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    price: Yup.number().required("Required"),
    duration: Yup.string().required("Duration is required"),
    serviceImg: Yup.mixed().required("Service Picture is required"),
  });

  const handleFormSubmit = async (values, { setSubmitting }) => {
    try {
      setIsRegistering(true)
      const token = localStorage.getItem("ag_app_shop_token");
      if (!token) {
        console.error("Token not found");
        return;
      }
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
              const postData = {
                name: values.name,
                price: values.price,
                duration: d,
                serviceImg: serviceImg,
                managerId: shopId,
              };

              instance
                .post("services", postData, {
                  headers: {
                    Authorization: token,
                  },
                })
                .then((res) => {
                  notify("New Service", `New Service "${values.name}" has been registered`, "success")
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
                  setIsRegistering(false);
                  setModelState(false);
                })
                .catch((error) => {
                  notify("Error", `Some of the data has already been registered before`, "danger");
                });
            });
        }
      );
    } catch (error) {
      console.log(error);
    }

    setSubmitting(false);

  };

  return (
    <div
      className={`bg-${
        isDarkMode ? "gray-800" : "white"
      } transition-all duration-300  shadow-lg rounded-md m-2`}
    >
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
            isDarkMode ? "gray-800" : "white"
          } rounded px-8 pt-6 pb-8 mb-4`}
        >
            <div className="w-full">
            <div className="mb-4">
              <label
                htmlFor="name"
                className={`block text-sm font-bold mb-2 text-${isDarkMode ? "white" : "gray-700"
                  }`}
              >
                Name
              </label>
              <Field
                type="text"
                id="name"
                name="name"
                placeholder="Enter the name of the service"
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
                htmlFor="price"
                className={`block text-sm font-bold mb-2 text-${isDarkMode ? "white" : "gray-700"
                  }`}
              >
                Price
              </label>
              <Field
                type="number"
                id="price"
                name="price"
                placeholder="0.00"
                className={`${isDarkMode ? DefaultInputDarkStyle : DefaultInputLightStyle}`}
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
                className={`block text-sm font-bold mb-2 text-${isDarkMode ? "white" : "gray-700"
                  }`}
              >
                Duration
              </label>
              <Field
                name="duration"
                as="select"
                className={`${isDarkMode ? DefaultInputDarkStyle : DefaultInputLightStyle}`}
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
                className={`block text-sm font-bold mb-2 text-${isDarkMode ? "white" : "gray-700"
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
            </div>

           <div className="w-full mt-auto">
            <hr className="mb-3"/>

           <div className="mb-4">
              <ProgressBar progress={uploadProgress} />
            </div>

            <div className="flex items-center justify-end mt-8">
              <LoadingRegisterButton 
                 disabled={formikProps.isSubmitting}
                 isRegistering={isRegistering}
              />
            </div>
           </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default RegisterService;
