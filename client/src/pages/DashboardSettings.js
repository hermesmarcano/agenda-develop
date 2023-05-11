import React, { useEffect, useState } from "react";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

const DashboardSettings = () => {
  const [initialValues, setInitialValues] = useState({
    websiteTitle: "", // Initial value for the title
  });

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        console.error("Token not found");
        return;
      }

      const response = await axios.get("http://localhost:4040/admin", {
        headers: {
          Authorization: token,
        },
      });
      const { websiteTitle } = response.data.admin;
      // Set the retrieved title as the initial value
      setInitialValues({ websiteTitle });
      console.log(response.data.admin);
    } catch (error) {
      console.log(error);
    }
  };

  const validationSchema = Yup.object().shape({
    websiteTitle: Yup.string().required("Title is required"), // Validation for the title field
  });

  const handleSubmit = async (values) => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        console.error("Token not found");
        return;
      }

      const response = await axios.patch(
        "http://localhost:4040/admin",
        values,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      alert("Data saved successfully");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-4">Website Settings</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit} className="max-w-sm">
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

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
            >
              Save
            </button>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default DashboardSettings;
