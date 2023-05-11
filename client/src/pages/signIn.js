import React from "react";
import { Link, useParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import instance from "../axiosConfig/axiosConfig";

const SignIn = () => {
  const params = useParams();
  const navigate = useNavigate();
  const handleFormSubmit = (values) => {
    console.log(values);
    instance
      .post("/customers/login", values)
      .then((response) => {
        console.log(response.data.token);
        localStorage.setItem("customerToken", response.data.token);
        if (localStorage.getItem("bookingInfo")) {
          navigate(`/shops/${params.id}/booking-checkout`);
        } else {
          navigate(`/shops/${params.id}/`);
        }
      })
      .catch((error) => {
        console.log(error);
      });

    // Implement login logic here
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-5xl font-extrabold mb-8 text-gray-900">Sign In</h1>
      <Formik
        initialValues={{ phone: "" }}
        validate={(values) => {
          const errors = {};
          if (!values.phone) {
            errors.phone = "Phone number is required";
          }
          return errors;
        }}
        onSubmit={handleFormSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-4">
              <label
                htmlFor="phone"
                className="block text-gray-700 font-bold mb-2"
              >
                Phone Number
              </label>
              <Field
                type="tel"
                name="phone"
                placeholder="Enter your phone number"
                className="border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <ErrorMessage
                name="phone"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xl font-medium py-4 px-8 rounded-full mt-8 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign In
            </button>
          </Form>
        )}
      </Formik>
      <p className="text-gray-500 text-sm mt-4">
        Don't have an account?{" "}
        <Link to={`/${params.id}/register`} className="text-indigo-600">
          Register here
        </Link>
      </p>
    </div>
  );
};

export default SignIn;
