import React, { useContext, useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage, useField } from "formik";
import * as Yup from "yup";
import DateTimeContext from "../context/DateTimeContext";
import axios from "axios";
import SidebarContext from "../context/SidebarContext";
import { FaCheck, FaPlus, FaSpinner } from "react-icons/fa";
import ProfessionalIdContext from "../context/ProfessionalIdContext";
import Select from "react-select";

const RegisterAppointment = ({
  amount,
  clients,
  setClients,
  setBookingInfo,
  setAmount,
  addCustomerClicked,
  setAddCustomerClicked
}) => {
  const { shopName } = useContext(SidebarContext);
  const { dateTime } = useContext(DateTimeContext);
  const token = localStorage.getItem("ag_app_shop_token");
  const [loading, setLoading] = React.useState(true);
  const { professionalId } = useContext(ProfessionalIdContext);
  const [duration, setDuration] = useState(0);
  const [professionals, setProfessionals] = useState([]);
  const [services, setServices] = useState([]);

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
    // customer: Yup.string().required("Customer is required"),
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

  const timeOptions = [];
  for (let i = 15; i <= 360; i += 15) {
    const timeInMinutes = i;
    const hours = Math.floor(timeInMinutes / 60);
    const minutes = timeInMinutes % 60;
    const timeLabel = `${
      hours > 0 ? `${hours} hour${hours > 1 ? "s" : ""}` : ""
    } ${minutes} min`;
    timeOptions.push({ value: timeInMinutes, label: timeLabel });
  }

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    values.dateTime = dateTime;
    let totalPrice = 0;
    let totalDuration = 0;

    services.forEach((serv) => {
      values.service.forEach((s) => {
        if (s === serv._id) {
          totalDuration += serv.duration;
          totalPrice += serv.price;
        }
      });
    });

    if (addCustomerClicked) {
      setBookingInfo({
        name: values.name,
        phone: values.phone,
        professional: values.professional,
        service: values.service,
        dateTime: new Date(dateTime),
        shopName: shopName,
      });
    } else {
      setBookingInfo({
        customer: values.customer,
        professional: values.professional,
        service: values.service,
        dateTime: new Date(dateTime),
        shopName: shopName,
      });
    }

    setAmount(totalPrice);
    setDuration(totalDuration);
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
      <Formik
        initialValues={{
          customer: "",
          name: "",
          phone: "",
          professional: professionalId,
          service: [],
          dateTime: "",
          date: dateTime.toISOString().split("T")[0], // Set initial date value
          time: dateTime.toTimeString().slice(0, 5), // Set initial time value
          callTime: "",
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
            <div className="grid grid-cols-2 gap-5">
              <div>
                <div className="flex flex-col mb-4">
                  <div>
                    {!addCustomerClicked ? (
                      <CustomSelect
                        label="Client"
                        id="customer"
                        name="customer"
                        options={clients}
                      />
                    ) : (
                      <>
                        <label
                          htmlFor="name"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                          New Client
                        </label>
                        <div className="mb-4">
                          <label
                            htmlFor="name"
                            className="block text-xs font-semibold text-gray-700 mb-2"
                          >
                            Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            className="input-field w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            {...getFieldProps("name")}
                          />
                          <ErrorMessage
                            name="name"
                            component="p"
                            className="text-red-500 text-xs italic"
                          />
                        </div>
                        <div className="mb-4">
                          <label
                            htmlFor="phone"
                            className="block text-xs font-semibold text-gray-700 mb-2"
                          >
                            Phone
                          </label>
                          <input
                            type="text"
                            id="phone"
                            name="phone"
                            className="input-field w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            {...getFieldProps("phone")}
                          />
                          <ErrorMessage
                            name="phone"
                            component="p"
                            className="text-red-500 text-xs italic"
                          />
                        </div>
                      </>
                    )}
                  </div>
                  <div>
                    <button
                      type="button"
                      className="add-customer-button w-full flex items-center bg-gray-800 hover:bg-gray-600 text-white text-sm font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      onClick={() => setAddCustomerClicked(!addCustomerClicked)}
                    >
                      {!addCustomerClicked ? (
                        <>
                          <FaPlus className="mr-2" />
                          Add Customer
                        </>
                      ) : (
                        "Select Customer"
                      )}
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="service"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Services
                  </label>
                  <Select
                    id="service"
                    name="service"
                    className="input-field"
                    options={services.map((service) => ({
                      value: service._id,
                      label: service.name,
                    }))}
                    isMulti
                    value={values.service.map((serviceId) => ({
                      value: serviceId,
                      label: services.find(
                        (service) => service._id === serviceId
                      )?.name,
                    }))}
                    onChange={(selectedOptions) =>
                      handleChange({
                        target: {
                          name: "service",
                          value: selectedOptions
                            ? selectedOptions.map((option) => option.value)
                            : [],
                        },
                      })
                    }
                    placeholder="Select services"
                    isClearable
                  />
                  <ErrorMessage
                    name="service"
                    component="p"
                    className="text-red-500 text-xs italic"
                  />
                </div>
              </div>
              <div>
                <CustomSelect
                  label="Professional"
                  id="professional"
                  name="professional"
                  options={professionals}
                />
                <div className="mb-4 mt-4">
                  <label
                    htmlFor="callTime"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Call time
                  </label>

                  <Field
                    name="callTime"
                    as="select"
                    className="py-2 pl-8 border-b-2 border-gray-300 text-gray-700 focus:outline-none focus:border-blue-500 w-full"
                  >
                    <option value="">Select time</option>
                    {timeOptions.map((time, index) => {
                      const hours = Math.floor(time.value / 60);
                      const minutes = time.value % 60;

                      let formattedTime = "";
                      if (hours > 0) {
                        formattedTime += `${hours} hour `;
                      }
                      if (minutes > 0 || formattedTime === "") {
                        formattedTime += `${minutes} min`;
                      }

                      return (
                        <option key={index} value={time.value}>
                          {formattedTime}
                        </option>
                      );
                    })}
                  </Field>
                  <ErrorMessage
                    name="callTime"
                    component="p"
                    className="text-red-500 text-xs italic"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="date"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={values.date}
                    className="input-field"
                    {...getFieldProps("date")}
                  />
                  <ErrorMessage
                    name="date"
                    component="p"
                    className="text-red-500 text-xs italic"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="time"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Time
                  </label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={values.time}
                    className="input-field"
                    {...getFieldProps("time")}
                  />
                  <ErrorMessage
                    name="time"
                    component="p"
                    className="text-red-500 text-xs italic"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="submit-button flex items-center bg-gray-800 hover:bg-gray-600 text-white text-sm font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {isSubmitting ? (
                <FaSpinner className="animate-spin mr-2" />
              ) : (
                <FaCheck className="mr-2" />
              )}
              Book Now
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default RegisterAppointment;

const CustomSelect = ({ label, options, ...props }) => {
  const [field, meta, helpers] = useField(props);

  const handleChange = (selectedOption) => {
    helpers.setValue(selectedOption ? selectedOption.value : "");
  };

  const formattedOptions = options.map((option) => ({
    value: option._id,
    label: option.name,
  }));

  return (
    <div className="mb-4">
      <label
        htmlFor={props.id || props.name}
        className="block text-sm font-semibold text-gray-700 mb-2"
      >
        {label}
      </label>
      <Select
        id={props.id || props.name}
        name={props.name}
        className="input-field"
        options={formattedOptions}
        value={formattedOptions.find((option) => option.value === field.value)}
        onChange={handleChange}
        placeholder={`Select ${label}`}
        isClearable
        {...props}
      />
      <ErrorMessage
        name={field.name}
        component="p"
        className="text-red-500 text-xs italic"
      />
    </div>
  );
};
