import React, { useContext, useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage, useField } from "formik";
import * as Yup from "yup";
import DateTimeContext from "../context/DateTimeContext";
import axios from "axios";
import SidebarContext from "../context/SidebarContext";
import { FaCheck, FaSpinner } from "react-icons/fa";

const UpdateAppointment = ({ setModelState, appointmentId }) => {
  const { shopName } = useContext(SidebarContext);
  const token = localStorage.getItem("ag_app_shop_token");
  const [clients, setClients] = useState([]);

  const [bookingInfo, setBookingInfo] = useState({});
  const [amount, setAmount] = useState(0);
  const [duration, setDuration] = useState(0);
  const [appointmentData, setAppointmentData] = useState(null);
  const { dateTime, setDateTime } = useContext(DateTimeContext);
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
  useEffect(() => {
    axios
      .get(`http://localhost:4040/appointments/${appointmentId}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setAppointmentData(response.data.appointment);
        setDateTime(new Date(response.data.appointment.dateTime));
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

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
    let totalDuration = 0;

    services.map((serv) => {
      values.service.map((s) => {
        if (s === serv._id) {
          totalDuration += serv.duration;
        }
      });
    });

    console.log("Services Duration", totalDuration);

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

    axios
      .patch(
        `http://localhost:4040/appointments/${appointmentId}`,
        JSON.stringify({
          customer: values.customer,
          professional: values.professional,
          service: values.service,
          dateTime: new Date(dateTime),
          shopName: shopName,
        }),
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        setModelState(false);
      })
      .catch((error) => console.log(error));

    setSubmitting(false);
    resetForm();
  };
  return (
    <>
      <h2 className="text-xl text-left font-bold mb-4">Update Appointment</h2>
      {appointmentData ? (
        <Formik
          initialValues={{
            customer: appointmentData.customer,
            professional: appointmentData.professional,
            service: appointmentData.service,
            dateTime: appointmentData.dateTime,
          }}
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
            <Form className="bg-white text-left rounded px-8 pt-6 pb-8 mb-4">
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
                Update Appointment
              </button>
            </Form>
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
    </>
  );
};

export default UpdateAppointment;
