import React, { useContext, useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { SidebarContext } from "../../../context/SidebarContext";
import { FaSpinner } from "react-icons/fa";
import { TiPlus } from "react-icons/ti";
import { RiCloseCircleLine } from "react-icons/ri";
import instance from "../../../axiosConfig/axiosConfig";
import { NotificationContext } from "../../../context/NotificationContext";
import { DarkModeContext } from "../../../context/DarkModeContext";
import {
  DefaultInputDarkStyle,
  DefaultInputLightStyle,
  Hourglass,
  UpdateButton,
} from "../../../components/Styled";
import { Store } from "react-notifications-component";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

const UpdateProfessional = ({
  setModelState,
  professionalId,
  workingHours,
}) => {
  const { t } = useTranslation();
  const { sendNotification } = useContext(NotificationContext);
  const { shopId } = useContext(SidebarContext);
  const { isDarkMode } = useContext(DarkModeContext);
  const [professionalData, setProfessionalData] = useState(null);
  const token = localStorage.getItem("ag_app_shop_token");

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

  const remove = () => {
    Store.removeNotification({});
  };

  useEffect(() => {
    instance
      .get(`professionals/${professionalId}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setProfessionalData(response.data.data);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, []);
  const validationSchema = Yup.object({
    name: Yup.string().required(t("Required")),
    officeHours: Yup.array()
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
      .test("noOverlap", t("Working hours cannot overlap"), function (value) {
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
    description: Yup.string().required(t("Required")),
  });

  const hoursOptions = [];
  for (let i = 8; i <= 17; i++) {
    const hour = i <= 12 ? i : i - 12;
    const period = i < 12 ? t("AM") : t("PM");
    hoursOptions.push(
      <option key={i} value={i}>
        {hour}:00 {period}
      </option>
    );
  }

  if (!professionalData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Hourglass />
      </div>
    );
  }

  function getCurrentLanguage() {
    return i18next.language || "en";
  }

  return (
    <div
      className={`bg-${
        isDarkMode ? "gray-800" : "white"
      } transition-all duration-300  shadow-lg rounded-md m-2`}
    >
      <Formik
        initialValues={{
          name: professionalData.name,
          officeHours: professionalData?.officeHours || [
            { startHour: 0, endHour: 0 },
          ],
          description: professionalData.description,
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          const patchData = {
            name: values.name,
            officeHours: values.officeHours,
            description: values.description,
            managerId: shopId,
          };

          const fetchRequest = async () => {
            try {
              const response = await instance.patch(
                `professionals/${professionalId}`,
                patchData,
                {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("ag_app_shop_token"),
                  },
                }
              );
              notify(
                t("Update"),
                `${t("Professional")} "${values.name}" ${t(
                  "info has been updated"
                )}`,
                "success"
              );
              sendNotification(
                `${t("Professional")} "${values.name}" ${t(
                  "info has been updated"
                )}`
              );
            } catch (e) {
              notify(
                t("Error"),
                t(`Some of the data has already been registered before`),
                "danger"
              );
            }
          };

          fetchRequest();
          setSubmitting(false);
          resetForm();
          setModelState(false);
        }}
      >
        {(formikProps) => {
          const hoursOptions = [];

          workingHours.forEach((period) => {
            let range = [];
            for (let i = period.startHour; i <= period.endHour; i++) {
              const hour = i <= 12 ? i : i - 12;
              const periodLabel = i < 12 ? t("AM") : t("PM");
              range.push(
                <option key={i} value={i}>
                  {hour}:00 {periodLabel}
                </option>
              );
            }
            hoursOptions.push(range);
          });

          return (
            <Form
              className={`bg-${
                isDarkMode ? "gray-800" : "white"
              } rounded px-8 pt-6 pb-8 mb-4`}
            >
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className={`block text-sm font-bold mb-2 text-${
                    isDarkMode ? "white" : "gray-700"
                  }`}
                >
                  {t("Name")}
                </label>
                <Field
                  type="text"
                  id="name"
                  name="name"
                  className={`${
                    isDarkMode ? DefaultInputDarkStyle : DefaultInputLightStyle
                  }`}
                />
                <ErrorMessage
                  name="name"
                  component="p"
                  className="text-red-500 text-xs italic"
                />
              </div>
              <FieldArray name="officeHours">
                {({ remove, push }) => (
                  <div className="space-y-4 mb-4">
                    <label
                      htmlFor="officeHours"
                      className={`block text-sm font-bold mb-2 text-${
                        isDarkMode ? "white" : "gray-700"
                      }`}
                    >
                      {t("Office Hours")}
                    </label>
                    {formikProps.values.officeHours.map((officeHour, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="flex items-center space-x-2 w-64">
                          <div>
                            <label
                              htmlFor={`officeHours[${index}].startHour`}
                              className="sr-only"
                            >
                              {t("Start Hour")}
                            </label>
                            <Field
                              id={`officeHours[${index}].startHour`}
                              name={`officeHours[${index}].startHour`}
                              as="select"
                              className={`block appearance-none rounded-md w-full px-3 py-2 border ${
                                formikProps.errors.officeHours?.[index]
                                  ?.startHour &&
                                formikProps.touched.officeHours?.[index]
                                  ?.startHour
                                  ? "border-red-500"
                                  : "border-gray-300"
                              } text-${isDarkMode ? "white" : "gray-700"} bg-${
                                !isDarkMode ? "white" : "gray-500"
                              }
                              } placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                            >
                              <option value="">{t("Start hour")}</option>
                              {hoursOptions[index]}
                            </Field>
                            <ErrorMessage
                              name={`officeHours[${index}].startHour`}
                              component="div"
                              className="mt-1 text-sm text-red-500"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor={`officeHours[${index}].endHour`}
                              className="sr-only"
                            >
                              {t("End Hour")}
                            </label>
                            <Field
                              id={`officeHours[${index}].endHour`}
                              name={`officeHours[${index}].endHour`}
                              as="select"
                              className={`block appearance-none rounded-md w-full px-3 py-2 border ${
                                formikProps.errors.officeHours?.[index]
                                  ?.endHour &&
                                formikProps.touched.officeHours?.[index]
                                  ?.endHour
                                  ? "border-red-500"
                                  : "border-gray-300"
                              } text-${isDarkMode ? "white" : "gray-700"} bg-${
                                !isDarkMode ? "white" : "gray-500"
                              }
                              } placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                            >
                              <option value="">{t("End hour")}</option>
                              {hoursOptions[index]}
                            </Field>
                            <ErrorMessage
                              name={`officeHours[${index}].endHour`}
                              component="div"
                              className="mt-1 text-sm text-red-500"
                            />
                          </div>
                        </div>
                        {index > 0 && (
                          <div className="flex justify-end">
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
                    ))}
                    <div className="flex justify-start">
                      {formikProps.values.officeHours.length <
                        workingHours.length && (
                        <button
                          type="button"
                          className="flex items-center px-2 py-1 text-sm text-blue-600 hover:text-blue-800"
                          onClick={() => push({ startHour: 0, endHour: 0 })}
                        >
                          <TiPlus className="mr-1" />
                          {t("Add Office Hour")}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </FieldArray>
              <div className="mb-4">
                <label
                  htmlFor="description"
                  className={`block text-sm font-bold mb-2 text-${
                    isDarkMode ? "white" : "gray-700"
                  }`}
                >
                  {t("Description")}
                </label>
                <Field
                  as="textarea"
                  id="description"
                  name="description"
                  placeholder={t("Enter a description of the professional")}
                  className={`${
                    isDarkMode ? DefaultInputDarkStyle : DefaultInputLightStyle
                  }`}
                />
                <ErrorMessage
                  name="description"
                  component="p"
                  className="text-red-500 text-xs italic"
                />
              </div>
              <div className="flex items-center justify-end mt-8">
                <UpdateButton disabled={formikProps.isSubmitting} />
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default UpdateProfessional;
