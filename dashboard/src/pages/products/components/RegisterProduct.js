import React, { useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { SidebarContext } from "../../../context/SidebarContext";
import ImageUpload from "../../../components/ImageUpload";
import instance from "../../../axiosConfig/axiosConfig";
import { AlertContext } from "../../../context/AlertContext";
import { NotificationContext } from "../../../context/NotificationContext";
import { DarkModeContext } from "../../../context/DarkModeContext";
import { storage } from "../../../services/fireBaseStorage";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { v4 } from "uuid";

const RegisterProduct = ({ setModelState }) => {
  const { setAlertOn, setAlertMsg, setAlertMsgType } =
    React.useContext(AlertContext);
  const { sendNotification } = useContext(NotificationContext);
  const { isDarkMode } = useContext(DarkModeContext);
  const { shopId } = useContext(SidebarContext);
  const initialValues = {
    name: "",
    speciality: "",
    costBRL: "",
    price: "",
    stock: "",
    productImg: null,
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    speciality: Yup.string().required("Speciality is required"),
    costBRL: Yup.number()
      .required("Cost is required")
      .positive("Cost must be a positive number"),
    price: Yup.number()
      .required("Price is required")
      .positive("Price must be a positive number"),
    stock: Yup.number()
      .required("Stock is required")
      .integer("Stock must be an integer")
      .min(0, "Stock must be a non-negative number"),
    productImg: Yup.mixed().required("Product Picture is required"),
  });

  const handleFormSubmit = async (values, { setSubmitting }) => {
    try {
      console.log(
        process.env.REACT_APP_IMAGE_URI
      );
      const token = localStorage.getItem("ag_app_shop_token");
      if (!token) {
        console.error("Token not found");
        return;
      }
      console.log("uploading ....");
      if (values.productImg === null) return;
      let imageName = v4(values.productImg.name);
      const fileRef = ref(storage, `products/${imageName}`);
      const uploadTask = uploadBytesResumable(fileRef, values.productImg);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          let progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(progress);
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
                  setAlertMsg("Product has been registered");
                  setAlertMsgType("success");
                  setAlertOn(true);
                  sendNotification(
                    "New Product - " +
                      new Intl.DateTimeFormat("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }).format(new Date())
                  );
                  setModelState(false);
                })
                .catch((error) => {
                  console.log(error);
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
    <>
      <h2
        className={`text-xl font-bold mb-4 text-${
          isDarkMode ? "white" : "gray-700"
        }`}
      >
        Register a Product
      </h2>
      <Formik
        initialValues={initialValues}
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
                className={`block text-sm ${
                  isDarkMode ? "text-white" : "text-gray-700"
                } font-bold mb-2`}
              >
                Name
              </label>
              <Field
                type="text"
                id="name"
                name="name"
                placeholder="Product Name"
                className={`py-2 pl-8 border-b-2 border-${
                  isDarkMode ? "gray-600" : "gray-300"
                } text-${isDarkMode ? "white" : "gray-700"} bg-${
                  isDarkMode ? "gray-500" : "white"
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
                htmlFor="speciality"
                className={`block text-sm ${
                  isDarkMode ? "text-white" : "text-gray-700"
                } font-bold mb-2`}
              >
                Speciality
              </label>
              <Field
                type="text"
                id="speciality"
                name="speciality"
                placeholder="Product Speciality"
                className={`py-2 pl-8 border-b-2 border-${
                  isDarkMode ? "gray-600" : "gray-300"
                } text-${isDarkMode ? "white" : "gray-700"} bg-${
                  isDarkMode ? "gray-500" : "white"
                } focus:outline-none focus:border-blue-500 w-full`}
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
                  Cost (BRL)
                </label>
                <Field
                  type="number"
                  id="costBRL"
                  name="costBRL"
                  placeholder="0.00"
                  className={`py-2 pl-8 border-b-2 border-${
                    isDarkMode ? "gray-600" : "gray-300"
                  } text-${isDarkMode ? "white" : "gray-700"} bg-${
                    isDarkMode ? "gray-500" : "white"
                  } focus:outline-none focus:border-blue-500 w-full`}
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
                    isDarkMode ? "gray-500" : "white"
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
                  htmlFor="stock"
                  className={`block text-sm ${
                    isDarkMode ? "text-white" : "text-gray-700"
                  } font-bold mb-2`}
                >
                  Stock
                </label>
                <Field
                  type="number"
                  id="stock"
                  name="stock"
                  placeholder="0"
                  className={`py-2 pl-8 border-b-2 border-${
                    isDarkMode ? "gray-600" : "gray-300"
                  } text-${isDarkMode ? "white" : "gray-700"} bg-${
                    isDarkMode ? "gray-500" : "white"
                  } focus:outline-none focus:border-blue-500 w-full`}
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
                Image
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
            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={formikProps.isSubmitting}
                className={`bg-${
                  isDarkMode ? "gray-800" : "gray-600"
                } hover:bg-${
                  isDarkMode ? "gray-600" : "gray-400"
                } text-white text-sm font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
              >
                Register Product
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default RegisterProduct;
