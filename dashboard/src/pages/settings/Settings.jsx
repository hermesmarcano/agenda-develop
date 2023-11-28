import React, { useContext, useEffect, useState } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaTrash } from "react-icons/fa";
import { IoSettingsSharp } from "react-icons/io5";
import ImageUpload from "../../components/ImageUpload";
import { RiCloseCircleLine } from "react-icons/ri";
import { TiPlus } from "react-icons/ti";
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
} from "../../components/Styled";
import { Store } from "react-notifications-component";
import ProgressBar from "../../components/ProgressBar";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

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
      .get("managers/id", {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setShopData(response.data);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Hourglass />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col h-full p-6">
      <div className={isDarkMode ? titleDarkStyle : titleLightStyle}>
        <div className="flex items-center justify-center">
          <IoSettingsSharp className="mr-2 text-xl" />
          <span>{t("Dashboard Settings")}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <Formik
            initialValues={{
              shopName: shopData.shopName,
              name: shopData.name,
              workingHours:
                shopData?.workingHours?.length === 0
                  ? [{ startHour: 0, endHour: 0 }]
                  : shopData?.workingHours || [{ startHour: 0, endHour: 0 }],
            }}
            validationSchema={Yup.object().shape({
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
                .test(
                  "noOverlap",
                  t("Working hours cannot overlap"),
                  function (value) {
                    let isValid = true;
                    for (let i = 0; i < value.length; i++) {
                      for (let j = i + 1; j < value.length; j++) {
                        const startHourA = value[i].startHour;
                        const endHourA = value[i].endHour;
                        const startHourB = value[j].startHour;
                        const endHourB = value[j].endHour;

                        // Check if there is any overlap between the two periods
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
                  }
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

                <label
                  htmlFor="discount-value"
                  className="block text-lg font-semibold mb-2"
                >
                  {t("Working Hours")}:
                </label>
                <FieldArray name="workingHours">
                  {({ remove, push }) => (
                    <div className="space-y-4 mb-4">
                      {formikProps.values.workingHours.map(
                        (workingHour, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <div className="flex items-center space-x-2 w-64">
                              <div>
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
                                    formikProps.errors.workingHours?.[index]
                                      ?.startHour &&
                                    formikProps.touched.workingHours?.[index]
                                      ?.startHour
                                      ? "border-red-500"
                                      : "border-gray-300"
                                  } placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                    isDarkMode
                                      ? "bg-gray-700 text-white"
                                      : "bg-white text-gray-800"
                                  }`}
                                >
                                  <option value="">
                                    {t("Select start hour")}
                                  </option>
                                  {hoursOptions}
                                </Field>
                                <ErrorMessage
                                  name={`workingHours[${index}].startHour`}
                                  component="div"
                                  className="mt-1 text-sm text-red-500"
                                />
                              </div>
                              <div>
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
                                    formikProps.errors.workingHours?.[index]
                                      ?.endHour &&
                                    formikProps.touched.workingHours?.[index]
                                      ?.endHour
                                      ? "border-red-500"
                                      : "border-gray-300"
                                  } placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                    isDarkMode
                                      ? "bg-gray-700 text-white"
                                      : "bg-white text-gray-800"
                                  }`}
                                >
                                  <option value="">
                                    {t("Select end hour")}
                                  </option>
                                  {hoursOptions}
                                </Field>
                                <ErrorMessage
                                  name={`workingHours[${index}].endHour`}
                                  component="div"
                                  className="mt-1 text-sm text-red-500"
                                />
                              </div>
                            </div>
                            {index > 0 && (
                              <div>
                                <button
                                  type="button"
                                  className="flex items-center px-2 py-1 text-sm text-red-600 hover:text-red-800"
                                  onClick={() => remove(index)}
                                >
                                  <RiCloseCircleLine className="mr-1" />
                                  {t("Remove")}
                                </button>
                              </div>
                            )}
                          </div>
                        )
                      )}
                      <div className="flex justify-start">
                        {formikProps.values.workingHours.length < 3 && (
                          <button
                            type="button"
                            className="flex items-center px-2 py-1 text-sm text-blue-600 hover:text-blue-800"
                            onClick={() => push({ startHour: 0, endHour: 0 })}
                          >
                            <TiPlus className="mr-1" />
                            {t("Add Working Hour")}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </FieldArray>

                <div className="flex items-center justify-end">
                  <UpdateButton disabled={formikProps.isSubmitting} />
                </div>
              </Form>
            )}
          </Formik>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">{t("Profile Image")}</h2>
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
    </div>
  );
};

export default Settings;
