import React, { useContext, useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ImageUpload from "../../../components/ImageUpload";
import { FaSpinner, FaTrash } from "react-icons/fa";
import instance from "../../../axiosConfig/axiosConfig";
import { AlertContext } from "../../../context/AlertContext";
import { NotificationContext } from "../../../context/NotificationContext";
import { DarkModeContext } from "../../../context/DarkModeContext";
import { storage } from "../../../services/firebaseStorage";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { v4 } from "uuid";
import ProgressBar from "../../../components/ProgressBar";
import { Store } from "react-notifications-component";
import { DefaultInputDarkStyle, DefaultInputLightStyle, Hourglass, LoadingRegisterButton, LoadingUpdateButton } from "../../../components/Styled";
import { ShopNameContext } from "../../../context/ShopNameContext";

const UpdateProduct = ({ setModelState, productId }) => {
  const { sendNotification } = useContext(NotificationContext);
  const { isDarkMode } = useContext(DarkModeContext);
  const { shopName } = useContext(ShopNameContext);
  const token = localStorage.getItem("ag_app_shop_token");
  const [productData, setProductData] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false)
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

  useEffect(() => {
    instance
      .get(`products/${productId}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setProductData(response.data.product);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, []);

  const validationSchema = Yup.object().shape({
    name: Yup.string(),
    speciality: Yup.string(),
    costBRL: Yup.number().positive("Cost must be a positive number"),
    price: Yup.number().positive("Price must be a positive number"),
    stock: Yup.number()
      .integer("Stock must be an integer")
      .min(0, "Stock must be a non-negative number"),
  });

  const handleFormSubmit = async (values, { setSubmitting }) => {
    try {
      setIsUpdating(true)
      const token = localStorage.getItem("ag_app_shop_token");
      if (!token) {
        console.error("Token not found");
        return;
      }
      if (productData.productImg === null) {
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
            setUploadProgress(progress)
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
                const patchData = {
                  name: values.name || productData.name,
                  speciality: values.speciality || productData.speciality,
                  costBRL: values.costBRL || productData.costBRL,
                  price: values.price || productData.price,
                  stock: values.stock || productData.stock,
                  productImg: productImg,
                };

                instance
                  .patch(`${shopName}/products/${productId}`, patchData, {
                    headers: {
                      Authorization: token,
                    },
                  })
                  .then((res) => {
                    console.log(res);
                    notify("Update", `"Product ${values.name}" has been updated`, "success")
                    sendNotification(
                      "Product updated - " +
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
                    notify("Error", `Some of the data has already been registered before`, "danger");
                  });
              });
          }
        );
      } else {
        const patchData = {
          name: values.name || productData.name,
          speciality: values.speciality || productData.speciality,
          costBRL: values.costBRL || productData.costBRL,
          price: values.price || productData.price,
          stock: values.stock || productData.stock,
        };

        instance
          .patch(`products/${productId}`, patchData, {
            headers: {
              Authorization: token,
            },
          })
          .then((res) => {
            console.log(res);
            notify("Update", `"Product ${values.name}" has been updated`, "success")
            sendNotification(
              "Product updated - " +
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
          });
      }
    } catch (error) {
      notify("Error", `Some of the data has already been registered before`, "danger");
    }

    setSubmitting(false);
    setModelState(false);
  };

  const deleteProductImg = () => {
    const desertRef = ref(storage, productData.productImg);

    deleteObject(desertRef)
      .then(() => {
        setProductData((prev) => ({ ...prev, productImg: null }));
      })
      .then(() => {
        instance
          .patch(
            `products/${productId}`,
            { productImg: null },
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
      {productData ? (
        <Formik
          initialValues={{
            name: productData.name,
            speciality: productData.speciality,
            costBRL: productData.costBRL,
            price: productData.price,
            stock: productData.stock,
            productImg: null,
          }}
          validationSchema={validationSchema}
          onSubmit={handleFormSubmit}
        >
          {(formikProps) => (
            <Form
            className={`bg-${isDarkMode ? "gray-700" : "white"
              } rounded px-8 pt-6 pb-8 mb-4 overflow-y-auto text-left`}
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
                  placeholder="Enter the new name of the product"
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
                  Speciality
                </label>
                <Field
                  type="text"
                  id="speciality"
                  name="speciality"
                  placeholder="Enter the speciality of the product"
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
                    Cost (BRL)
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
                  Image
                </label>
                {productData.productImg ? (
                  <div className="relative h-40 border-2 border-dashed rounded-md flex items center justify-center">
                    <img
                      src={productData.productImg}
                      alt={productData.productImg}
                      className="rounded-md h-[100%]"
                    />

                    <button
                      type="button"
                      className={`absolute right-2 top-2 hover:bg-${
                        isDarkMode ? "gray-800" : "gray-300"
                      } hover:bg-opacity-25 rounded-full w-8 h-8 flex justify-center items-center`}
                      onClick={deleteProductImg}
                    >
                      <FaTrash size={15} className="text-red-500" />
                    </button>
                  </div>
                ) : (
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

export default UpdateProduct;
