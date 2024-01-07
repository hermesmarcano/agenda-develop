import React, { useEffect, useState } from "react";
import {
  Formik,
  Form,
  Field,
  FieldArray,
  ErrorMessage,
  useFormikContext,
} from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import Switch from "react-switch";
import {
  FaCalendarAlt,
  FaCalendarCheck,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaIdCard,
  FaLink,
  FaLock,
  FaSpinner,
  FaUser,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ImageUpload from "../../components/ImageUpload";
import instance from "../../axiosConfig/axiosConfig";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { v4 } from "uuid";
import { storage } from "../../services/firebaseStorage";
import { Store } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import { useTranslation } from "react-i18next";
import TermsConditions from "./components/TermsConditions";
import {
  IoIosAddCircleOutline,
  IoIosRemoveCircleOutline,
} from "react-icons/io";

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [modelState, setModelState] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
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

  const [registered, setRegistered] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);

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

  const handleRegisterPrevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleRegisterNextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const RegisterSchema = Yup.object().shape({
    name: Yup.string().required(t("Required")),
    email: Yup.string().email(t("Invalid email")).required(t("Required")),
    password: Yup.string()
      .required(t("Required"))
      .min(6, t("Password must be at least 6 characters")),
    confirmPassword: Yup.string()
      .required(t("Required"))
      .oneOf([Yup.ref("password")], t("Passwords must match")),
    shopName: Yup.string().required(t("Shop Name is required")),
    urlSlug: Yup.string().required(t("URL Slug is required")),
    workingHours: Yup.object().shape({
      Monday: Yup.array(),
      Tuesday: Yup.array(),
      Wednesday: Yup.array(),
      Thursday: Yup.array(),
      Friday: Yup.array(),
      Saturday: Yup.array(),
      Sunday: Yup.array(),
    }),
    profileImg: Yup.mixed().required(t("Profile image is required")),
    agreeToTerms: Yup.boolean().oneOf(
      [true],
      t("You must agree to the terms and conditions")
    ),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <>
      <TermsConditions
        isOpen={modelState}
        onClose={() => setModelState(!modelState)}
      />
      <div className="min-h-[calc(100vh-68px)] bg-gray-50 py-11 sm:px-6 lg:px-8 overflow-auto">
        <div className="flex flex-col justify-center min-h-screen">
          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-5xl">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <Formik
                initialValues={{
                  name: "",
                  email: "",
                  password: "",
                  confirmPassword: "",
                  shopName: "",
                  urlSlug: "",
                  workingHours: {},
                  profileImg: null,
                  agreeToTerms: false,
                }}
                validationSchema={RegisterSchema}
                onSubmit={(values, { setSubmitting }) => {
                  try {
                    setIsRegistering(true);
                    console.log("uploading ....");
                    if (values.profileImg === null) return;
                    let imageName = v4(values.profileImg.name);
                    const fileRef = ref(
                      storage,
                      `${values.name}/profile/${imageName}`
                    );
                    const uploadTask = uploadBytesResumable(
                      fileRef,
                      values.profileImg
                    );

                    uploadTask.on(
                      "state_changed",
                      (snapshot) => {
                        let progress =
                          (snapshot.bytesTransferred / snapshot.totalBytes) *
                          100;
                        console.log(progress);
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
                          .then(async () => {
                            const postData = {
                              name: values.name,
                              email: values.email,
                              password: values.password,
                              shopName: values.shopName,
                              urlSlug: values.urlSlug,
                              workingHours: values.workingHours,
                              plan: {},
                              profileImg: profileImg,
                            };

                            console.log(postData);

                            const updateResponse = await instance.post(
                              "managers",
                              postData
                            );

                            setIsRegistering(false);
                            console.log(updateResponse);

                            notify(
                              t("New Shop"),
                              `${t("New Shop")} "${values.shopName}" ${t(
                                "has been registered"
                              )}`,
                              "success"
                            );
                            navigate("/login");
                          });
                      }
                    );
                  } catch (error) {
                    console.log(error);
                  }
                  setSubmitting(false);
                }}
              >
                {(formikProps) => {
                  const handleShopNameChange = (event) => {
                    const shopName = event.target.value;
                    const slug = createUrlSlug(shopName);
                    formikProps.setFieldValue("shopName", shopName);
                    formikProps.setFieldValue("urlSlug", slug);
                  };
                  return (
                    <Form className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 min-h-[500px]">
                        <div className="flex justify-center items-center bg-sky-500 shadow-lg border-4 border-sky-500 rounded-md">
                          <div className="sm:mx-auto sm:w-full">
                            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                              {t("Create a new account")}
                            </h2>
                            <p className="mt-2 text-center text-sm text-gray-600">
                              {t("Already have an account?")}{" "}
                              <Link
                                to="/login"
                                className="font-medium text-indigo-600 hover:text-indigo-500"
                              >
                                {t("Sign in")}
                              </Link>
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col justify-between">
                          <div className="h-[calc(100%-55px)] my-auto">
                            {currentStep === 1 && (
                              <div>
                                <div>
                                  <label htmlFor="name" className="sr-only">
                                    {t("Name")}
                                  </label>
                                  <div className="relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 right-2 pl-3 flex items-center pointer-events-none">
                                      <FaUser
                                        className="h-5 w-5 text-gray-400"
                                        aria-hidden="true"
                                      />
                                    </div>
                                    <Field
                                      id="name"
                                      name="name"
                                      type="name"
                                      autoComplete="name"
                                      className={`appearance-none rounded-md block w-full my-2 px-3 py-2 border ${
                                        formikProps.errors.name &&
                                        formikProps.touched.name
                                          ? "border-red-500"
                                          : "border-gray-300"
                                      } placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                      placeholder={t("Name")}
                                    />
                                  </div>
                                  {formikProps.errors.name &&
                                  formikProps.touched.name ? (
                                    <div className="mt-2 text-sm text-red-500">
                                      {formikProps.errors.name}
                                    </div>
                                  ) : null}
                                </div>

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
                                      className={`appearance-none rounded-md block w-full my-2 px-3 py-2 border ${
                                        formikProps.errors.email &&
                                        formikProps.touched.email
                                          ? "border-red-500"
                                          : "border-gray-300"
                                      } placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                      placeholder={t("Email address")}
                                    />
                                  </div>
                                  {formikProps.errors.email &&
                                  formikProps.touched.email ? (
                                    <div className="mt-2 text-sm text-red-500">
                                      {formikProps.errors.email}
                                    </div>
                                  ) : null}
                                  {!registered ? (
                                    <div className="mt-2 text-sm text-red-500">
                                      {t(
                                        "This email has been registered before"
                                      )}
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
                                      className={`appearance-none rounded-md block w-full my-2 px-3 py-2 border ${
                                        formikProps.errors.password &&
                                        formikProps.touched.password
                                          ? "border-red-500"
                                          : "border-gray-300"
                                      } placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                      placeholder={t("Password")}
                                    />
                                    <div className="absolute inset-y-0 right-5 pr-3 flex items-center text-sm leading-5">
                                      <button
                                        type="button"
                                        className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500"
                                        onClick={() =>
                                          setShowPassword(!showPassword)
                                        }
                                      >
                                        {showPassword ? (
                                          <FaEye size={20} />
                                        ) : (
                                          <FaEyeSlash size={20} />
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                  {formikProps.errors.password &&
                                  formikProps.touched.password ? (
                                    <div className="mt-2 text-sm text-red-500">
                                      {formikProps.errors.password}
                                    </div>
                                  ) : null}
                                </div>
                                <div>
                                  <label
                                    htmlFor="confirmPassword"
                                    className="sr-only"
                                  >
                                    {t("Confirm Password")}
                                  </label>
                                  <div className="relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 right-2 pl-3 flex items-center pointer-events-none">
                                      <FaLock
                                        className="h-5 w-5 text-gray-400"
                                        aria-hidden="true"
                                      />
                                    </div>
                                    <Field
                                      id="confirmPassword"
                                      name="confirmPassword"
                                      type={
                                        showConfirmPassword
                                          ? "text"
                                          : "password"
                                      }
                                      autoComplete="new-password"
                                      className={`appearance-none rounded-md block w-full my-2 px-3 py-2 border ${
                                        formikProps.errors.confirmPassword &&
                                        formikProps.touched.confirmPassword
                                          ? "border-red-500"
                                          : "border-gray-300"
                                      } placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                      placeholder={t("Confirm Password")}
                                    />
                                    <div className="absolute inset-y-0 right-5 pr-3 flex items-center text-sm leading-5">
                                      <button
                                        type="button"
                                        className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500"
                                        onClick={() =>
                                          setShowConfirmPassword(
                                            !showConfirmPassword
                                          )
                                        }
                                      >
                                        {showConfirmPassword ? (
                                          <FaEye size={20} />
                                        ) : (
                                          <FaEyeSlash size={20} />
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                  {formikProps.errors.confirmPassword &&
                                  formikProps.touched.confirmPassword ? (
                                    <div className="mt-2 text-sm text-red-500">
                                      {formikProps.errors.confirmPassword}
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            )}
                            {currentStep === 2 && (
                              <div>
                                <div>
                                  <label htmlFor="shopName" className="sr-only">
                                    {t("Shop Name")}
                                  </label>
                                  <div className="relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 right-2 pl-3 flex items-center pointer-events-none">
                                      <FaIdCard
                                        className="h-5 w-5 text-gray-400"
                                        aria-hidden="true"
                                      />
                                    </div>
                                    <Field
                                      id="shopName"
                                      name="shopName"
                                      type="shopName"
                                      onChange={handleShopNameChange}
                                      autoComplete="shopName"
                                      className={`appearance-none rounded-md block w-full my-2 px-3 py-2 border ${
                                        formikProps.errors.shopName &&
                                        formikProps.touched.shopName
                                          ? "border-red-500"
                                          : "border-gray-300"
                                      } placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                      placeholder={t("Shop Name")}
                                    />
                                  </div>
                                  {formikProps.errors.shopName &&
                                  formikProps.touched.shopName ? (
                                    <div className="mt-2 text-sm text-red-500">
                                      {formikProps.errors.shopName}
                                    </div>
                                  ) : null}
                                </div>
                                <div>
                                  <label htmlFor="urlSlug" className="sr-only">
                                    {t("URL Slug")}
                                  </label>
                                  <div className="relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 right-2 pl-3 flex items-center pointer-events-none">
                                      <FaLink
                                        className="h-5 w-5 text-gray-400"
                                        aria-hidden="true"
                                      />
                                    </div>
                                    <Field
                                      id="urlSlug"
                                      name="urlSlug"
                                      type="urlSlug"
                                      disabled
                                      autoComplete="urlSlug"
                                      className={`appearance-none rounded-md block w-full my-2 px-3 py-2 border ${
                                        formikProps.errors.urlSlug &&
                                        formikProps.touched.urlSlug
                                          ? "border-red-500"
                                          : "border-gray-300"
                                      } placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                      placeholder={t("URL Sulg")}
                                    />
                                  </div>
                                  {formikProps.errors.urlSlug &&
                                  formikProps.touched.urlSlug ? (
                                    <div className="mt-2 text-sm text-red-500">
                                      {formikProps.errors.urlSlug}
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            )}
                            {currentStep === 3 && (
                              <div className="p-4">
                                <label
                                  htmlFor="workingHours"
                                  className={`block text-black font-bold mb-2`}
                                >
                                  {t("Working Hours")}
                                </label>
                                <WeekDayHours />
                              </div>
                            )}

                            {currentStep === 4 && (
                              <div className="h-full flex flex-col justify-between">
                                <ImageUpload
                                  field={{
                                    name: `profileImg`,
                                    value: formikProps.values.profileImg,
                                    onChange: (file) =>
                                      formikProps.setFieldValue(
                                        `profileImg`,
                                        file
                                      ),
                                    onBlur: formikProps.handleBlur,
                                  }}
                                  form={formikProps}
                                />

                                <div>
                                  <div className="flex items-center space-x-2 my-2">
                                    <input
                                      type="checkbox"
                                      id="agreeToTerms"
                                      name="agreeToTerms"
                                      checked={formikProps.values.agreeToTerms}
                                      onChange={() => {
                                        formikProps.setFieldValue(
                                          "agreeToTerms",
                                          !formikProps.values.agreeToTerms
                                        );
                                      }}
                                      className="form-checkbox h-5 w-5 text-sky-600 transition duration-150 ease-in-out"
                                    />
                                    <label
                                      htmlFor="agreeToTerms"
                                      className="text-gray-700 text-sm ml-2"
                                    >
                                      {t("I agree to the")}{" "}
                                      <button
                                        type="button"
                                        className="text-blue-600 hover:text-blue-800"
                                        onClick={() =>
                                          setModelState(!modelState)
                                        }
                                      >
                                        {t("terms and conditions")}
                                      </button>
                                    </label>
                                  </div>
                                  <ErrorMessage
                                    name={`agreeToTerms`}
                                    component="div"
                                    className="mt-2 text-sm text-red-500"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                          <div
                            className={`flex ${
                              currentStep === 1
                                ? "justify-end"
                                : currentStep === 1
                                ? "justify-start"
                                : "justify-between"
                            } items-center`}
                          >
                            {currentStep !== 1 && (
                              <button
                                type="button"
                                onClick={handleRegisterPrevStep}
                                className="border border-sky-500 hover:shadow-innter transition-all px-6 py-2 font-semibold hover:bg-sky-600 rounded text-sm text-sky-600 hover:text-white"
                              >
                                {t("Prev")}
                              </button>
                            )}
                            {currentStep !== 4 && (
                              <button
                                type="button"
                                onClick={handleRegisterNextStep}
                                className="border border-sky-500 hover:shadow-innter transition-all px-6 py-2 font-semibold hover:bg-sky-600 rounded text-sm text-sky-600 hover:text-white"
                              >
                                {t("Next")}
                              </button>
                            )}
                            {currentStep === 4 && (
                              <div>
                                <button
                                  type="submit"
                                  className={`group relative flex justify-center px-6 py-2 hover:shadow-innter transition-all font-semibold rounded text-sm text-sky-600 hover:text-white border border-sky-500 hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-300 ${
                                    isRegistering ? "cursor-not-allowed" : ""
                                  }`}
                                  disabled={isRegistering}
                                >
                                  {isRegistering ? (
                                    <span className="flex items-center justify-center">
                                      <FaSpinner className="animate-spin mr-2" />
                                      {t("Registering...")}
                                    </span>
                                  ) : (
                                    t("Register")
                                  )}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Form>
                  );
                }}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Register;

function createUrlSlug(shopName) {
  let slug = shopName
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^a-z0-9-_]/g, "");
  slug += "-" + v4().split("-")[0];
  return slug;
}

const WeekDayHours = () => {
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
            isSelected={values.workingHours[day] && values.workingHours[day].length > 0}
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
                values.workingHours[day][values.workingHours[day].length - 1] &&
                values.workingHours[day][values.workingHours[day].length - 1]
                  .endHour < 21 && (
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
