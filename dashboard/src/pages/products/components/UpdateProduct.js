import React, { useContext, useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { SidebarContext } from "../../../context/SidebarContext";
import ImageUpload from "../../../components/ImageUpload";
import { FaSpinner, FaTrash } from "react-icons/fa";
import instance from "../../../axiosConfig/axiosConfig";
import { AlertContext } from "../../../context/AlertContext";
import { NotificationContext } from "../../../context/NotificationContext";
import { DarkModeContext } from "../../../context/DarkModeContext";

const UpdateProduct = ({ setModelState, productId }) => {
  const { setAlertOn, setAlertMsg, setAlertMsgType } =
    React.useContext(AlertContext);
  const { sendNotification } = useContext(NotificationContext);
  const { isDarkMode } = useContext(DarkModeContext);
  const token = localStorage.getItem("ag_app_shop_token");
  const [productData, setProductData] = useState(null);
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

  const { shopId } = useContext(SidebarContext);
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
      const token = localStorage.getItem("ag_app_shop_token");
      if (!token) {
        console.error("Token not found");
        return;
      }
      const formData = new FormData();
      if (values.productImg) {
        formData.append("productImg", values.productImg);

        // Upload the image
        const uploadResponse = await instance.post(
          "products/imageUpload",
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
        values.productImg = filename;
      }

      // Update the admin data with new values (including the image name)
      const patchData = {
        name: values.name || productData.name,
        speciality: values.speciality || productData.speciality,
        costBRL: values.costBRL || productData.costBRL,
        price: values.price || productData.price,
        stock: values.stock || productData.stock,
        productImg: values.productImg || productData.productImg,
      };

      const updateResponse = await instance.patch(
        `products/${productId}`,
        patchData,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setAlertMsg("Product has been updated");
      setAlertMsgType("success");
      setAlertOn(true);
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
    } catch (error) {
      console.log(error);
    }

    setSubmitting(false);
    setModelState(false);
  };

  const deleteProductImg = () => {
    instance
      .delete(`products/image/${productData.productImg}`, {
        headers: {
          Authorization: token,
        },
        data: {
          id: productData._id,
        },
      })
      .then((response) => {
        // Update productData with the empty product image
        setProductData({ ...productData, productImg: "" });
      })
      .catch((error) => console.log(error));
  };

  return (
    <>
      <h2
        className={`text-xl text-left font-bold mb-4 text-${
          isDarkMode ? "white" : "gray-700"
        }`}
      >
        Update Product
      </h2>
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
              className={`bg-${
                isDarkMode ? "gray-700" : "white"
              } text-left rounded px-8 pt-6 pb-8 mb-4 overflow-y-auto min-w-[350px] sm:min-w-[500px] mx-auto`}
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
                  placeholder="Enter the speciality of the product"
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
                {productData.productImg ? (
                  <div className="relative h-40 border-2 border-dashed rounded-md flex items center justify-center">
                    <img
                      src={`${process.env.REACT_APP_API}uploads/products/${productData.productImg}`}
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
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className={`bg-${
                    isDarkMode ? "gray-800" : "gray-600"
                  } hover:bg-${
                    isDarkMode ? "gray-600" : "gray-400"
                  } text-white text-sm font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
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

export default UpdateProduct;
