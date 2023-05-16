import React, { useState, useEffect } from "react";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";

const DashboardHero = () => {
  const [heroData, setHeroData] = useState(null);

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
      console.log(response.data.admin.heroData);
      setHeroData(response.data.admin.heroData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFormSubmit = async (values) => {
    // console.log(JSON.stringify(values));
    try {
      const token = localStorage.getItem("ag_app_admin_token");
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
      <h1 className="text-3xl font-bold mb-4">Dashboard Hero</h1>
      {heroData ? (
        <Formik
          initialValues={{
            heroText: heroData.heroText,
            heroColor: heroData.heroColor,
            heroBgColor: heroData.heroBgColor,
          }}
          validationSchema={Yup.object({
            heroText: Yup.string(),
            heroColor: Yup.string(),
            heroBgColor: Yup.string(),
          })}
          onSubmit={handleFormSubmit}
        >
          {({ values, errors, touched, handleChange, handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="heroText" className="block font-medium mb-1">
                  Hero Text
                </label>
                <Field
                  type="text"
                  id="heroText"
                  className="border-gray-300 border rounded-md p-2 w-full"
                  name="heroText"
                />
                <ErrorMessage
                  name="heroText"
                  component="div"
                  className="text-red-600"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="heroColor" className="block font-medium mb-1">
                  Hero Color
                </label>
                <select
                  id="heroColor"
                  className="border-gray-300 border rounded-md p-2 w-full"
                  name="heroColor"
                  value={values.heroColor}
                  onChange={handleChange}
                >
                  <option value="">Select Color</option>
                  <option value="black">Black</option>
                  <option value="white">White</option>
                </select>
                <ErrorMessage
                  name="heroColor"
                  component="div"
                  className="text-red-600"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="heroBgColor" className="block font-medium mb-1">
                  Hero Background Color
                </label>
                <select
                  id="heroBgColor"
                  className="border-gray-300 border rounded-md p-2 w-full"
                  name="heroBgColor"
                  value={values.heroBgColor}
                  onChange={handleChange}
                >
                  <option value="">Select Background Color</option>
                  <option value="gray-600">Gray-600</option>
                  <option value="gray-700">Gray-700</option>
                  <option value="gray-800">Gray-800</option>
                </select>
                <ErrorMessage
                  name="heroBgColor"
                  component="div"
                  className="text-red-600"
                />
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

export default DashboardHero;