import React, { useState, useEffect } from "react";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import ImageUpload from "../components/ImageUpload";
import { FaSpinner, FaTrash } from "react-icons/fa";

const DashboardSection1 = () => {
  const [section1Data, setSection1Data] = useState(null);
  const [hiddenImage, setHiddenImage] = useState(false);

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
      console.log(response.data.admin.section1Data);
      setSection1Data(response.data.admin.section1Data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFormSubmit = async (values, { setSubmitting }) => {
    try {
      const token = localStorage.getItem("ag_app_admin_token");
      if (!token) {
        console.error("Token not found");
        return;
      }

      const formData = new FormData();
      formData.append("image", values.image);
      formData.append("existingImg", section1Data.image);
      // Upload the image
      const uploadResponse = await axios.post(
        "http://localhost:4040/admin/uploads-section1-imgs",
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
        section1Data: {
          title: values.title,
          image: filename,
          content: values.content,
        },
      };

      const updateResponse = await axios.patch(
        "http://localhost:4040/admin",
        patchData,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      alert("Data saved successfully");
      console.log(updateResponse.data); // Updated admin data
      fetchAdminData(); // Call fetchAdminData to update the data after submit
    } catch (error) {
      console.log(error);
    }

    setSubmitting(false);
  };

  const deleteImage = (formikProps) => {
    formikProps.setFieldValue(`section1Data.image`, null);
    setHiddenImage(true);
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-4">Dashboard Section 1</h1>
      {section1Data ? (
        <Formik
          initialValues={{
            title: section1Data.title,
            content: section1Data.content,
            image: null,
          }}
          validationSchema={Yup.object({
            title: Yup.string().required("Required"),
            content: Yup.string().required("Required"),
            image: Yup.string().required("Required"),
          })}
          onSubmit={handleFormSubmit}
        >
          {(formikProps) => (
            <form onSubmit={formikProps.handleSubmit}>
              <div className="mb-4">
                <label htmlFor={`title`} className="block font-medium mb-1">
                  Title
                </label>
                <input
                  type="text"
                  id={`title`}
                  name={`title`}
                  value={formikProps.values.title}
                  onChange={formikProps.handleChange}
                  className="border-gray-300 border rounded-md p-2 w-full"
                />
                <ErrorMessage
                  name={`title`}
                  component="div"
                  className="text-red-600"
                />

                <label
                  htmlFor={`content`}
                  className="block font-medium mb-1 mt-4"
                >
                  Content
                </label>
                <textarea
                  id={`content`}
                  name={`content`}
                  value={formikProps.values.content}
                  onChange={formikProps.handleChange}
                  className="border-gray-300 border rounded-md p-2 w-full"
                />
                <ErrorMessage
                  name={`content`}
                  component="div"
                  className="text-red-600"
                />

                {!hiddenImage && (
                  <div className="relative">
                    <img
                      src={`http://localhost:4040/uploads/admin/${section1Data.image}`}
                      alt={`${section1Data.image}`}
                      className="w-screen rounded-md max-h-40 object-cover mt-2"
                    />
                    <button
                      type="button"
                      onClick={() => deleteImage(formikProps)}
                      className="text-red-600 font-medium mt-2 absolute right-1 top-1"
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}

                {hiddenImage && section1Data.image && (
                  <div>
                    <ImageUpload
                      field={{
                        name: `image`,
                        value: formikProps.values.image,
                        onChange: (file) =>
                          formikProps.setFieldValue(`image`, file),
                        onBlur: formikProps.handleBlur,
                      }}
                      form={formikProps}
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Submit
              </button>
            </form>
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
    </div>
  );
};

export default DashboardSection1;