import React, { useContext, useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import SidebarContext from "../context/SidebarContext";
import axios from "axios";
import ImageUpload from "./ImageUpload";
import { FaSpinner, FaTrash } from "react-icons/fa";

const UpdateProduct = ({ setModelState, productId }) => {
  const [productData, setProductData] = useState(null);
  const token = localStorage.getItem("ag_app_shop_token");
  useEffect(() => {
    axios
      .get(`http://localhost:4040/products/${productId}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        console.log(response.data.product);
        setProductData(response.data.product);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, []);

  const { shopName } = useContext(SidebarContext);
  // const initialValues = {
  //   name: productData.name,
  //   speciality: productData.speciality,
  //   costBRL: productData.costBRL,
  //   price: productData.price,
  //   stock: productData.stock,
  //   productImg: null,
  // };

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
      const token = localStorage.getItem("ag_app_shop_token");
      if (!token) {
        console.error("Token not found");
        return;
      }
      const formData = new FormData();
      formData.append("productImg", values.productImg);

      // Upload the image
      const uploadResponse = await axios.post(
        "http://localhost:4040/products/imageUpload",
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

      const patchData = {
        name: values.name,
        speciality: values.speciality,
        costBRL: values.costBRL,
        price: values.costBRL,
        stock: values.stock,
        shopName: shopName,
        productImg: filename,
      };

      const updateResponse = await axios.patch(
        `http://localhost:4040/products/${productId}`,
        patchData,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(updateResponse.data);
    } catch (error) {
      console.log(error);
    }

    setSubmitting(false);
    setModelState(false);
  };

  const deleteProductImg = () => {
    axios
      .delete(
        `http://localhost:4040/products/image/${productData.productImg}`,
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        // Update productData with the empty product image
        setProductData({ ...productData, productImg: "" });
      })
      .catch((error) => console.log(error));
  };

  return (
    <>
      {productData ? (
        <>
          <h2 className="text-xl text-left font-bold mb-4">Update Product</h2>
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
            {({ isSubmitting }) => (
              <Form className="bg-white text-left rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-sm text-gray-700 font-bold mb-2"
                  >
                    Name
                  </label>
                  <Field
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Product Name"
                    className="py-2 pl-8 border-b-2 border-gray-300 text-gray-700 focus:outline-none focus:border-blue-500 w-full"
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
                    className="block text-sm text-gray-700 font-bold mb-2"
                  >
                    Speciality
                  </label>
                  <Field
                    type="text"
                    id="speciality"
                    name="speciality"
                    placeholder="Product Speciality"
                    className="py-2 pl-8 border-b-2 border-gray-300 text-gray-700 focus:outline-none focus:border-blue-500 w-full"
                  />
                  <ErrorMessage
                    name="speciality"
                    component="p"
                    className="text-red-500 text-xs italic"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="costBRL"
                    className="block text-sm text-gray-700 font-bold mb-2"
                  >
                    Cost (BRL)
                  </label>
                  <Field
                    type="number"
                    id="costBRL"
                    name="costBRL"
                    placeholder="0.00"
                    className="py-2 pl-8 border-b-2 border-gray-300 text-gray-700 focus:outline-none focus:border-blue-500 w-full"
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
                    className="block text-sm text-gray-700 font-bold mb-2"
                  >
                    Price
                  </label>
                  <Field
                    type="number"
                    id="price"
                    name="price"
                    placeholder="0.00"
                    className="py-2 pl-8 border-b-2 border-gray-300 text-gray-700 focus:outline-none focus:border-blue-500 w-full"
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
                    className="block text-sm text-gray-700 font-bold mb-2"
                  >
                    Stock
                  </label>
                  <Field
                    type="number"
                    id="stock"
                    name="stock"
                    placeholder="0"
                    className="py-2 pl-8 border-b-2 border-gray-300 text-gray-700 focus:outline-none focus:border-blue-500 w-full"
                  />
                  <ErrorMessage
                    name="stock"
                    component="p"
                    className="text-red-500 text-xs italic"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="productImg"
                    className="block text-sm text-gray-700 font-bold mb-2"
                  >
                    Image
                  </label>
                  {productData.productImg ? (
                    <div className="relative">
                      <img
                        src={`http://localhost:4040/uploads/products/${productData.productImg}`}
                        alt={productData.productImg}
                        className="rounded-md"
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-2 hover:bg-gray-800 hover:bg-opacity-25 rounded-full w-8 h-8 flex justify-center items-center"
                        onClick={deleteProductImg}
                      >
                        <FaTrash size={15} className="text-red-500" />
                      </button>
                    </div>
                  ) : (
                    <Field name="productImg" component={ImageUpload} />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Update Product
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </>
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
