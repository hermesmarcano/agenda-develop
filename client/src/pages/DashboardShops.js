import React, { useEffect, useState } from "react";
import { Formik, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import ImageUpload from "../components/ImageUpload";

const DashboardShops = () => {
  const [shopsDataArr, setShopsDataArr] = useState([]);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem("ag_app_admin_token");
      if (!token) {
        console.error("Token not found");
        return;
      }

      const response = await axios.get("http://localhost:4040/admin", {
        headers: {
          Authorization: token,
        },
      });
      console.log(response.data.admin.shopsData);
      setShopsDataArr(response.data.admin.shopsData);
    } catch (error) {
      console.log(error);
    }
  };

  const validationSchema = Yup.object().shape({
    shopsData: Yup.array().of(
      Yup.object().shape({
        title: Yup.string().required("Title is required"),
        image: Yup.mixed().required("Image is required"),
        urlSlug: Yup.string().required("URL Slug is required"),
      })
    ),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const token = localStorage.getItem("ag_app_admin_token");
      if (!token) {
        console.error("Token not found");
        return;
      }

      const uploadPromises = values.shopsData.map(async (shop, index) => {
        const formData = new FormData();
        formData.append("image", shop.image);
        shopsDataArr[index]
          ? formData.append("existingImg", shopsDataArr[index].image)
          : formData.append("existingImg", "nonExistingImg.jpeg");

        const uploadResponse = await axios.post(
          "http://localhost:4040/admin/uploads-shops-Imgs",
          formData,
          {
            headers: {
              Authorization: token,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        return {
          ...shop,
          image: uploadResponse.data.filename,
        };
      });

      const uploadedShops = await Promise.all(uploadPromises);

      const response = await axios.patch(
        "http://localhost:4040/admin/",
        { shopsData: uploadedShops },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      alert("Data saved successfully");
      console.log(response.data); // Handle success response
      fetchAdminData(); // Call fetchAdminData to update the data after submit
    } catch (error) {
      console.log(error);
      // Handle error
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-4">Dashboard Shops</h1>
      <Formik
        initialValues={{
          shopsData: Array.from({ length: 6 }, () => ({
            title: "",
            image: null,
            urlSlug: "",
          })),
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {(formikProps) => (
          <form onSubmit={formikProps.handleSubmit}>
            <FieldArray
              name="shopsData"
              render={(arrayHelpers) =>
                formikProps.values.shopsData.map((shop, index) => (
                  <div key={index} className="mb-4">
                    <label
                      htmlFor={`title${index}`}
                      className="block font-medium mb-1"
                    >
                      Title
                    </label>
                    <input
                      type="text"
                      id={`title${index}`}
                      name={`shopsData[${index}].title`}
                      value={shop.title}
                      onChange={formikProps.handleChange}
                      onBlur={formikProps.handleBlur}
                      className="border-gray-300 border rounded-md p-2 w-full"
                    />
                    <ErrorMessage
                      name={`shopsData[${index}].title`}
                      component="div"
                      className="text-red-600"
                    />

                    <label
                      htmlFor={`image${index}`}
                      className="block font-medium mb-1 mt-4"
                    >
                      Image
                    </label>
                    <ImageUpload
                      field={{
                        name: `shopsData[${index}].image`,
                        value: shop.image,
                        onChange: formikProps.handleChange,
                        onBlur: formikProps.handleBlur,
                      }}
                      form={formikProps}
                    />

                    <label
                      htmlFor={`urlSlug${index}`}
                      className="block font-medium mb-1 mt-4"
                    >
                      URL Slug
                    </label>
                    <input
                      type="text"
                      id={`urlSlug${index}`}
                      name={`shopsData[${index}].urlSlug`}
                      value={shop.urlSlug}
                      onChange={formikProps.handleChange}
                      onBlur={formikProps.handleBlur}
                      className="border-gray-300 border rounded-md p-2 w-full"
                    />
                    <ErrorMessage
                      name={`shopsData[${index}].urlSlug`}
                      component="div"
                      className="text-red-600"
                    />
                  </div>
                ))
              }
            />

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
              disabled={formikProps.isSubmitting}
            >
              Save
            </button>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default DashboardShops;
