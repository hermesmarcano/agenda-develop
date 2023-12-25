import React, { useContext, useEffect, useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage, useField } from "formik";
import * as Yup from "yup";
import {
  FaCreditCard,
  FaPlus,
  FaRedo,
  FaSpinner,
  FaTrashAlt,
  FaWhatsapp,
} from "react-icons/fa";
import Select from "react-select";
import Switch from "react-switch";
import { useNavigate } from "react-router-dom";
import { HiCheck, HiX } from "react-icons/hi";
import { BiChevronDown } from "react-icons/bi";
import { SidebarContext } from "../../../context/SidebarContext";
import { NotificationContext } from "../../../context/NotificationContext";
import instance from "../../../axiosConfig/axiosConfig";
import { DarkModeContext } from "../../../context/DarkModeContext";
import {
  NoWidthInputDarkStyle,
  NoWidthInputLightStyle,
  SpecialInputDarkStyle,
  SpecialInputLightStyle,
} from "../../../components/Styled";
import { useTranslation } from "react-i18next";
import { Store } from "react-notifications-component";
import Popup from "../../../components/Popup";
import UpgradePlan from "../../../components/upgeadePlan";
import { MdStars } from "react-icons/md";

const UpdateAppointment = ({
  setModelState,
  appointmentId,
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate(this);
  const { shopId } = useContext(SidebarContext);
  const { isDarkMode } = useContext(DarkModeContext);
  const [dateTime, setDateTime] = useState(new Date());
  const token = localStorage.getItem("ag_app_shop_token");
  const [loading, setLoading] = React.useState(true);
  const [clients, setClients] = useState([]);
  const [professionals, setProfessionals] = useState([]);
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [addCustomerClicked, setAddCustomerClicked] = useState(false);
  const [allowManualDuration, setAllowManualDuration] = useState(true);
  const [appointmentData, setAppointmentData] = useState(null);
  const { sendNotification } = useContext(NotificationContext);
  const [upgradePlan, setUpgradePlan] = useState(false);
  const [currentPlan, setCurrentPlan] = useState("");
  const [deleteAppointmentModelState, setDeleteAppointmentModelState] =
    useState(false);

  const notify = (title, message, type) => {
    Store.addNotification({
      title: title,
      message: message,
      type: type,
      insert: "top",
      container: "bottom-center",
      animationIn: ["animated", "fadeIn"],
      animationOut: ["animated", "fadeOut"],
      dismiss: {
        duration: 5000,
        onScreen: true,
      },
      onNotificationRemoval: () => this.remove(),
    });
  };

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const response = await instance.get(`managers/id`, {
          headers: {
            Authorization: token,
          },
        });
        setCurrentPlan(response.data.subscription.name);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchClients = async () => {
      try {
        const response = await instance.get(`customers/shop?shopId=${shopId}`, {
          headers: {
            Authorization: token,
          },
        });
        setClients(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchServices = async () => {
      try {
        const response = await instance.get(`services/shop?shopId=${shopId}`, {
          headers: {
            Authorization: token,
          },
        });
        setServices(response.data.services);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await instance.get(`products/shop?shopId=${shopId}`, {
          headers: {
            Authorization: token,
          },
        });
        setProducts(response.data.products);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchAppointment = async () => {
      try {
        const response = await instance.get(`appointments/${appointmentId}`, {
          headers: {
            Authorization: token,
          },
        });
        setAppointmentData(response.data.appointment);
      } catch (error) {
        console.error(error);
      }
    };

    Promise.all([
      fetchShop(),
      fetchClients(),
      fetchServices(),
      fetchProducts(),
      fetchAppointment(),
    ])
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [shopId, appointmentId]);

  const validationSchema = Yup.object().shape({
    professional: Yup.string().required(t("Professional is required")),
    service: Yup.array()
      .test(
        "at-least-one",
        t("At least one service selection is required"),
        function (value) {
          return value && value.length > 0;
        }
      )
      .of(Yup.string().required(t("A service name is required"))),
  });

  useEffect(() => {
    instance
      .get(`professionals/shop?shopId=${shopId}`, {
        headers: {
          Authorization: token,
        },
      })
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
      hours > 0 ? `${hours} ${t("hour")}${hours > 1 ? "s" : ""}` : ""
    } ${minutes} ${t("min")}`;
    timeOptions.push({ value: timeInMinutes, label: timeLabel });
  }

  const calculateTotalPriceAndDuration = (values, services, products) => {
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

    products.forEach((prod) => {
      values.product.forEach((p) => {
        if (p === prod._id) {
          totalPrice += p.price;
        }
      });
    });

    return { totalPrice, totalDuration };
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    values.dateTime = dateTime;

    let { totalPrice, totalDuration } = calculateTotalPriceAndDuration(
      values,
      services,
      products
    );

    if (allowManualDuration) {
      const [hours, minutes] = values.appointmentDuration.split(":");
      totalDuration = parseInt(hours) * 60 + parseInt(minutes);
    }

    const updateAppointment = (customer) => {
      const dateParts = values.date.split("-");
      const timeParts = values.time.split(":");

      var year = parseInt(dateParts[0]);
      var month = parseInt(dateParts[1]) - 1;
      var day = parseInt(dateParts[2]);
      var hour = parseInt(timeParts[0]);
      var minute = parseInt(timeParts[1]);

      const dateObject = new Date(year, month, day, hour, minute);

      let patchData = {
        customer: customer,
        professional: values.professional,
        service: values.service,
        product: values.product,
        duration: totalDuration,
        dateTime: dateObject,
        managerId: shopId,
        status: "updating",
      };

      const customerName = clients.find((client) => client._id === customer);

      instance
        .patch(`appointments/${appointmentId}`, patchData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        })
        .then((response) => {
          setSubmitting(false);
          resetForm();
          setModelState(false);
          notify(
            t("Update Reservation"),
            `${t("Reservation for customer")} ${customerName.name} ${t(
              "has been updated, go to checkout to process payment"
            )}`,
            "success"
          );

          sendNotification(
            `${t("Reservation Updated for")} ${customerName.name}`
          );
        })
        .catch((error) => {
          notify(t("Error"), error.message, "danger");
        });
    };

    const registerCustomerWithAppointment = () => {
      instance
        .post(
          "customers/",
          {
            name: values.name,
            phone: values.phone,
            managerId: shopId,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        )
        .then((response) => {
          const { customer } = response.data;
          updateAppointment(customer);
        })
        .catch((error) => {
          console.error(error.message);
        });
    };

    if (addCustomerClicked) {
      registerCustomerWithAppointment();
    } else {
      updateAppointment(values.customer);
    }
  };

  const handleRemoveAppointment = () => {
    let client = null;
    instance
      .get(`appointments/${appointmentId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      })
      .then((response) => {
        client = response.data.appointment.customer;
        instance
          .get(`payments/appt/${appointmentId}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          })
          .then((res) => {
            if (res.data?.payment) {
              const paidAppointmentAmount = res.data?.payment.amount;
              const paymentId = res.data?.payment._id;
              instance
                .get(`customers/${client._id}`, {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                  },
                })
                .then((response) => {
                  const customerPayments = response.data.payments;
                  instance
                    .patch(
                      `customers/${client._id}`,
                      JSON.stringify({
                        payments: (customerPayments - paidAppointmentAmount),
                        lastTimeAppointmentStatus: 'Cancelled'
                      }),
                      {
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: token,
                        },
                      }
                    )
                    .then((r) => {
                      console.log(r.data);
                      instance
                        .delete(`payments/${paymentId}`, {
                          headers: {
                            Authorization: token,
                          },
                        })
                        .then((resp) => {
                          instance
                            .delete(`appointments/${appointmentId}`, {
                              headers: {
                                "Content-Type": "application/json",
                                Authorization: token,
                              },
                            })
                            .then(() => {
                              setDeleteAppointmentModelState(false);
                              setModelState(false);
                              notify(
                                t("Reservation is Cancelled"),
                                `${t("Reservation for customer")} ${
                                  client.name
                                } ${t("has been cancelled")}`,
                                "success"
                              );

                              sendNotification(
                                `${t("Reservation Cancelled for")} ${
                                  client.name
                                }`
                              );
                            })
                            .catch((error) => {
                              notify(t("Error"), error.message, "danger");
                            });
                        });
                    })
                    .catch((error) => {
                      console.error(error.message);
                    });
                });
            } else {
              instance
                .delete(`appointments/${appointmentId}`, {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                  },
                })
                .then(() => {
                  instance
                    .patch(
                      `customers/${client._id}`,
                      JSON.stringify({
                        lastTimeAppointmentStatus: 'Cancelled'
                      }),
                      {
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: token,
                        },
                      }
                    )
                  setDeleteAppointmentModelState(false);
                  setModelState(false);
                  notify(
                    t("Reservation is Cancelled"),
                    `${t("Reservation for customer")} ${client.name} ${t(
                      "has been cancelled"
                    )}`,
                    "success"
                  );

                  sendNotification(
                    `${t("Reservation Cancelled for")} ${client.name}`
                  );
                })
                .catch((error) => {
                  notify(t("Error"), error.message, "danger");
                });
            }
          });
      });
  };

  const openAppointmentDeletePopUp = () => {
    setDeleteAppointmentModelState(true);
  };

  const handleCheckout = (values) => {
    values.dateTime = dateTime;
    let { totalPrice, totalDuration } = calculateTotalPriceAndDuration(
      values,
      services,
      products
    );

    if (allowManualDuration) {
      const [hours, minutes] = values.appointmentDuration.split(":");
      totalDuration = parseInt(hours) * 60 + parseInt(minutes);
    }

    const updateAppointment = (customer) => {
      const dateParts = values.date.split("-");
      const timeParts = values.time.split(":");

      var year = parseInt(dateParts[0]);
      var month = parseInt(dateParts[1]) - 1;
      var day = parseInt(dateParts[2]);
      var hour = parseInt(timeParts[0]);
      var minute = parseInt(timeParts[1]);

      const dateObject = new Date(year, month, day, hour, minute);

      let patchData = {
        customer: customer,
        professional: values.professional,
        service: values.service,
        product: values.product,
        duration: totalDuration,
        dateTime: dateObject,
        managerId: shopId,
        status: "updating",
      };

      instance
        .patch(`appointments/${appointmentId}`, patchData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        })
        .then((response) => {
          setModelState(false);

          localStorage.setItem(
            "ag_app_booking_info",
            JSON.stringify({
              customer: patchData.customer,
              professional: patchData.professional,
              service: patchData.service,
              product: patchData.product,
              duration: patchData.duration,
              dateTime: patchData.dateTime,
              amount: totalPrice,
              appointmentId: appointmentId,
              managerId: shopId,
              checkoutType: "updating",
            })
          );
          navigate("/checkout");
        })
        .catch((error) => {
          console.error(error.message);
          // Handle errors
        });
    };

    const registerCustomerWithAppointment = () => {
      instance
        .post(
          "customers/",
          {
            name: values.name,
            phone: values.phone,
            managerId: shopId,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        )
        .then((response) => {
          const { customer } = response.data;
          updateAppointment(customer);
        })
        .catch((error) => {
          console.error(error.message);
        });
    };

    if (addCustomerClicked) {
      registerCustomerWithAppointment();
    } else {
      updateAppointment(values.customer);
    }
  };

  const clientPhoneNumber = "123-456-789";

  const openWhatsApp = (customerId = clientPhoneNumber) => {
    const currentCustomer = clients.find((client) => client._id === customerId);
    const whatsappUrl = `https://web.whatsapp.com/send?phone=${encodeURIComponent(
      currentCustomer?.phone
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <>
      <Popup
        isOpen={deleteAppointmentModelState}
        onClose={() =>
          setDeleteAppointmentModelState(!deleteAppointmentModelState)
        }
        children={
          <div>
            <h3 className="font-bold mt-2 mb-6">
              Please Confirm that you want to delete this appointment
            </h3>
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={handleRemoveAppointment}
                className="px-4 py-2 font-semibold text-white bg-red-500 hover:bg-red-600 rounded-md"
              >
                Confirm
              </button>
              <button
                onClick={() => setDeleteAppointmentModelState(false)}
                className="px-4 py-2 font-semibold text-white bg-gray-400 hover:bg-gray-500 rounded-md"
              >
                Cancel
              </button>
            </div>
            <p className="font-bold text-gray-500 text-sm mt-7 text-center">
              Note: Deleted appiontment cannot be retrieved
            </p>
          </div>
        }
      />
      <Popup
        isOpen={upgradePlan}
        onClose={() => setUpgradePlan(!upgradePlan)}
        children={<UpgradePlan />}
      />
      {isOpen && (
        <div
          className={`fixed z-10 inset-0 overflow-y-auto max-w-[950px] mx-auto`}
        >
          <div className="flex items-center justify-center min-h-screen">
            <div
              className="fixed inset-0 bg-gray-500 opacity-75"
              onClick={onClose}
            ></div>
            <div
              className={`rounded-lg overflow-hidden shadow-xl relative w-11/12 md:w-1/2 lg:w-2/3  ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              {appointmentData ? (
                <Formik
                  initialValues={{
                    customer: appointmentData?.customer?._id || "",
                    name: "",
                    phone: "",
                    professional: appointmentData?.professional?._id || "",
                    service: appointmentData?.service.map((s) => s?._id) || [],
                    product: appointmentData?.product.map((p) => p?._id) || [],
                    dateTime: new Date(appointmentData?.dateTime) || "",
                    date: new Date(appointmentData?.dateTime)
                      .toISOString()
                      .split("T")[0],
                    time: new Date(appointmentData?.dateTime)
                      .toTimeString()
                      .slice(0, 5),
                    appointmentDuration:
                      `${Math.floor(appointmentData?.duration / 60)
                        .toString()
                        .padStart(2, "0")}:${(appointmentData?.duration % 60)
                        .toString()
                        .padStart(2, "0")}` || "00:00",
                  }}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({
                    isSubmitting,
                    values,
                    getFieldProps,
                    handleChange,
                    setFieldValue,
                  }) => {
                    const handleDurationChange = (e) => {
                      const { name, value } = e.target;
                      let hours = parseInt(
                        values.appointmentDuration.split(":")[0]
                      );
                      let minutes = parseInt(
                        values.appointmentDuration.split(":")[1]
                      );

                      if (name === "hours") {
                        hours = parseInt(value) || 0;
                      } else if (name === "minutes") {
                        minutes = parseInt(value) || 0;
                      }

                      hours = Math.max(0, Math.min(hours, 23));
                      minutes = Math.max(0, Math.min(minutes, 55));

                      const updatedDuration = `${hours
                        .toString()
                        .padStart(2, "0")}:${minutes
                        .toString()
                        .padStart(2, "0")}`;

                      handleChange({
                        target: {
                          name: "appointmentDuration",
                          value: updatedDuration,
                        },
                      });
                    };

                    return (
                      <Form
                        className={`rounded-lg px-8 py-6 mb-4 overflow-y-auto `}
                      >
                        <div className="grid grid-cols-2 gap-5">
                          <div>
                            <div className="flex flex-col mb-4">
                              <div>
                                {!addCustomerClicked ? (
                                  <CustomSelect
                                    label={t("Customer")}
                                    id="customer"
                                    name="customer"
                                    options={clients}
                                  />
                                ) : (
                                  <>
                                    <label
                                      htmlFor="name"
                                      className="block text-sm font-semibold  mb-2"
                                    >
                                      {t("New Client")}
                                    </label>
                                    <div className="mb-4">
                                      <label
                                        htmlFor="name"
                                        className="block text-xs font-semibold  mb-2"
                                      >
                                        {t("Name")}
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
                                        className="block text-xs font-semibold  mb-2"
                                      >
                                        {t("Phone")}
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
                                  className="add-customer-button w-full flex items-center bg-teal-600 hover:bg-teal-500 text-white text-sm font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                  onClick={() =>
                                    setAddCustomerClicked(!addCustomerClicked)
                                  }
                                >
                                  {!addCustomerClicked ? (
                                    <>
                                      <FaPlus className="mr-2" />
                                      {t("Add Customer")}
                                    </>
                                  ) : (
                                    t("Select Customer")
                                  )}
                                </button>
                              </div>
                            </div>

                            <div className="mb-4">
                              <Field
                                name="service"
                                label={t("Service")}
                                component={CustomSelectList}
                                options={services}
                                selectedOptions={values.service}
                                setSelectedOptions={(selectedOptions) =>
                                  setFieldValue("service", selectedOptions)
                                }
                              />
                            </div>

                            <div className="mb-4">
                              <Field
                                name="product"
                                label={t("Product")}
                                component={CustomSelectList}
                                options={products}
                                selectedOptions={values.product}
                                setSelectedOptions={(selectedOptions) =>
                                  setFieldValue("product", selectedOptions)
                                }
                              />
                            </div>
                          </div>

                          <div>
                            <CustomSelect
                              label={t("Professional")}
                              id="professional"
                              name="professional"
                              options={professionals}
                            />
                            <div className="flex justify-start items-center">
                              <label
                                htmlFor="manualDuration"
                                className={`block text-sm font-semibold  mb-2`}
                              >
                                {t("Set Duration Manually")}
                              </label>
                              <Switch
                                id="manualDuration"
                                name="manualDuration"
                                checked={allowManualDuration}
                                onChange={() =>
                                  setAllowManualDuration(!allowManualDuration)
                                }
                                onColor="#86d3ff"
                                onHandleColor="#2693e6"
                                handleDiameter={20}
                                uncheckedIcon={false}
                                checkedIcon={false}
                                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                                activeBoxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                                height={14}
                                width={30}
                                className="ml-2"
                              />
                            </div>
                            <div className="mb-4">
                              <label
                                htmlFor="appointmentDuration"
                                className="block text-sm font-semibold  mb-2"
                              >
                                {t("Appointment Duration")}
                              </label>
                              <div
                                className={`flex flex-wrap sm:flex-nowrap items-center ${
                                  !isDarkMode && "border border-gray-300"
                                } rounded-lg ${
                                  isDarkMode && "bg-gray-700"
                                } overflow-hidden`}
                              >
                                <div className="flex items-center w-full">
                                  <input
                                    type="number"
                                    id="hours"
                                    name="hours"
                                    value={
                                      values.appointmentDuration.split(":")[0]
                                    }
                                    className={`${
                                      isDarkMode
                                        ? SpecialInputDarkStyle
                                        : SpecialInputLightStyle
                                    }`}
                                    onChange={handleDurationChange}
                                    disabled={!allowManualDuration}
                                  />
                                  <span
                                    className={`${
                                      isDarkMode
                                        ? "text-white"
                                        : "text-gray-600"
                                    } px-2`}
                                  >
                                    :
                                  </span>
                                  <input
                                    type="number"
                                    id="minutes"
                                    name="minutes"
                                    value={
                                      values.appointmentDuration.split(":")[1]
                                    }
                                    className={`${
                                      isDarkMode
                                        ? SpecialInputDarkStyle
                                        : SpecialInputLightStyle
                                    }`}
                                    onChange={handleDurationChange}
                                    step="5"
                                    disabled={!allowManualDuration}
                                  />
                                </div>
                                <div
                                  className={`${
                                    isDarkMode
                                      ? "bg-gray-600 text-white"
                                      : "bg-gray-200 text-gray-600"
                                  } px-3 py-2 w-1/2 sm:w-fit`}
                                >
                                  <span className="text-xs">{t("HOURS")}</span>
                                </div>
                                <div
                                  className={`${
                                    isDarkMode
                                      ? "bg-gray-600 text-white"
                                      : "bg-gray-200 text-gray-600"
                                  } px-3 py-2 w-1/2 sm:w-fit`}
                                >
                                  <span className="text-xs">
                                    {t("MINUTES")}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="mb-4">
                              <label
                                htmlFor="date"
                                className="block text-sm font-semibold  mb-2"
                              >
                                {t("Date")}
                              </label>
                              <input
                                type="date"
                                id="date"
                                name="date"
                                value={values.date}
                                className={`${
                                  isDarkMode
                                    ? NoWidthInputDarkStyle
                                    : NoWidthInputLightStyle
                                }`}
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
                                className="block text-sm font-semibold  mb-2"
                              >
                                {t("Time")}
                              </label>
                              <input
                                type="time"
                                id="time"
                                name="time"
                                value={values.time}
                                className={`${
                                  isDarkMode
                                    ? NoWidthInputDarkStyle
                                    : NoWidthInputLightStyle
                                }`}
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
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <button
                              type="submit"
                              disabled={isSubmitting}
                              className="submit-button flex items-center bg-teal-600 hover:bg-teal-500 text-white text-sm font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                              {isSubmitting ? (
                                <FaSpinner className="animate-spin mr-2" />
                              ) : (
                                <FaRedo className="mr-2" />
                              )}
                              {t("Update")}
                            </button>
                            <button
                              type="button"
                              // disabled={isSubmitting}
                              onClick={() => handleCheckout(values)}
                              className="checkout-button w-fit mx-1 flex items-center bg-green-500 hover:bg-green-600 text-white text-sm font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                              {isSubmitting ? (
                                <FaSpinner className="animate-spin mr-2" />
                              ) : (
                                <FaCreditCard className="mr-2" />
                              )}
                              {t("Checkout")}
                            </button>
                            {/* WhatsApp Button */}
                            <button
                              type="button"
                              className={`whatsapp-button relative w-fit flex items-center ${
                                currentPlan === "personal"
                                  ? "bg-green-400"
                                  : "bg-green-500 hover:bg-green-600"
                              } text-white text-sm font-bold py-2 px-2 rounded focus:outline-none focus:shadow-outline`}
                              onClick={() => {
                                currentPlan === "personal"
                                  ? setUpgradePlan(true)
                                  : openWhatsApp(values.customer);
                              }}
                            >
                              <FaWhatsapp className="mr-1" />
                              {t("WA")}
                              {currentPlan === "personal" && (
                                <span className="absolute z-10 -top-2 -right-2 p-0 bg-yellow-300 rounded-full inline-flex items-center justify-center font-bold leading-none">
                                  <MdStars
                                    size={25}
                                    className="text-teal-500 m-0"
                                  />
                                </span>
                              )}
                            </button>
                          </div>
                          <div>
                            <button
                              type="button"
                              className={`whatsapp-button relative w-fit flex items-center bg-red-500 hover:bg-red-600 text-white text-sm font-bold py-2 px-2 rounded focus:outline-none focus:shadow-outline`}
                              onClick={openAppointmentDeletePopUp}
                            >
                              <FaTrashAlt className="mr-1" />
                              {t("Remove")}
                            </button>
                          </div>
                        </div>
                      </Form>
                    );
                  }}
                </Formik>
              ) : (
                <div className="bg-white rounded-lg px-8 py-6 mb-4  w-[500px] sm:w-[700px] mx-auto overflow-y-auto">
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <div className="flex flex-col mb-4">
                        <div>
                          <div
                            className="bg-gray-300 rounded-md animate-pulse"
                            style={{ height: "66px" }}
                          ></div>
                        </div>
                        <div>
                          <div className="bg-gray-300 h-9 rounded-md animate-pulse my-1"></div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div
                          className="bg-gray-300 rounded-md animate-pulse"
                          style={{ height: "66px" }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div
                        className="bg-gray-300 rounded-md animate-pulse"
                        style={{ height: "66px" }}
                      ></div>
                      <div className="flex justify-start items-center">
                        <div className="bg-gray-300 h-7 rounded-md animate-pulse"></div>
                      </div>
                      <div className="mb-4">
                        <div
                          className="bg-gray-300 rounded-md animate-pulse"
                          style={{ height: "70px" }}
                        ></div>
                      </div>

                      <div className="mb-4">
                        <div
                          className="bg-gray-300 rounded-md animate-pulse"
                          style={{ height: "54px" }}
                        ></div>
                      </div>
                      <div className="mb-4">
                        <div
                          className="bg-gray-300 h- rounded-md animate-pulse"
                          style={{ height: "54px" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateAppointment;

const CustomSelect = ({ label, options, ...props }) => {
  const { isDarkMode } = useContext(DarkModeContext);
  const { t } = useTranslation();
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
        className="block text-sm font-semibold  mb-2"
      >
        {label}
      </label>
      <Select
        id={props.id || props.name}
        name={props.name}
        className={isDarkMode && "my-react-select-container"}
        classNamePrefix={isDarkMode && "my-react-select"}
        options={formattedOptions}
        value={formattedOptions.find((option) => option.value === field.value)}
        onChange={handleChange}
        placeholder={`${t("Select")} ${label}`}
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

const CustomSelectList = ({ options, label, field, form }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOptions, setSelectedOptions] = useState(field.value || []);

  const selectRef = useRef(null);
  const spanRef = useRef(null);
  const inputRef = useRef(null);

  const { isDarkMode } = useContext(DarkModeContext);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (spanRef.current && inputRef.current) {
      const spanHeight = spanRef.current.offsetHeight;
      inputRef.current.style.height = `${spanHeight}px`;
    }
  }, [selectedOptions]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const toggleOption = (optionId) => {
    setSelectedOptions([...selectedOptions, optionId]);
    const updatedValues = [...form.values[field.name], optionId];
    form.setFieldValue(field.name, updatedValues);
    form.setFieldTouched(field.name, true);
  };

  const removeOption = (optionId, index) => {
    setSelectedOptions((prevOptions) =>
      prevOptions.filter((_, i) => i !== index)
    );
    const updatedValues = selectedOptions.filter((_, i) => i !== index);
    form.setFieldValue(field.name, updatedValues);
    form.setFieldTouched(field.name, true);
  };

  return (
    <>
      <label htmlFor={field.name} className="block text-sm font-semibold  mb-2">
        {label}
      </label>
      <div
        className={`relative ${!isDarkMode && "border border-gray-300"}  ${
          isDarkMode ? "bg-gray-700" : "bg-white"
        } rounded focus:outline-none focus:ring-2 focus:ring-gray-700 pr-2 `}
        ref={selectRef}
      >
        <BiChevronDown
          className="absolute text-3xl top-1 right-2 border-l  border-gray-300  hover:text-gray-500 transition-colors cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        />

        <div className="max-w-[280px] px-1 flex flex-wrap items-center ">
          {selectedOptions.length > 0 && (
            <div className="flex flex-wrap">
              {selectedOptions.map((optionId, index) => {
                const selectedOption = options.find(
                  (option) => option._id === optionId
                );

                return (
                  <span
                    key={index}
                    ref={index === selectedOptions?.length - 1 ? spanRef : null}
                    className={`flex items-center ${
                      isDarkMode ? "bg-gray-800 text-white" : "bg-gray-300"
                    } text-sm px-2 py-1 mx-1 my-1 rounded`}
                  >
                    <span className="mr-1">{selectedOption?.name}</span>
                    <HiX
                      className="cursor-pointer"
                      onClick={() => removeOption(optionId, index)}
                    />
                  </span>
                );
              })}
            </div>
          )}
          <input
            ref={inputRef}
            type="text"
            className={`flex-grow p-1 m-1 focus:outline-none ${
              isDarkMode ? "bg-gray-700" : "bg-white"
            }`}
            style={{ minWidth: "0" }}
            placeholder={
              selectedOptions?.length === 0 ? `${t("Select")} ${label}` : ""
            }
            value={searchQuery}
            onChange={handleSearch}
            onFocus={() => setIsOpen(!isOpen)}
            // onBlur={handleBlur}
          />
        </div>

        {isOpen && (
          <div
            className={`absolute z-10 mt-1 border border-gray-600 ${
              isDarkMode ? "bg-gray-700" : "bg-white"
            } rounded w-full shadow-lg overflow-auto`}
          >
            {options
              .filter((option) =>
                option.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((option, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between px-4 py-2 cursor-pointer ${
                    isDarkMode ? "hover:bg-gray-500" : "bg-gray-300"
                  } `}
                  onClick={() => toggleOption(option._id)}
                >
                  <span>{option.name}</span>
                  {selectedOptions.includes(option._id) && <HiCheck />}
                </div>
              ))}
          </div>
        )}
      </div>
    </>
  );
};
