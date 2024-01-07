import React, { useContext, useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray, useFormikContext } from "formik";
import * as Yup from "yup";
import { SidebarContext } from "../../../context/SidebarContext";
import { FaCalendarAlt, FaCalendarCheck, FaSpinner } from "react-icons/fa";
import Switch from "react-switch";
import {
  IoIosAddCircleOutline,
  IoIosRemoveCircleOutline,
} from "react-icons/io";
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
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

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
          workingHours: professionalData.workingHours,
          description: professionalData.description,
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          const patchData = {
            name: values.name,
            workingHours: values.workingHours,
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
              <label
                  htmlFor="workingHours"
                  className={`block text-sm text-${
                    isDarkMode ? "white" : "gray-700"
                  } font-bold mb-2`}
                >
                  {t("Working Hours")}<span className="text-xs ml-2">({t("Don't choose out of the current range")})</span>
                </label>
                <WeekDayHours workingHours={formikProps?.values?.workingHours} />
                {/* <ErrorMessage
                  name="workingHours"
                  component="p"
                  className="text-red-500 text-xs italic"
                /> */}
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
      {days.map((day) => {
        if (workingHours[day]?.length > 0) {
          return (
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
          );
        }
      })}
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