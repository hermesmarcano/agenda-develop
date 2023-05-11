import React, { useContext, useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage, useField } from "formik";
import * as Yup from "yup";
import DateTimeContext from "../context/DateTimeContext";
import axios from "axios";
import SidebarContext from "../context/SidebarContext";
import { FaCheck } from "react-icons/fa";

const RegisterAppointment = ({ setModelState }) => {
  const { shopName } = useContext(SidebarContext);
  const { dateTime } = useContext(DateTimeContext);
  const token = localStorage.getItem("token");
  const [clients, setClients] = useState([]);

  const [bookingInfo, setBookingInfo] = useState({});
  const [amount, setAmount] = useState(0);
  const [duration, setDuration] = useState(0);
  useEffect(() => {
    axios
      .get(`http://localhost:4040/customers/shopname?shopName=${shopName}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setClients(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [shopName]);

  const [professionals, setProfessionals] = useState([]);
  useEffect(() => {
    axios
      .get(
        `http://localhost:4040/professionals/shopname?shopName=${shopName}`,
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((response) => {
        setProfessionals(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const [services, setServices] = useState([]);
  useEffect(() => {
    axios
      .get(`http://localhost:4040/services/shopname?shopName=${shopName}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setServices(response.data.services);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const initialValues = {
    customer: "",
    professional: "",
    service: [],
    dateTime: "",
  };

  const validationSchema = Yup.object().shape({
    customer: Yup.string().required("Customer is required"),
    professional: Yup.string().required("Professional is required"),
    service: Yup.array()
      .test(
        "at-least-one",
        "At least one service selection is required",
        function (value) {
          return value && value.length > 0;
        }
      )
      .of(Yup.string().required("A service name is required")),
    // dateTime: Yup.string().required("Start time is required"),
  });

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    values.dateTime = dateTime;
    let totalPrice = 0;
    let totalDuration = 0;

    services.map((serv) => {
      values.service.map((s) => {
        if (s === serv._id) {
          totalDuration += serv.duration;
        }
      });
    });

    services.map((serv) => {
      values.service.map((s) => {
        if (s === serv._id) {
          totalPrice += serv.price;
        }
      });
    });

    console.log("Services Duration", totalDuration);
    console.log("Services Price", totalPrice);

    setAmount(totalPrice);
    setDuration(totalDuration);

    console.log({
      customer: values.customer,
      professional: values.professional,
      service: values.service,
      dateTime: new Date(dateTime),
      shopName: shopName,
    });

    setBookingInfo({
      customer: values.customer,
      professional: values.professional,
      service: values.service,
      dateTime: new Date(dateTime),
      shopName: shopName,
    });

    setSubmitting(false);
    resetForm();
  };
  return (
    <>
      {amount === 0 ? (
        <>
          <h2 className="text-xl font-bold mb-4">Book an Appointment</h2>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({
              isSubmitting,
              values,
              getFieldProps,
              handleChange,
              handleBlur,
            }) => (
              <Form className="bg-white rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                  <label
                    htmlFor="customer"
                    className="block text-sm text-gray-700 font-bold mb-2"
                  >
                    Customer
                  </label>
                  <Field
                    as="select"
                    id="customer"
                    name="customer"
                    placeholder="Select customer"
                    className="py-2 pl-8 border-b-2 border-gray-300 text-gray-700 focus:outline-none focus:border-blue-500 w-full"
                  >
                    <option value="">Select customer</option>
                    {clients.map((client) => {
                      return (
                        <option key={client["_id"]} value={client["_id"]}>
                          {client.name}
                        </option>
                      );
                    })}
                  </Field>
                  <ErrorMessage
                    name="customer"
                    component="p"
                    className="text-red-500 text-xs italic"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="professional"
                    className="block text-sm text-gray-700 font-bold mb-2"
                  >
                    Professional
                  </label>
                  <Field
                    as="select"
                    id="professional"
                    name="professional"
                    placeholder="Select professional"
                    className="py-2 pl-8 border-b-2 border-gray-300 text-gray-700 focus:outline-none focus:border-blue-500 w-full"
                  >
                    <option value="">Select professional</option>
                    {professionals.map((professional) => {
                      return (
                        <option
                          key={professional["_id"]}
                          value={professional["_id"]}
                        >
                          {professional.name}
                        </option>
                      );
                    })}
                  </Field>
                  <ErrorMessage
                    name="professional"
                    component="p"
                    className="text-red-500 text-xs italic"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="service"
                    className="block text-sm text-gray-700 font-bold mb-2"
                  >
                    Services
                  </label>
                  <div className="grid grid-cols-1 gap-3 mt-2 bg-gray-100 rounded h-20 overflow-y-auto">
                    {services.map((service) => (
                      <label key={service._id} className="flex items-center">
                        <Field
                          as="input"
                          type="checkbox"
                          name="service"
                          value={service._id}
                          checked={values.service.includes(service._id)}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="sr-only"
                        />
                        <div className="w-4 h-4 mx-2 bg-gray-100 rounded-full flex items-center justify-center border border-gray-300">
                          {values.service.includes(service._id) && (
                            <FaCheck className="w-3 h-3 text-green-600" />
                          )}
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {service.name}
                        </span>
                      </label>
                    ))}
                  </div>
                  <ErrorMessage
                    name="service"
                    component="p"
                    className="text-red-500 text-xs italic"
                  />
                </div>
                <div className="mb-4 flex justify-between">
                  <p className="block text-sm text-gray-500 font-bold mb-2">
                    {new Intl.DateTimeFormat("en", {
                      timeStyle: "short",
                    }).format(dateTime)}
                  </p>
                  <p className="block text-sm text-gray-500 font-bold mb-2">
                    {new Intl.DateTimeFormat(["ban", "id"]).format(dateTime)}
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Book Appointment
                </button>
              </Form>
            )}
          </Formik>
        </>
      ) : (
        <Formik
          initialValues={{ amount: amount, description: "" }}
          onSubmit={(values, actions) => {
            console.log(values);
            let data = {
              shopName: shopName,
              customer: bookingInfo.customer,
              professional: bookingInfo.professional,
              service: bookingInfo.service,
              dateTime: new Date(),
              amount: values.amount,
              description: values.description,
            };
            console.log(data);
            axios
              .post("http://localhost:4040/payments", data, {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: token,
                },
              })
              .then((response) => {
                console.log(response.data);
                axios
                  .post(
                    "http://localhost:4040/appointments",
                    {
                      customer: bookingInfo.customer,
                      professional: bookingInfo.professional,
                      service: bookingInfo.service,
                      dateTime: new Date(dateTime),
                      shopName: shopName,
                    },
                    {
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: token,
                      },
                    }
                  )
                  .then((response) => {
                    console.log(response.data);
                    alert("Booked Successfully");
                    setModelState(false);
                  })
                  .catch((error) => {
                    console.error(error.message);
                    // Handle errors
                  });
              })
              .catch((error) => {
                console.error(error.message);
                // Handle errors
              })
              .finally(() => {
                // Reset the form
                actions.setSubmitting(false);
              });
          }}
        >
          {({ values, handleSubmit, isSubmitting }) => (
            <Form>
              <h2 className="text-xl font-bold mb-4">Register Payment</h2>
              <div className="mb-4">
                <label htmlFor="amount" className="block font-bold mb-2">
                  Amount
                </label>
                <Field
                  type="text"
                  id="amount"
                  name="amount"
                  placeholder="$"
                  className="border border-gray-300 rounded-md p-2 w-full"
                  disabled
                />
              </div>
              <div className="mb-4">
                <label htmlFor="date" className="block font-bold mb-2">
                  Date
                </label>
                <Field
                  type="text"
                  id="date"
                  name="date"
                  value={new Intl.DateTimeFormat(["ban", "id"]).format(
                    new Date()
                  )}
                  className="border border-gray-300 rounded-md p-2 w-full"
                  disabled
                />
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block font-bold mb-2">
                  Description
                </label>
                <Field
                  type="text"
                  id="description"
                  name="description"
                  className="border border-gray-300 rounded-md p-2 w-full"
                />
              </div>
              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white text-sm font-bold py-2 px-4 rounded-md mr-2"
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                >
                  Submit Payment
                </button>
                <button
                  type="button"
                  className="bg-red-500 hover:bg-red-600 text-white text-sm font-bold py-2 px-4 rounded-md"
                  onClick={() => {
                    console.log("Payment registration canceled");
                    setModelState(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </>
  );
};

export default RegisterAppointment;
