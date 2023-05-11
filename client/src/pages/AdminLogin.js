import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { FaUserShield } from "react-icons/fa";
import * as Yup from "yup";
import instance from "../axiosConfig/axiosConfig";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const navigate = useNavigate();
  useEffect(() => {
    // Check if it's the first time and no admins in the database
    const checkFirstTime = async () => {
      try {
        const response = await instance.get("/admin/check");
        console.log(response.data);
        const adminsLength = response.data.count;
        if (adminsLength === 0) {
          // Register admin with default credentials
          const adminData = {
            username: "admin",
            password: "123456",
          };
          await instance.post("/admin/", adminData);
        }
      } catch (error) {
        console.error("Error checking first time:", error);
      }
    };

    checkFirstTime();
  }, []);

  const handleFormSubmit = async (values, { setSubmitting }) => {
    const response = await instance.post("/admin/login", values);
    const token = response.data.token;
    localStorage.setItem("adminToken", token);
    console.log(values);
    navigate("/ag-admin");
    setSubmitting(false);
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-8 rounded shadow">
        <div className="text-4xl text-center mb-8">
          <FaUserShield className="text-indigo-600 text-5xl mx-auto" />
        </div>
        <h2 className="text-2xl text-center mb-4">Admin Login</h2>
        <Formik
          initialValues={{ username: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleFormSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label htmlFor="username" className="block mb-2">
                  Username
                </label>
                <Field
                  type="text"
                  name="username"
                  id="username"
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="text-red-600"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block mb-2">
                  Password
                </label>
                <Field
                  type="password"
                  name="password"
                  id="password"
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-600"
                />
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  className="bg-indigo-600 text-white py-2 px-4 rounded"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Logging in..." : "Log In"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AdminLogin;
