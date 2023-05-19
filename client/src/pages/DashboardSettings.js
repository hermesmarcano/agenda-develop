import React, { useEffect, useState } from "react";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { FaSpinner, FaTrash } from "react-icons/fa";
import ImageUpload from "../components/ImageUpload";

const DashboardSettings = () => {
  const [websiteTitle, setWebsiteTitle] = useState("");
  const [adminUsername, setAdminUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [logo, setLogo] = useState("");

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

      const response = await axios.get("http://localhost:4040/admin/id", {
        headers: {
          Authorization: token,
        },
      });
      console.log(response.data.admin);
      const { admin } = response.data;
      setWebsiteTitle(admin.websiteTitle);
      setAdminUsername(admin.username);
      setLogo(admin.logo);
    } catch (error) {
      console.log(error);
    }
  };

  const validationSchema = Yup.object().shape({
    websiteTitle: Yup.string(),
    username: Yup.string(),
    password: Yup.string().min(6, "Password must be at least 6 characters"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const token = localStorage.getItem("ag_app_admin_token");
      if (!token) {
        console.error("Token not found");
        return;
      }

      const formData = new FormData();
      formData.append("image", values.logo);
      formData.append("existingImg", logo);
      // Upload the logo
      const uploadResponse = await axios.post(
        "http://localhost:4040/admin/uploads-logo",
        formData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Get the uploaded logo name from the response
      const { filename } = uploadResponse.data;

      // Prepare the patch data with only filled fields
      const patchData = {};
      if (values.username) {
        patchData.username = values.username;
      }
      if (values.password) {
        patchData.password = values.password;
      }
      if (values.websiteTitle) {
        patchData.websiteTitle = values.websiteTitle;
      }
      if (filename) {
        patchData.logo = filename;
      }

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

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-4">Website Settings</h1>
      {websiteTitle !== "" && adminUsername !== "" ? (
        <Formik
          initialValues={{
            username: adminUsername,
            password: "",
            websiteTitle: websiteTitle,
            logo: null,
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {(formikProps) => (
            <form onSubmit={formikProps.handleSubmit} className="max-w-sm">
              <div className="mb-4">
                <label
                  htmlFor="websiteTitle"
                  className="block text-gray-700 font-medium mb-1"
                >
                  Website Title
                </label>
                <Field
                  type="text"
                  id="websiteTitle"
                  name="websiteTitle"
                  className="border-gray-300 border rounded-md p-2 w-full"
                  placeholder="Enter your website title"
                />
                <ErrorMessage
                  name="websiteTitle"
                  component="div"
                  className="text-red-600"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="username"
                  className="block text-gray-700 font-medium mb-1"
                >
                  Admin Username
                </label>
                <Field
                  type="text"
                  id="username"
                  name="username"
                  className="border-gray-300 border rounded-md p-2 w-full"
                  placeholder="Enter the admin username"
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="text-red-600"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-gray-700 font-medium mb-1"
                >
                  New Password
                </label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  className="border-gray-300 border rounded-md p-2 w-full"
                  placeholder="Enter the new password"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-600"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="logo"
                  className="block text-gray-700 font-medium mb-1"
                >
                  Website Logo
                </label>
                {logo ? (
                  <div className="relative">
                    <img
                      src={`http://localhost:4040/uploads/admin/${logo}`}
                      className="h-40"
                      alt={logo}
                    />
                    <button
                      className="absolute right-2 top-2 text-red-500"
                      onClick={() => setLogo("")}
                    >
                      <FaTrash size={20} />
                    </button>
                  </div>
                ) : (
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
                )}
              </div>

              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
              >
                Save
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
