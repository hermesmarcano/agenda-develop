import React, { useContext, useEffect, useState } from "react";
import { Formik, Form, Field, FieldArray, useFormikContext } from "formik";
import Switch from "react-switch";
import * as Yup from "yup";
import { FaTrash, FaWhatsapp, FaBell, FaCheckCircle, FaCalendarCheck, FaCalendarAlt } from "react-icons/fa";
import { IoSettingsSharp } from "react-icons/io5";
import ImageUpload from "../../components/ImageUpload";
import {
  AiOutlineShop,
  AiOutlineUser,
  AiOutlineCreditCard,
} from "react-icons/ai";
import { BiCalendarCheck, BiCalendarEvent } from "react-icons/bi";
import { BsFillPersonPlusFill, BsFillPeopleFill, BsFillCircleFill } from "react-icons/bs";
import { SidebarContext } from "../../context/SidebarContext";
import instance from "../../axiosConfig/axiosConfig";
import { DarkModeContext } from "../../context/DarkModeContext";
import { NotificationContext } from "../../context/NotificationContext";
import { storage } from "../../services/firebaseStorage";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { v4 } from "uuid";
import {
  DefaultInputDarkStyle,
  DefaultInputLightStyle,
  Hourglass,
  LoadingUploadButton,
  UpdateButton,
  titleDarkStyle,
  titleLightStyle,
  tapLightStyle,
  tapDarkStyle,
} from "../../components/Styled";
import { Store } from "react-notifications-component";
import ProgressBar from "../../components/ProgressBar";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import PricingCard from "./components/PricingCard";
import Popup from "../../components/Popup";
import { IoIosAddCircleOutline, IoIosRemoveCircleOutline } from "react-icons/io";

