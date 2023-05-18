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
  const [logo, setLogo] = useState(null);

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
      console.log(response.data.admin);
      const { admin } = response.data;
      setWebsiteTitle(admin.websiteTitle);
      setAdminUsername(admin.username);
    } catch (error) {
      console.log(error);
    }
  };

  const validationSchema = Yup.object().shape({
    websiteTitle: Yup.string(),
    username: Yup.string(),
    password: Yup.string().min(6, "Password must be at least 6 characters"),
  });

  const handleSubmit = async (values) => {
    try {
      const token = localStorage.getItem("ag_app_admin_token");
      if (!token) {
        console.error("Token not found");
        return;
      }

      const { websiteTitle, username, password } = values;
      const formData = new FormData();
      formData.append("websiteTitle", websiteTitle);
      formData.append("username", username);
      formData.append("password", password);
      // if (logo) {
      //   formData.append("logo", logo, logo.name);
      // }

      // const response = await axios.patch(
      //   "http://localhost:4040/admin",
      //   formData,
      //   {
      //     headers: {
      //       Authorization: token,
      //     },
      //   }
      // );
      // alert("Data saved successfully");
      console.log({
        websiteTitle: websiteTitle,
        username: username,
        password: password,
        // logo: logo.name,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogoChange = (event) => {
    setLogo(event.target.files[0]);
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
                <ImageUpload
                  field={{
                    name: `logo`,
                    value: formikProps.values.logo,
                    onChange: (file) => formikProps.setFieldValue(`logo`, file),
                    onBlur: formikProps.handleBlur,
                  }}
                  form={formikProps}
                />
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
