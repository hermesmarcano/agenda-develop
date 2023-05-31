import React, { useContext, useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage, useField } from "formik";
import * as Yup from "yup";
import DateTimeContext from "../context/DateTimeContext";
import axios from "axios";
import SidebarContext from "../context/SidebarContext";
import { FaCheck, FaSpinner } from "react-icons/fa";
import BlockSchedule from "./BlockSchedule";
import SubmitPayment from "./SubmitPayment";
import ProfessionalIdContext from "../context/ProfessionalIdContext";

const RegisterAppointment = ({
  amount,
  clients,
  setClients,
  setBookingInfo,
  setAmount,
}) => {
  const { shopName } = useContext(SidebarContext);
  const { dateTime } = useContext(DateTimeContext);
  const token = localStorage.getItem("ag_app_shop_token");
  const [loading, setLoading] = React.useState(true);
  const { professionalId } = useContext(ProfessionalIdContext);
  const [duration, setDuration] = useState(0);
  const [activeTab, setActiveTab] = useState("appointment");
  const [professionals, setProfessionals] = useState([]);
  const [services, setServices] = useState([]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    axios
      .get(`http://localhost:4040/customers/shopname?shopName=${shopName}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setClients(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [shopName]);

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
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col justify-center items-center space-x-2">
          <FaSpinner className="animate-spin text-4xl text-blue-500" />
          <span className="mt-2">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* <h2 className="text-xl font-bold mb-4">Book an Appointment</h2> */}
      <Formik
        initialValues={{
          customer: "",
          professional: professionalId,
          service: [],
          dateTime: "",
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
          <Form className="bg-white rounded-lg px-8 py-6 mb-4">
            <div className="mb-4">
              <label
                htmlFor="customer"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Customer
              </label>
              <Field
                as="select"
                id="customer"
                name="customer"
                className="input-field"
              >
                <option value="">Select customer</option>
                {clients.map((client) => (
                  <option key={client._id} value={client._id}>
                    {client.name}
                  </option>
                ))}
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
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Professional
              </label>
              <Field
                as="select"
                id="professional"
                name="professional"
                className="input-field"
              >
                <option value="">Select professional</option>
                {professionals.map((professional) => (
                  <option key={professional._id} value={professional._id}>
                    {professional.name}
                  </option>
                ))}
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
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Services
              </label>
              <div className="services-container">
                {services.map((service) => (
                  <label
                    key={service._id}
                    className="service-item flex items-center"
                  >
                    <Field
                      as="input"
                      type="checkbox"
                      name="service"
                      value={service._id}
                      checked={values.service.includes(service._id)}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="hidden"
                    />
                    <div className="checkmark w-4 h-4 mx-2 bg-gray-100 rounded-full flex items-center justify-center border border-gray-300">
                      {values.service.includes(service._id) && (
                        <FaCheck className="w-3 h-3 text-green-600" />
                      )}
                    </div>
                    <span className="service-name text-sm font-medium text-gray-700">
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
              <p className="block text-sm text-gray-500 font-semibold">
                {new Intl.DateTimeFormat("en", { timeStyle: "short" }).format(
                  dateTime
                )}
              </p>
              <p className="block text-sm text-gray-500 font-semibold">
                {new Intl.DateTimeFormat(["ban", "id"]).format(dateTime)}
              </p>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="submit-button bg-gray-800 hover:bg-gray-600 text-white text-sm font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Book Now
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default RegisterAppointment;
