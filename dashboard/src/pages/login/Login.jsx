import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { FaEnvelope, FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import instance from "../../axiosConfig/axiosConfig";
import { useTranslation } from "react-i18next";

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [registered, setRegistered] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const LoginSchema = Yup.object().shape({
    email: Yup.string().email(t("Invalid email")).required(t("Required")),
    password: Yup.string().required(t("Required")),
  });
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {t("Sign in to your account")}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{" "}
          <Link
            to="/register"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            {t("create a new account")}
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={LoginSchema}
            onSubmit={(values, { setSubmitting }) => {
              instance
                .post("managers/login", values, {
                  headers: {
                    "Content-Type": "application/json",
                  },
                })
                .then((response) => {
                  if (response.status === 200) {
                    setRegistered(() => true);
                  } else {
                    setRegistered(() => false);
                    setErrorMessage(t("Invalid email or password"));
                  }
                  return response.data;
                })
                .then((data) => {
                  if (data.token) {
                    localStorage.setItem("ag_app_shop_token", data.token);
                    navigate("/");
                  }
                })
                .catch((errors) => console.log(errors))
                .finally(() => {
                  setSubmitting(false);
                });
            }}
          >
            {({ errors, touched }) => (
              <Form className="space-y-6">
                <div>
                  <label htmlFor="email" className="sr-only">
                    {t("Email address")}
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 right-2 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </div>
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      className={`appearance-none rounded-md block w-full px-3 py-2 border ${
                        errors.email && touched.email
                          ? "border-red-500"
                          : "border-gray-300"
                      } placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                      placeholder={t("Email address")}
                    />
                  </div>
                  {errors.email && touched.email ? (
                    <div className="mt-2 text-sm text-red-500">
                      {errors.email}
                    </div>
                  ) : null}
                </div>

                <div>
                  <label htmlFor="password" className="sr-only">
                    {t("Password")}
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 right-2 pl-3 flex items-center pointer-events-none">
                      <FaLock
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </div>
                    <Field
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      className={`appearance-none rounded-md block w-full px-3 py-2 border ${
                        errors.password && touched.password
                          ? "border-red-500"
                          : "border-gray-300"
                      } placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                      placeholder={t("Password")}
                    />
                    <div className="absolute inset-y-0 right-5 pr-3 flex items-center text-sm leading-5">
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <FaEye size={20} />
                        ) : (
                          <FaEyeSlash size={20} />
                        )}
                      </button>
                    </div>
                  </div>
                  {errors.password && touched.password ? (
                    <div className="mt-2 text-sm text-red-500">
                      {errors.password}
                    </div>
                  ) : null}
                </div>
                {!registered ? (
                  <div className="mt-2 text-sm text-red-500">
                    {errorMessage}
                  </div>
                ) : null}

                <div>
                  <button
                    type="submit"
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-semibold rounded  text-white bg-teal-500 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-300"
                  >
                    {t("Sign in")}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
          <p className="mt-2 text-center text-sm text-gray-600">
            <Link
              to="/forgot-password"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              {t("Forgot your password?")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
