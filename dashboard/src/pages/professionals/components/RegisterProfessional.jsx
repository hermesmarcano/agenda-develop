import React, { useContext, useEffect, useState } from "react";
import Switch from "react-switch";
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  FieldArray,
  useFormikContext,
} from "formik";
import * as Yup from "yup";
import { SidebarContext } from "../../../context/SidebarContext";
import instance from "../../../axiosConfig/axiosConfig";
import { NotificationContext } from "../../../context/NotificationContext";
import { DarkModeContext } from "../../../context/DarkModeContext";
import {
  DefaultInputDarkStyle,
  DefaultInputLightStyle,
  Hourglass,
  RegisterButton,
} from "../../../components/Styled";
import { Store } from "react-notifications-component";
import { useTranslation } from "react-i18next";
import { FaCalendarAlt, FaCalendarCheck } from "react-icons/fa";
import {
  IoIosAddCircleOutline,
  IoIosRemoveCircleOutline,
} from "react-icons/io";

const RegisterProfessional = ({
  setModelState,
  professionalPlanCounter,
  setProfessionalPlanCounter,
}) => {
  const { t } = useTranslation();
  const { sendNotification } = useContext(NotificationContext);
  const { shopId } = useContext(SidebarContext);
  const { isDarkMode } = useContext(DarkModeContext);
  const token = localStorage.getItem("ag_app_shop_token");
  const [workingHours, setWorkingHours] = useState(null);
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  useEffect(() => {
    instance
      .get(`managers/id`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        const officeHours = {};
        if (response.data?.workingHours) {
          daysOfWeek?.map((day, i) => {
            officeHours[day] = response.data?.workingHours[day];
          });
          setWorkingHours(officeHours);
        } else {
          console.log("workingHours is undefined or empty");
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, []);

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
    description: Yup.string().required("Required"),
  });

  if (!workingHours) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Hourglass />
      </div>
    );
  }

  return (
    <div
      className={`bg-${
        isDarkMode ? "gray-800" : "white"
      } transition-all duration-300  shadow-lg rounded-md m-2`}
    >
      <Formik
        initialValues={{
          name: "",
          workingHours: workingHours,
          description: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          const postData = {
            name: values.name,
            workingHours: values.workingHours,
            description: values.description,
            managerId: shopId,
          };

          const fetchRequest = () => {
            try {
              instance
                .post("professionals/", postData, {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("ag_app_shop_token"),
                  },
                })
                .then(() => {
                  instance
                    .patch(
                      "managers/plan",
                      { professionals: professionalPlanCounter - 1 },
                      {
                        headers: {
                          "Content-Type": "application/json",
                          Authorization:
                            localStorage.getItem("ag_app_shop_token"),
                        },
                      }
                    )
                    .then((res) => {
                      console.log(res);
                      setProfessionalPlanCounter(professionalPlanCounter - 1);
                    });
                  setProfessionalPlanCounter((prev) => {
                    console.log("Current Counter: ", prev);
                    let updatedCounter = prev - 1;
                    console.log("After Counter: ", updatedCounter);
                    instance
                      .patch(
                        "managers/plan",
                        { professionals: updatedCounter },
                        {
                          headers: {
                            "Content-Type": "application/json",
                            Authorization:
                              localStorage.getItem("ag_app_shop_token"),
                          },
                        }
                      )
                      .then(() => {
                        return updatedCounter;
                      });
                  });
                  notify(
                    t("New Professional"),
                    `${t("New Professional")} "${values.name}" ${t(
                      "has registered"
                    )}`,
                    "success"
                  );
                  sendNotification(
                    `${t("New Professional")} "${values.name}" ${t(
                      "has registered"
                    )}`
                  );
                });
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
                  className={`block text-sm text-${
                    isDarkMode ? "white" : "gray-700"
                  } font-bold mb-2`}
                >
                  {t("Name")}
                </label>
                <Field
                  type="text"
                  id="name"
                  name="name"
                  placeholder={t("Professional Name")}
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
              <div className="mb-4">
                <label
                  htmlFor="workingHours"
                  className={`block text-sm text-${
                    isDarkMode ? "white" : "gray-700"
                  } font-bold mb-2`}
                >
                  {t("Working Hours")}<span className="text-xs ml-2">({t("Don't choose out of the current range")})</span>
                </label>
                <WeekDayHours workingHours={workingHours} />
                {/* <ErrorMessage
                  name="workingHours"
                  component="p"
                  className="text-red-500 text-xs italic"
                /> */}
              </div>
              <div className="mb-4">
                <label
                  htmlFor="description"
                  className={`block text-sm text-${
                    isDarkMode ? "white" : "gray-700"
                  } font-bold mb-2`}
                >
                  {t("Description")}
                </label>
                <Field
                  as="textarea"
                  id="description"
                  name="description"
                  placeholder={t("Short Description ...")}
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

              {Object.keys(validationSchema.fields).some((field) =>
          formikProps.errors[field]?.length > 0
        ) && (
          <div className="text-red-500 text-xs italic">
            {t("There are validation errors. Please fix them before submitting.")}
          </div>
        )}

              <div className="flex items-center justify-end mt-8">
                <RegisterButton />
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default RegisterProfessional;

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
