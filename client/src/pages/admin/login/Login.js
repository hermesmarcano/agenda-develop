import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { FaUserShield } from "react-icons/fa";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import instance from "../../../axiosConfig/axiosConfig";
import { useTranslation } from "react-i18next";

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  useEffect(() => {
    // Check if it's the first time and no admins in the database
    const checkFirstTime = async () => {
      try {
        const response = await instance.get("admin/check");
        console.log(response.data);
        const adminsLength = response.data.count;
        if (adminsLength === 0) {
          // Register admin with default credentials
          const adminData = {
            username: "admin",
            password: "123456",
          };
          await instance.post("admin/", adminData);
        }
      } catch (error) {
        console.error("Error checking first time:", error);
      }
    };

    checkFirstTime();
  }, []);

  const handleFormSubmit = async (values, { setSubmitting }) => {
    instance
      .post("admin/login", values)
      .then((response) => {
        const token = response.data.token;
        localStorage.setItem("ag_app_admin_token", token);
        navigate("/ag-admin");
      })
      .catch((error) => {
        console.log(error);
      });
    setSubmitting(false);
    console.log("logging");
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required(t("Username is required")),
    password: Yup.string().required(t("Password is required")),
  });

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-8 rounded shadow">
        <div className="text-4xl text-center mb-8">
          <FaUserShield className="text-indigo-600 text-5xl mx-auto" />
        </div>
        <h2 className="text-2xl text-center mb-4">{t('Admin Login')}</h2>
        <Formik
          initialValues={{ username: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleFormSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label htmlFor="username" className="block mb-2">
                  {t('Username')}
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
                  {t('Password')}
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
                  {isSubmitting ? t("Logging in...") : t("Log In")}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
