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
import {
  FaBusinessTime,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaIdCard,
  FaLink,
  FaLock,
  FaSpinner,
  FaUser,
  FaUserTie,
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
import { RiCloseCircleLine } from "react-icons/ri";
import { TiPlus } from "react-icons/ti";
import { IoIosCheckbox, IoIosCheckboxOutline } from "react-icons/io";

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
    urlSlug: Yup.string()
      .required(t("URL Slug is required")),
    workingHours: Yup.array()
      .of(
        Yup.object().shape({
          startHour: Yup.number()
            .required(t("Start hour is required"))
            .test(
              "startHour",
              t("Start hour must be less than end hour"),
              function (value) {
                return value < this.parent.endHour;
              }
            ),
          endHour: Yup.number()
            .required(t("End hour is required"))
            .test(
              "endHour",
              t("End hour must be greater than start hour"),
              function (value) {
                return value > this.parent.startHour;
              }
            ),
        })
      )
      .test("noOverlap", "Working hours cannot overlap", function (value) {
        let isValid = true;
        for (let i = 0; i < value.length; i++) {
          for (let j = i + 1; j < value.length; j++) {
            const startHourA = value[i].startHour;
            const endHourA = value[i].endHour;
            const startHourB = value[j].startHour;
            const endHourB = value[j].endHour;

            if (
              (startHourA <= startHourB && startHourB < endHourA) ||
              (startHourA < endHourB && endHourB <= endHourA) ||
              (startHourB <= startHourA && startHourA < endHourB) ||
              (startHourB < endHourA && endHourA <= endHourB)
            ) {
              isValid = false;
              break;
            }
          }
          if (!isValid) {
            break;
          }
        }
        return isValid;
      }),
    selectedDays: Yup.array().min(1, "Please select at least one day."),
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
                  workingHours: [{ startHour: 0, endHour: 0 }],
                  selectedDays: [],
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
                              selectedDays: values.selectedDays,
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
                    formikProps.setFieldValue('shopName', shopName);
                    formikProps.setFieldValue('urlSlug', slug);
                  };
                return(
                  <Form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 min-h-[500px]">
                      <div className="flex justify-center items-center bg-teal-500 shadow-lg border-4 border-teal-500 rounded-md">
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
                                    {t("This email has been registered before")}
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
                                      showConfirmPassword ? "text" : "password"
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
                            <div>
                              <div className="w-full flex justify-center items-center">
                                <FieldArray name="workingHours">
                                  {({ remove, push }) => (
                                    <div>
                                      {formikProps.values.workingHours.map(
                                        (workingHour, index) => (
                                          <>
                                            <div
                                              key={index}
                                              className="flex w-full items-center space-x-2 my-2 relative"
                                            >
                                              <div className="w-[47.5%]">
                                                <label
                                                  htmlFor={`workingHours[${index}].startHour`}
                                                  className="sr-only"
                                                >
                                                  {t("Start Hour")}
                                                </label>
                                                <Field
                                                  id={`workingHours[${index}].startHour`}
                                                  name={`workingHours[${index}].startHour`}
                                                  as="select"
                                                  className={`block appearance-none rounded-md w-full px-3 py-2 border ${
                                                    formikProps.errors
                                                      .workingHours?.[index]
                                                      ?.startHour &&
                                                    formikProps.touched
                                                      .workingHours?.[index]
                                                      ?.startHour
                                                      ? "border-red-500"
                                                      : "border-gray-300"
                                                  } placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                                >
                                                  <option value="">
                                                    {t("Select start hour")}
                                                  </option>
                                                  {hoursOptions}
                                                </Field>
                                              </div>
                                              <div className="flex w-[5%] justify-center items-center">
                                                -
                                              </div>
                                              <div className="w-[47.5%]">
                                                <label
                                                  htmlFor={`workingHours[${index}].endHour`}
                                                  className="sr-only"
                                                >
                                                  {t("End Hour")}
                                                </label>
                                                <Field
                                                  id={`workingHours[${index}].endHour`}
                                                  name={`workingHours[${index}].endHour`}
                                                  as="select"
                                                  className={`block appearance-none rounded-md w-full px-3 py-2 border ${
                                                    formikProps.errors
                                                      .workingHours?.[index]
                                                      ?.endHour &&
                                                    formikProps.touched
                                                      .workingHours?.[index]
                                                      ?.endHour
                                                      ? "border-red-500"
                                                      : "border-gray-300"
                                                  } placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                                >
                                                  <option value="">
                                                    {t("Select end hour")}
                                                  </option>
                                                  {hoursOptions}
                                                </Field>
                                              </div>

                                              <div className="absolute -right-5 -top-3">
                                                {index > 0 && (
                                                  <div>
                                                    <button
                                                      type="button"
                                                      className="flex items-center px-2 py-1 text-sm text-red-600 hover:text-red-800"
                                                      onClick={() =>
                                                        remove(index)
                                                      }
                                                    >
                                                      <RiCloseCircleLine
                                                        size={20}
                                                        className="mr-1 bg-white rounded-full"
                                                      />
                                                      {/* {t("Remove")} */}
                                                    </button>
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          </>
                                        )
                                      )}
                                      <ErrorMessage
                                        name={`workingHours[0].startHour`}
                                        component="div"
                                        className="mt-2 text-sm text-red-500"
                                      />
                                      <ErrorMessage
                                        name={`workingHours[1].startHour`}
                                        component="div"
                                        className="mt-2 text-sm text-red-500"
                                      />
                                      <ErrorMessage
                                        name={`workingHours[2].startHour`}
                                        component="div"
                                        className="mt-2 text-sm text-red-500"
                                      />
                                      <ErrorMessage
                                        name={`workingHours[0].endHour`}
                                        component="div"
                                        className="mt-2 text-sm text-red-500"
                                      />
                                      <ErrorMessage
                                        name={`workingHours[1].endHour`}
                                        component="div"
                                        className="mt-2 text-sm text-red-500"
                                      />
                                      <ErrorMessage
                                        name={`workingHours[2].endHour`}
                                        component="div"
                                        className="mt-2 text-sm text-red-500"
                                      />
                                      <div className="flex justify-center mt-2">
                                        {formikProps.values.workingHours
                                          .length < 3 && (
                                          <button
                                            type="button"
                                            className="flex items-center px-2 py-1 text-sm text-blue-600 hover:text-blue-800"
                                            onClick={() =>
                                              push({ startHour: 0, endHour: 0 })
                                            }
                                          >
                                            <TiPlus className="mr-1" />
                                            {t("Add Working Hour")}
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </FieldArray>
                              </div>
                              <div>
                                <Field
                                  name="selectedDays"
                                  component={WeekdayPicker}
                                />
                              </div>
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
                                    className="form-checkbox h-5 w-5 text-teal-600 transition duration-150 ease-in-out"
                                  />
                                  <label
                                    htmlFor="agreeToTerms"
                                    className="text-gray-700 text-sm ml-2"
                                  >
                                    {t("I agree to the")}{" "}
                                    <button
                                      type="button"
                                      className="text-blue-600 hover:text-blue-800"
                                      onClick={() => setModelState(!modelState)}
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
                              className="bg-teal-500 shadow-lg px-6 py-3 font-semibold hover:bg-teal-600 rounded text-white"
                            >
                              {t("Prev")}
                            </button>
                          )}
                          {currentStep !== 4 && (
                            <button
                              type="button"
                              onClick={handleRegisterNextStep}
                              className="bg-teal-500 shadow-lg px-6 py-3 font-semibold hover:bg-teal-600 rounded text-white"
                            >
                              {t("Next")}
                            </button>
                          )}
                          {currentStep === 4 && (
                            <div>
                              <button
                                type="submit"
                                className={`group relative flex justify-center px-6 py-3 border border-transparent text-sm font-semibold rounded text-white bg-teal-500 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-300 ${
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
                )}}
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
  let slug = shopName.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-_]/g, '');
  slug += '-' + v4().split('-')[0];
  return slug;
}

const WeekdayPicker = () => {
  const formik = useFormikContext();

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const toggleDay = (day) => {
    const selectedDays = formik.values.selectedDays || [];

    if (selectedDays.includes(day)) {
      formik.setFieldValue(
        "selectedDays",
        selectedDays.filter((d) => d !== day)
      );
    } else {
      formik.setFieldValue("selectedDays", [...selectedDays, day]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center my-2">
      <div className="grid grid-cols-3 gap-3">
        {days.map((day) => (
          <div
            key={day}
            className={`p-4 border rounded-lg cursor-pointer ${
              formik.values.selectedDays?.includes(day)
                ? "bg-teal-500 text-white"
                : "bg-white"
            }`}
            onClick={() => toggleDay(day)}
          >
            {formik.values.selectedDays?.includes(day) ? (
              <IoIosCheckbox size={24} />
            ) : (
              <IoIosCheckboxOutline size={24} />
            )}
            <span className="ml-2">{day}</span>
          </div>
        ))}
      </div>
      {formik.touched.selectedDays && formik.errors.selectedDays && (
        <div className="text-red-500">{formik.errors.selectedDays}</div>
      )}
    </div>
  );
};
