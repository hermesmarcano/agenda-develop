import React, { useContext, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { SidebarContext } from "../../../context/SidebarContext";
import ImageUpload from "../../../components/ImageUpload";
import instance from "../../../axiosConfig/axiosConfig";
import { NotificationContext } from "../../../context/NotificationContext";
import { DarkModeContext } from "../../../context/DarkModeContext";
import { storage } from "../../../services/firebaseStorage";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { v4 } from "uuid";
import ProgressBar from "../../../components/ProgressBar";
import { Store } from "react-notifications-component";
import {
  DefaultInputDarkStyle,
  DefaultInputLightStyle,
  LoadingRegisterButton,
} from "../../../components/Styled";
import { ShopNameContext } from "../../../context/ShopNameContext";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

const RegisterProduct = ({ setModelState }) => {
  const { t } = useTranslation();
  const { sendNotification } = useContext(NotificationContext);
  const { isDarkMode } = useContext(DarkModeContext);
  const { shopId } = useContext(SidebarContext);
  const { shopName } = useContext(ShopNameContext);
  const [isRegistering, setIsRegistering] = useState(false);
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

  const initialValues = {
    name: "",
    speciality: "",
    costBRL: "",
    price: "",
    stock: "",
    productImg: null,
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t("Name is required")),
    speciality: Yup.string().required(t("Speciality is required")),
    costBRL: Yup.number()
      .required(t("Cost is required"))
      .positive(t("Cost must be a positive number")),
    price: Yup.number()
      .required(t("Price is required"))
      .positive(t("Price must be a positive number")),
    stock: Yup.number()
      .required(t("Stock is required"))
      .integer(t("Stock must be an integer"))
      .min(0, t("Stock must be a non-negative number")),
    productImg: Yup.mixed().required(t("Product Picture is required")),
  });

  function getCurrentLanguage() {
    return i18next.language || "en";
  }

  const handleFormSubmit = async (values, { setSubmitting }) => {
    try {
      setIsRegistering(true);
      console.log(process.env.REACT_APP_IMAGE_URI);
      const token = localStorage.getItem("ag_app_shop_token");
      if (!token) {
        console.error("Token not found");
        return;
      }
      console.log("uploading ....");
      if (values.productImg === null) return;
      let imageName = v4(values.productImg.name);
      const fileRef = ref(storage, `${shopName}/products/${imageName}`);
      const uploadTask = uploadBytesResumable(fileRef, values.productImg);

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
          let productImg = null;
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              console.log(downloadURL);
              productImg = downloadURL;
            })
            .then(() => {
              const postData = {
                name: values.name,
                speciality: values.speciality,
                costBRL: values.costBRL,
                price: values.costBRL,
                stock: values.stock,
                managerId: shopId,
                productImg: productImg,
              };

              instance
                .post("products", postData, {
                  headers: {
                    Authorization: token,
                  },
                })
                .then((res) => {
                  console.log(res.data);
                  notify(
                    t("New Product"),
                    `${t("New Product")} "${values.name}" ${t(
                      "has been registered"
                    )}`,
                    "success"
                  );
                  sendNotification(
                    `${t("New Product")} "${values.name}" ${t(
                      "has been registered"
                    )}`
                  );
                  setIsRegistering(false);
                  setModelState(false);
                })
                .catch((error) => {
                  notify(
                    t("Error"),
                    t(`Some of the data has already been registered before`),
                    "danger"
                  );
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
        initialValues={initialValues}
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
                className={`block text-sm ${
                  isDarkMode ? "text-white" : "text-gray-700"
                } font-bold mb-2`}
              >
                {t("Name")}
              </label>
              <Field
                type="text"
                id="name"
                name="name"
                placeholder={t("Product Name")}
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
                htmlFor="speciality"
                className={`block text-sm ${
                  isDarkMode ? "text-white" : "text-gray-700"
                } font-bold mb-2`}
              >
                {t("Speciality")}
              </label>
              <Field
                type="text"
                id="speciality"
                name="speciality"
                placeholder={t("Product Speciality")}
                className={`${
                  isDarkMode ? DefaultInputDarkStyle : DefaultInputLightStyle
                }`}
              />
              <ErrorMessage
                name="speciality"
                component="p"
                className="text-red-500 text-xs italic"
              />
            </div>
            <div className="flex gap-1">
              <div className="mb-4">
                <label
                  htmlFor="costBRL"
                  className={`block text-sm ${
                    isDarkMode ? "text-white" : "text-gray-700"
                  } font-bold mb-2`}
                >
                  {t("Cost")} ({t("BRL")})
                </label>
                <Field
                  type="number"
                  id="costBRL"
                  name="costBRL"
                  placeholder="0.00"
                  className={`${
                    isDarkMode ? DefaultInputDarkStyle : DefaultInputLightStyle
                  }`}
                />
                <ErrorMessage
                  name="costBRL"
                  component="p"
                  className="text-red-500 text-xs italic"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="price"
                  className={`block text-sm ${
                    isDarkMode ? "text-white" : "text-gray-700"
                  } font-bold mb-2`}
                >
                  {t("Price")}
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
                  htmlFor="stock"
                  className={`block text-sm ${
                    isDarkMode ? "text-white" : "text-gray-700"
                  } font-bold mb-2`}
                >
                  {t("Stock")}
                </label>
                <Field
                  type="number"
                  id="stock"
                  name="stock"
                  placeholder="0"
                  className={`${
                    isDarkMode ? DefaultInputDarkStyle : DefaultInputLightStyle
                  }`}
                />
                <ErrorMessage
                  name="stock"
                  component="p"
                  className="text-red-500 text-xs italic"
                />
              </div>
            </div>
            <div className="mb-4">
              <label
                htmlFor="productImg"
                className={`block text-sm ${
                  isDarkMode ? "text-white" : "text-gray-700"
                } font-bold mb-2`}
              >
                {t("Image")}
              </label>
              <ImageUpload
                field={{
                  name: `productImg`,
                  value: formikProps.values.productImg,
                  onChange: (file) =>
                    formikProps.setFieldValue(`productImg`, file),
                  onBlur: formikProps.handleBlur,
                }}
                form={formikProps}
              />
            </div>

            <div className="mb-4">
              <ProgressBar progress={uploadProgress} />
            </div>

            <div className="flex items-center justify-end mt-8">
              <LoadingRegisterButton
                disabled={formikProps.isSubmitting}
                isRegistering={isRegistering}
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default RegisterProduct;