const Settings = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { sendNotification } = useContext(NotificationContext);
  const { shopName, setShopName } = useContext(SidebarContext);
  const { isDarkMode } = useContext(DarkModeContext);
  const token = localStorage.getItem("ag_app_shop_token");
  const [loading, setLoading] = useState(true);
  const [shopData, setShopData] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [openPlanPopup, setOpenPlanPopup] = useState(false);

  const [tabIndex, setTabIndex] = useState(0);

  const [plan, setPlan] = useState(null);

  const [plans, setPlans] = useState([]);

  const [selectedPlan, setSelectedPlan] = useState(null);
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const hoursOptions = [];
  for (let hour = 0; hour < 24; hour++) {
    const hour12 = hour % 12 || 12;
    const period = hour < 12 ? t("AM") : t("PM");
    hoursOptions.push(
      <option key={hour} value={hour}>
        {hour12}:00 {period}
      </option>
    );
  }

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
    instance
      .get("admin/plans")
      .then((response) => {
        console.log(response.data.plans);
        const plansArr = Object.keys(response.data.plans).map((key) => {
          return { name: key, ...response.data.plans[key] };
        });
        console.log(JSON.stringify(plansArr));
        setPlans(plansArr);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    instance
      .get("managers/id", {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        console.log(response.data.plan);
        setShopData(response.data);
        const currentPlan = response.data.plan;
        currentPlan.expiryDate = new Intl.DateTimeFormat("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }).format(new Date(response.data.subscription.planEndDate.toString()));
        currentPlan.active =
          new Date(
            response.data.subscription.planEndDate.toString()
          ).getTime() > new Date().getTime()
            ? true
            : false;
        console.log(JSON.stringify(response.data.subscription));
        setPlan(currentPlan);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  }, []);

  const handleSubmit = (values, { resetForm }) => {
    let data = {
      shopName: values.shopName,
      name: values.name,
      discount: {
        type: values.discountType,
        value: values.discountValue,
      },
      workingHours: values.workingHours,
    };

    instance
      .patch("managers", JSON.stringify(data), {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      })
      .then((response) => {
        setShopName(response.data.shopName);
        notify(
          t("Update"),
          `${t("Shop")} "${values.name}" ${t("info has been updated")}`,
          "success"
        );
      })
      .catch((error) => {
        notify(
          t("Error"),
          t(`Some of the data has already been registered before`),
          "danger"
        );
      });
  };

  const deleteProfileImg = () => {
    const desertRef = ref(storage, shopData.profileImg);

    deleteObject(desertRef)
      .then(() => {
        setShopData((prev) => ({ ...prev, profileImg: null }));
      })
      .then(() => {
        instance
          .patch(
            "managers",
            { profileImg: null },
            {
              headers: {
                Authorization: token,
              },
            }
          )
          .then((res) => {
            console.log(res.data);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  function getCurrentLanguage() {
    return i18next.language || "en";
  }

  const uploadProfileImg = (values, { resetForm }) => {
    console.log("uploading ....");
    setIsUploading(true);
    if (values.profileImg === null) return;
    let imageName = v4(values.profileImg.name);
    const fileRef = ref(storage, `${shopName}/profile/${imageName}`);
    const uploadTask = uploadBytesResumable(fileRef, values.profileImg);

    uploadTask
      .on(
        "state_changed",
        (snapshot) => {
          let progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(progress);
          setUploadProgress(progress);
        },
        (error) => {
          console.log("error");
        },
        () => {
          console.log("success");
          let profileImg = null;
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              console.log(downloadURL);
              profileImg = downloadURL;
            })
            .then(() => {
              const patchData = {
                profileImg: profileImg,
              };

              instance
                .patch("managers", patchData, {
                  headers: {
                    Authorization: token,
                  },
                })
                .then((res) => {
                  notify(
                    t("Update"),
                    t(`Shop image has been updated`),
                    "success"
                  );
                  sendNotification(
                    `${t("Profile Image updated")} - ` +
                      new Intl.DateTimeFormat(getCurrentLanguage(), {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }).format(new Date())
                  );
                  navigate(0);
                });
              setIsUploading(false).catch((error) => {
                notify(
                  t("Error"),
                  t(`Some of the data has already been registered before`),
                  "danger"
                );
              });
            });
        }
      )

      .catch((error) => console.log(error));
  };

  const handleTabChange = (index) => {
    setTabIndex(index);
  };

  const handlePlanChangePopUp = (plan) => {
    setSelectedPlan(plan)
    setOpenPlanPopup(true)
  }

  const handlePlanChange = (plan, type) => {
    checkout(plan.name, type);
  };


  const renderTabContent = () => {
    switch (tabIndex) {
      case 0:
        return (
          <div className="w-full">
            <Formik
              initialValues={{
                shopName: shopData.shopName,
                name: shopData.name,
                workingHours: shopData.workingHours,
              }}
              validationSchema={Yup.object().shape({
                workingHours: Yup.object().shape(
                  daysOfWeek.reduce((acc, day) => {
                    acc[day] = Yup.array().of(
                      Yup.object().shape({
                        startHour: Yup.number()
                          .required("Start hour is required")
                          .min(0)
                          .max(23),
                        endHour: Yup.number()
                          .required("End hour is required")
                          .min(Yup.ref("startHour"), "End hour must be greater than start hour")
                          .max(23)
                      })
                    );
                    return acc;
                  }, {})
                ),
              })}
              onSubmit={handleSubmit}
            >
              {(formikProps) => (
                <Form
                  className={`rounded-lg shadow-md px-8 py-6 mb-4 ${
                    isDarkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <div className="mb-6">
                    <label
                      htmlFor="shop-name"
                      className="block text-lg font-semibold mb-2"
                    >
                      {t("Shop Name")}:
                    </label>
                    <Field
                      type="text"
                      id="shop-name"
                      name="shopName"
                      className={`${
                        isDarkMode
                          ? DefaultInputDarkStyle
                          : DefaultInputLightStyle
                      }`}
                    />
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="manager-name"
                      className="block text-lg font-semibold mb-2"
                    >
                      {t("Manager Name")}:
                    </label>
                    <Field
                      type="text"
                      id="manager-name"
                      name="name"
                      className={`${
                        isDarkMode
                          ? DefaultInputDarkStyle
                          : DefaultInputLightStyle
                      }`}
                    />
                  </div>
                  <div className="mb-4">
                <label
                  htmlFor="workingHours"
                  className={`block text-sm text-${
                    isDarkMode ? "white" : "gray-700"
                  } font-bold mb-2`}
                >
                  {t("Working Hours")}
                </label>
                <WeekDayHours workingHours={shopData?.workingHours} />
                {/* <ErrorMessage
                  name="workingHours"
                  component="p"
                  className="text-red-500 text-xs italic"
                /> */}
              </div>

                  <div className="flex items-center justify-end">
                    <UpdateButton disabled={formikProps.isSubmitting} />
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        );
      case 1:
        return (
          <div className="w-full">
            <div
              className={`rounded-lg shadow-md px-8 py-6 mb-4 ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <h2 className="text-2xl font-semibold mb-4">
                {t("Profile Image")}
              </h2>
              {shopData.profileImg ? (
                <div className="relative">
                  <img
                    src={shopData.profileImg}
                    alt={shopData.profileImg}
                    className="w-full rounded-md max-h-40 object-cover mt-2"
                  />

                  <button
                    type="button"
                    onClick={deleteProfileImg}
                    className="text-red-600 font-medium mt-2 absolute right-1 top-1"
                  >
                    <FaTrash />
                  </button>
                </div>
              ) : (
                <Formik
                  initialValues={{
                    profileImg: "",
                  }}
                  onSubmit={uploadProfileImg}
                >
                  {({ isSubmitting }) => (
                    <Form>
                      <Field name="profileImg" component={ImageUpload} />
                      <div className="mt-2">
                        <LoadingUploadButton
                          disabled={isSubmitting}
                          isUploading={isUploading}
                        />
                      </div>
                      <div className="my-4">
                        <ProgressBar progress={uploadProgress} />
                      </div>
                    </Form>
                  )}
                </Formik>
              )}
            </div>
          </div>
        );
      case 2:
        return (
          <div
            className={`w-full rounded-lg shadow-md px-8 py-6 mb-4 ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h2 className="text-2xl font-semibold mb-4">Subscription</h2>
            <div className="mt-4 border rounded-lg p-4">
              <h3 className="text-xl mb-2 font-bold">
                Current Plan: {plan.name.toUpperCase()}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                  <FeatureItem
                    icon={<BsFillPersonPlusFill className="text-sky-500" />}
                    label="Professionals:"
                    value={plan.professionals}
                  />
                  <FeatureItem
                    icon={<BsFillPeopleFill className="text-sky-500" />}
                    label="Customers:"
                    value={plan.customers}
                  />
                  <FeatureItem
                    icon={<BiCalendarCheck className="text-sky-500" />}
                    label="Agenda:"
                    value={plan.agenda ? "Yes" : "No"}
                  />
                </div>
                <div>
                  <FeatureItem
                    icon={<AiOutlineUser className="text-sky-500" />}
                    label="Business Admin:"
                    value={plan.businessAdmin ? "Yes" : "No"}
                  />
                  <FeatureItem
                    icon={<BiCalendarEvent className="text-sky-500" />}
                    label="Reservation Page:"
                    value={plan.reservationPage ? "Yes" : "No"}
                  />
                  <FeatureItem
                    icon={<FaWhatsapp className="text-sky-500" />}
                    label="WhatsApp Integration:"
                    value={plan.whatsAppIntegration ? "Yes" : "No"}
                  />
                  <FeatureItem
                    icon={<FaBell className="text-sky-500" />}
                    label="Appointment Reminders:"
                    value={plan.appointmentReminders ? "Yes" : "No"}
                  />
                </div>
              </div>
              <div className="mt-4 flex items-center space-x-2">
                <span className="text-sm">Expiry Date:</span>
                <span className="text-sm font-bold">{plan.expiryDate}</span>
              </div>
              <div className="mt-4 flex items-center space-x-2">
                <span className="text-sm">Subscription Status:</span>
                <span
                  className={`text-sm font-bold ${
                    plan.active ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {plan.active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
            <div className={`mt-4 flex flex-wrap justify-center items-center gap-4 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"} rounded-md border border-gray-50 p-4`}>
              {plans.map((props) => (
                <PricingCard
                  {...{ ...props, currentPlan: plan.name }}
                  key={props.name}
                  clickMe={() => handlePlanChangePopUp(props)}
                />
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const checkout = (plan, type) => {
    instance
      .post(
        "managers/create-subscription-checkout-session",
        JSON.stringify({ plan: plan, type: type }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          window.location = response.data.session.url;
        } else {
          return response.json().then((json) => Promise.reject(json));
        }
      })
      .catch((e) => {
        console.log(e.error);
      });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Hourglass />
      </div>
    );
  }

  return (
    <>
    <Popup 
    isOpen={openPlanPopup}
    onClose={() => setOpenPlanPopup(false)}
    children={
      <PlanSelection handlePlanSelection={handlePlanChange} planData={selectedPlan} />
    }
    />
    <div className="flex w-full flex-col min-h-[calc(100vh-68px)] p-6">
      <div className={isDarkMode ? titleDarkStyle : titleLightStyle}>
        <div className="flex items-center justify-center">
          <IoSettingsSharp className="mr-2 text-xl" />
          <span>{t("Dashboard Settings")}</span>
        </div>
      </div>
      <div className="w-full mx-auto">
        <div className={isDarkMode ? tapDarkStyle : tapLightStyle}>
          <TabButton
            icon={<AiOutlineShop size={30} className="text-sky-500" />}
            label="Shop Configuration"
            active={tabIndex === 0}
            onClick={() => handleTabChange(0)}
          />
          <TabButton
            icon={<AiOutlineUser size={30} className="text-sky-500" />}
            label="Profile Image"
            active={tabIndex === 1}
            onClick={() => handleTabChange(1)}
          />
          <TabButton
            icon={<AiOutlineCreditCard size={30} className="text-sky-500" />}
            label="Subscription"
            active={tabIndex === 2}
            onClick={() => handleTabChange(2)}
          />
        </div>
        {renderTabContent()}
      </div>
    </div>
    </>
  );
};

export default Settings;

const TabButton = ({ icon, label, active, onClick }) => {
  const { isDarkMode } = useContext(DarkModeContext);
  return (
    <button
      className={`flex flex-col items-center justify-center p-2 ${
        active
          ? `${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`
          : `${isDarkMode ? "bg-gray-800" : "bg-white"}`
      } ${
        isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
      } transition-colors duration-300`}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

const FeatureItem = ({ icon, label, value }) => {
  return (
    <div className="flex items-center space-x-2 text-lg">
      {icon}
      <span>{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  );
};

const PlanSelection = ({ handlePlanSelection, planData }) => {
  const [selectedPlan, setSelectedPlan] = useState("monthly");
  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
  };

  return (
    <div className="flex flex-col items-center justify-center p-5">
      <h2 className="text-3xl font-bold mb-6">Choose Your Plan</h2>
      <div className="flex sm:flex-row flex-col gap-4">
        <div
          className={`w-56 flex flex-col justify-center items-center cursor-pointer p-6 border-4 rounded-lg transition duration-300 ease-in-out hover:border-sky-500 ${
            selectedPlan === "monthly" ? "border-sky-500" : "border-gray-300"
          }`}
          onClick={() => handleSelectPlan("monthly")}
        >
          <h3 className="text-2xl font-semibold mb-2">Monthly Plan</h3>
          <p className="text-gray-600">${planData?.price} / month</p>
          {selectedPlan === "monthly" ? (
            <FaCheckCircle className="text-sky-500 mt-4 text-3xl" />
          ) : (
            <BsFillCircleFill className="text-gray-300 mt-4 text-3xl" />
          )}
        </div>
        <div
          className={`w-56 flex flex-col justify-center items-center cursor-pointer p-6 border-4 rounded-lg transition duration-300 ease-in-out hover:border-sky-500 ${
            selectedPlan === "yearly" ? "border-sky-500" : "border-gray-300"
          }`}
          onClick={() => handleSelectPlan("yearly")}
        >
          <h3 className="text-2xl font-semibold mb-2">Yearly Plan</h3>
          <p className="text-gray-600">${planData?.annualPrice} / year</p>
          {selectedPlan === "yearly" ? (
            <FaCheckCircle className="text-sky-500 mt-4 text-3xl" />
          ) : (
            <BsFillCircleFill className="text-gray-300 mt-4 text-3xl" />
          )}
        </div>
      </div>
      <button
        className="bg-sky-500 text-white px-6 py-3 rounded-lg mt-6 font-bold text-lg hover:bg-sky-600 transition duration-300 ease-in-out"
        onClick={() => handlePlanSelection(planData.name, selectedPlan)}
      >
        Confirm
      </button>
    </div>
  );
};


const WeekDayHours = ({ workingHours }) => {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const { values, setFieldValue } = useFormikContext();
  const [activeTab, setActiveTab] = useState(days[0]);

  const addTimeRange = (day) => {
    const daySchedule = [...(values.workingHours[day] || [])];
    if (daySchedule.length < 3) {
      daySchedule.push({ startHour: "", endHour: "" });
      setFieldValue(`workingHours.${day}`, daySchedule, false, () => {
        const index = daySchedule.length - 1;
        const startHourOptions = getFilteredHours(day, index, false);
        const endHourOptions = getFilteredHours(day, index, true);

        const startHour =
          startHourOptions.length > 0 ? startHourOptions[0].value : "";
        const endHour =
          endHourOptions.length > 0 ? endHourOptions[0].value : "";

        setFieldValue(`workingHours.${day}.${index}.startHour`, startHour);
        setFieldValue(`workingHours.${day}.${index}.endHour`, endHour);
      });
    }
  };

  useEffect(() => {
    days.forEach((day) => {
      const daySchedule = values.workingHours[day] || [];
      daySchedule.forEach((_, index) => {
        const startHourOptions = getFilteredHours(day, index, false);
        const endHourOptions = getFilteredHours(day, index, true);

        const startHour =
          startHourOptions.length > 0 ? startHourOptions[0].value : "";
        const endHour =
          endHourOptions.length > 0 ? endHourOptions[0].value : "";

        if (values.workingHours[day][index].startHour === "") {
          setFieldValue(`workingHours.${day}.${index}.startHour`, startHour);
        }
        if (values.workingHours[day][index].endHour === "") {
          setFieldValue(`workingHours.${day}.${index}.endHour`, endHour);
        }
      });
    });
  }, [values.workingHours]);

  const removeTimeRange = (day, index) => {
    const daySchedule = values.workingHours[day];
    if (daySchedule) {
      daySchedule.splice(index, 1);
      setFieldValue(`workingHours.${day}`, daySchedule);
    }
  };

  const handleSwitchChange = (day, checked) => {
    if (checked) {
      addTimeRange(day);
    } else {
      setFieldValue(`workingHours.${day}`, []);
    }
  };

  const hours = Array.from({ length: 24 }, (_, i) => {
    const hour = i % 12 || 12;
    const ampm = i < 12 ? "AM" : "PM";
    return {
      display: `${hour.toString().padStart(2, "0")}:00 ${ampm}`,
      value: i,
    };
  });

  const getFilteredHours = (day, index, isEndHour) => {
    let filteredHours;
    if (values.workingHours[day] && values.workingHours[day][index]) {
      if (isEndHour) {
        const startHour = values.workingHours[day][index].startHour;
        const previousEndHour =
          index > 0 ? values.workingHours[day][index - 1].endHour : null;
        filteredHours = hours.filter(
          (hour) =>
            hour.value >
            Math.max(Number(startHour), Number(previousEndHour) + 1 || -1)
        );
      } else {
        const previousEndHour =
          index > 0 ? values.workingHours[day][index - 1].endHour : null;
        filteredHours = hours.filter(
          (hour) => previousEndHour === null || hour.value > previousEndHour
        );
      }
    }
    return filteredHours || [];
  };

  return (
    <div className="grid grid-cols-1 gap-4 w-full max-h-[300px] overflow-y-auto no-scrollbar">
      {days.map((day) => (
            <div>
              <Tab
                icon={<FaCalendarAlt />}
                label={day}
                isActive={activeTab === day}
                isSelected={
                  values.workingHours[day] &&
                  values.workingHours[day].length > 0
                }
                onClick={() => setActiveTab(day)}
              />
              {activeTab === day && (
                <div
                  key={day}
                  className="flex flex-col items-center bg-gray-100 p-4 rounded-b-lg shadow-lg w-full"
                >
                  <Switch
                    onChange={(checked) => handleSwitchChange(day, checked)}
                    checked={
                      values.workingHours[day] &&
                      values.workingHours[day].length > 0
                    }
                    className="mt-2 mb-4"
                  />
                  <FieldArray name={`workingHours.${day}`}>
                    {() =>
                      (values.workingHours[day] || []).map((_, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 border-b border-gray-300 pb-2 mb-2"
                        >
                          <Field
                            as="select"
                            name={`workingHours.${day}.${index}.startHour`}
                            className="border p-2 rounded hide-scrollbar"
                            value={
                              values.workingHours[day][index].startHour ||
                              getFilteredHours(day, index, false)[0]?.value
                            }
                          >
                            {getFilteredHours(day, index, false).map((hour) => (
                              <option key={hour.value} value={hour.value}>
                                {hour.display}
                              </option>
                            ))}
                          </Field>
                          <span className="text-gray-600">to</span>
                          <Field
                            as="select"
                            name={`workingHours.${day}.${index}.endHour`}
                            className="border p-2 rounded hide-scrollbar"
                            value={
                              values.workingHours[day][index].endHour ||
                              getFilteredHours(day, index, true)[0]?.value
                            }
                          >
                            {getFilteredHours(day, index, true).map((hour) => (
                              <option key={hour.value} value={hour.value}>
                                {hour.display}
                              </option>
                            ))}
                          </Field>
                          <button
                            type="button"
                            onClick={() => removeTimeRange(day, index)}
                            className="flex items-center space-x-2 text-red-500"
                          >
                            <IoIosRemoveCircleOutline />
                          </button>
                        </div>
                      ))
                    }
                  </FieldArray>
                  {values.workingHours[day] &&
                    values.workingHours[day].length < 3 &&
                    values.workingHours[day][
                      values.workingHours[day].length - 1
                    ] &&
                    values.workingHours[day][
                      values.workingHours[day].length - 1
                    ].endHour < 21 && (
                      <button
                        type="button"
                        onClick={() => addTimeRange(day)}
                        className="flex items-center space-x-2 text-blue-500"
                      >
                        <IoIosAddCircleOutline />
                        <span>Add Time Range</span>
                      </button>
                    )}
                </div>
              )}
            </div>
          ))}
    </div>
  );
};

const Tab = ({ icon, label, isActive, isSelected, onClick }) => (
  <div
    className={`cursor-pointer px-4 py-2 flex items-center space-x-2 ${
      isActive ? "bg-sky-500 text-white rounded-t-md" : "text-sky-500"
    }`}
    onClick={onClick}
  >
    {isSelected ? <FaCalendarCheck color="#22543d" /> : icon}
    <span className={isSelected && "text-green-900"}>{label}</span>
  </div>
);