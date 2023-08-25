import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import instance from "../axiosConfig/axiosConfig";

const SignIn = ({ isOpen, onClose }) => {
  const params = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [signIn, setSignIn] = useState(true);

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    console.log("Name:", name);
    console.log("Phone:", phone);
    instance
      .get(`/managers/shop?urlSlug=${params.id}`)
      .then((response) => {
        instance
          .post("/customers", {
            name: name,
            phone: phone,
            managerId: response.data._d,
          })
          .then((response) => {
            console.log(response);
            setSignIn(true);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });

    // Implement logic to register the client
    // Redirect to the home page
  };
  const handleSignInSubmit = (values) => {
    console.log(values);
    instance
      .post("/customers/login", values)
      .then((response) => {
        console.log(response.data.token);
        localStorage.setItem("ag_app_customer_token", response.data.token);
        navigate(`/shops/${params.id}/checkout`);
      })
      .catch((error) => {
        console.log(error);
      });

    // Implement login logic here
  };

  return (
    <>
      {isOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div
              className="fixed inset-0 bg-gray-500 opacity-75"
              onClick={onClose}
            ></div>
            <div className="bg-white rounded-lg overflow-hidden shadow-xl relative">
              <button
                className="absolute top-0 right-0 m-3 text-gray-600 hover:text-gray-800 focus:outline-none"
                onClick={onClose}
              >
                <svg
                  className="h-6 w-6 fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    className="heroicon-ui"
                    d="M6.7 6.7a1 1 0 011.4 0L12 10.6l3.9-3.9a1 1 0 111.4 1.4L13.4 12l3.9 3.9a1 1 0 01-1.4 1.4L12 13.4l-3.9 3.9a1 1 0 01-1.4-1.4L10.6 12 6.7 8.1a1 1 0 010-1.4z"
                  />
                </svg>
              </button>
              <div className="px-4 py-6">
                <div className="flex flex-col items-center justify-center">
                  {signIn ? (
                    <>
                      <h1 className="text-5xl font-extrabold mb-8 text-gray-900">
                        Sign In
                      </h1>
                      <Formik
                        initialValues={{ phone: "" }}
                        validate={(values) => {
                          const errors = {};
                          if (!values.phone) {
                            errors.phone = "Phone number is required";
                          }
                          return errors;
                        }}
                        onSubmit={handleSignInSubmit}
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
                        <button
                          onClick={() => setSignIn(false)}
                          className="text-indigo-600"
                        >
                          Register here
                        </button>
                      </p>
                    </>
                  ) : (
                    <>
                      <h1 className="text-5xl font-extrabold mb-8 text-gray-900">
                        Register
                      </h1>
                      <form
                        onSubmit={handleRegisterSubmit}
                        className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md"
                      >
                        <div className="mb-4">
                          <label
                            htmlFor="name"
                            className="text-lg font-semibold"
                          >
                            Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border-gray-400 border-solid border-2 rounded-md p-2 w-full mt-2"
                            required
                          />
                        </div>
                        <div className="mb-4">
                          <label
                            htmlFor="phone"
                            className="text-lg font-semibold"
                          >
                            Phone
                          </label>
                          <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="border-gray-400 border-solid border-2 rounded-md p-2 w-full mt-2"
                            required
                          />
                        </div>
                        <button
                          type="submit"
                          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xl font-medium py-4 px-8 rounded-full mt-8 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Register
                        </button>
                        <div className="mt-4">
                          Already have an account?{" "}
                          <button
                            onClick={() => setSignIn(true)}
                            className="text-indigo-600 hover:text-indigo-800"
                          >
                            Login
                          </button>
                        </div>
                      </form>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SignIn;
