import React, { useState, useEffect } from "react";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import ImageUpload from "../../../components/ImageUpload";
import { FaSpinner, FaTrash } from "react-icons/fa";
import instance from "../../../axiosConfig/axiosConfig";

const DashboardSettings = () => {
  const [settingsData, setSettingsData] = useState(null);
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

      const response = await instance.get("admin/id", {
        headers: {
          Authorization: token,
        },
      });
      console.log(response.data.admin);
      setSettingsData({
        username: response.data.admin.username,
        websiteTitle: response.data.admin.websiteTitle,
        logo: response.data.admin.logo,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleFormSubmit = async (values, { setSubmitting }) => {
    try {
      console.log("submitting");
      const token = localStorage.getItem("ag_app_admin_token");
      if (!token) {
        console.error("Token not found");
        return;
      }

      const formData = new FormData();
      if (values.logo) {
        formData.append("image", values.logo);
        formData.append("existingImg", settingsData.logo);
      }
      // Upload the image if it exists
      if (values.logo) {
        const uploadResponse = await instance.post(
          "admin/uploads-logo",
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

        // Update the admin data with new image name
        values.logo.filename = filename;
      }

      // Update the admin data with new values
      const patchData = {
        username: values.title || settingsData.username,
        websiteTitle: values.websiteTitle || settingsData.websiteTitle,
        logo: (values.logo && values.logo.filename) || settingsData.logo,
      };

      if (values.password) {
        patchData.password = values.password;
      }

      const updateResponse = await instance.patch("admin", patchData, {
        headers: {
          Authorization: token,
        },
      });
      alert("Data saved successfully");
      console.log(updateResponse.data); // Updated admin data
      fetchAdminData(); // Call fetchAdminData to update the data after submit
    } catch (error) {
      console.log(error);
    }

    setSubmitting(false);
  };

  const deleteImage = (formikProps) => {
    formikProps.setFieldValue(`settingsData.logo`, null);
    setHiddenImage(true);
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-4">Settings</h1>
      {settingsData ? (
        <Formik
          initialValues={{
            username: settingsData.username,
            websiteTitle: settingsData.websiteTitle,
            password: "",
            logo: null,
          }}
          validationSchema={Yup.object({
            username: Yup.string(),
            websiteTitle: Yup.string(),
            password: Yup.string(),
          })}
          onSubmit={handleFormSubmit}
        >
          {(formikProps) => (
            <form onSubmit={formikProps.handleSubmit}>
              <div className="mb-4">
                <label htmlFor={`username`} className="block font-medium mb-1">
                  Username
                </label>
                <input
                  type="text"
                  id={`username`}
                  name={`username`}
                  value={formikProps.values.username}
                  onChange={formikProps.handleChange}
                  className="border-gray-300 border rounded-md p-2 w-full"
                />
                <ErrorMessage
                  name={`username`}
                  component="div"
                  className="text-red-600"
                />

                <label
                  htmlFor={`password`}
                  className="block font-medium mb-1 mt-4"
                >
                  Password
                </label>
                <input
                  type="password"
                  id={`password`}
                  name={`password`}
                  placeholder="Enter a new password"
                  value={formikProps.values.password}
                  onChange={formikProps.handleChange}
                  className="border-gray-300 border rounded-md p-2 w-full"
                />
                <ErrorMessage
                  name={`password`}
                  component="div"
                  className="text-red-600"
                />

                <label
                  htmlFor={`websiteTitle`}
                  className="block font-medium mb-1 mt-4"
                >
                  Website Title
                </label>
                <input
                  type="websiteTitle"
                  id={`websiteTitle`}
                  name={`websiteTitle`}
                  value={formikProps.values.websiteTitle}
                  onChange={formikProps.handleChange}
                  className="border-gray-300 border rounded-md p-2 w-full"
                />
                <ErrorMessage
                  name={`websiteTitle`}
                  component="div"
                  className="text-red-600"
                />

                <label
                  htmlFor={`websiteTitle`}
                  className="block font-medium mb-1 mt-4"
                >
                  Logo
                </label>

                {!hiddenImage && (
                  <div className="relative h-40 border-2 border-dashed rounded-md flex items center justify-center">
                    <img
  src={
    process.env.REACT_APP_DEVELOPMENT
      ? `${process.env.REACT_APP_IMAGE_URI_DEV}uploads/admin/${settingsData.logo}`
      : `${process.env.REACT_APP_IMAGE_URI}uploads/admin/${settingsData.logo}`
  }
  alt={settingsData.logo}
  className="rounded-md h-[100%]"
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

                {hiddenImage && settingsData.logo && (
                  <div>
                    <ImageUpload
                      field={{
                        name: `logo`,
                        value: formikProps.values.logo,
                        onChange: (file) =>
                          formikProps.setFieldValue(`logo`, file),
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

export default DashboardSettings;
