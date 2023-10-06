import React, { useContext, useEffect, useMemo, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import instance from "../../../axiosConfig/axiosConfig";
import { FaSpinner } from "react-icons/fa";
import Switch from "react-switch";
import { SidebarContext } from "../../../context/SidebarContext";
import { DateTimeContext } from "../../../context/DateTimeContext";
import { ProfessionalIdContext } from "../../../context/ProfessionalIdContext";
import DateRangePicker from "./DateRangePicker";
import {
  DefaultInputDarkStyle,
  DefaultInputLightStyle,
  SubmitButton,
} from "../../../components/Styled";
import { DarkModeContext } from "../../../context/DarkModeContext";
import { useTranslation } from "react-i18next";

const BlockSchedule = ({ setModelState }) => {
  const { t } = useTranslation();
  const { isDarkMode } = useContext(DarkModeContext);
  const { dateTime } = useContext(DateTimeContext);
  const [blockAllDay, setBlockAllDay] = useState(true);
  const [showFrequency, setShowFrequency] = useState(false);
  const { professionalId } = useContext(ProfessionalIdContext);
  const token = localStorage.getItem("ag_app_shop_token");
  const { shopId } = useContext(SidebarContext);
  const [loading, setLoading] = React.useState(true);
  const [dateValues, setDateValues] = useState({
    startDate: null,
    startTime: null,
    endDate: null,
    endTime: null,
  });

  const handleDateChange = (values) => {
    setDateValues(values);
  };

  const memoizedBlockAllDay = useMemo(() => blockAllDay, [blockAllDay]);

  const [professionals, setProfessionals] = useState([]);
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

  const handleBlockAllDayChange = () => {
    console.log(blockAllDay);
    setBlockAllDay((prevBlockAllDay) => !prevBlockAllDay);
  };

  const handleShowFrequencyChange = () => {
    setShowFrequency(!showFrequency);
  };

  const validationSchema = Yup.object({
    professional: Yup.string().required(t("Professional is required")),
    blockingReason: Yup.string().required(t("Blocking Reason is required")),
  });

  const calculateDurationInMinutes = (dateTimeObject) => {
    const { startDate, startTime, endDate, endTime } = dateTimeObject;
    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);
    const durationInMilliseconds = endDateTime - startDateTime;
    const durationInMinutes = Math.floor(durationInMilliseconds / (1000 * 60));
    return durationInMinutes;
  };

  const handleSubmit = (values) => {
    const currentProfessionalObj = professionals.find(
      (professional) => professional._id === values.professional
    );
    const lastProfessionalWorkingHour =
      currentProfessionalObj.officeHours[
        currentProfessionalObj.officeHours.length - 1
      ].endHour;
    const allDayStartBlockingDateTime = new Date(dateTime);
    allDayStartBlockingDateTime.setMinutes(0);
    allDayStartBlockingDateTime.setSeconds(0);
    const allDayEndBlockingDateTime = new Date(allDayStartBlockingDateTime);
    allDayEndBlockingDateTime.setHours(lastProfessionalWorkingHour);
    const allDayWorkingDuration =
      allDayEndBlockingDateTime - allDayStartBlockingDateTime;
    const allDayDurationInMinutes = Math.floor(
      allDayWorkingDuration / (1000 * 60)
    );
    const hours = parseInt(dateValues.startTime?.split(":")[0]);
    const minutes = parseInt(dateValues.startTime?.split(":")[1]);
    const startDate = new Date(dateValues.startDate);
    startDate.setHours(hours);
    startDate.setMinutes(minutes);
    const duration = calculateDurationInMinutes(dateValues);
    console.log(blockAllDay);
    console.log(duration);
    if (blockAllDay) {
      if (allDayDurationInMinutes <= 0) {
        alert(
          t(
            "Day for this professional has passed!!, please select different day"
          )
        );
        return;
      }
      console.log(
        JSON.stringify(
          {
            dateTime: allDayStartBlockingDateTime,
            blockingDuration: allDayDurationInMinutes,
            professional: values.professional,
            blockingReason: values.blockingReason,
          },
          null,
          2
        )
      );
      createAppointment(
        allDayStartBlockingDateTime,
        allDayDurationInMinutes,
        values.professional,
        values.blockingReason
      );
    } else {
      console.log(
        JSON.stringify(
          {
            dateTime: startDate,
            blockingDuration: duration,
            professional: values.professional,
            blockingReason: values.blockingReason,
          },
          null,
          2
        )
      );
      createAppointment(
        startDate,
        duration,
        values.professional,
        values.blockingReason
      );
    }
  };

  const createAppointment = (
    dateTime,
    duration,
    professionalId,
    blockingReason
  ) => {
    console.log({
      professional: professionalId,
      dateTime: new Date(dateTime),
      managerId: shopId,
      blocking: true,
      blockingDuration: duration,
      duration: duration,
      blockingReason: blockingReason,
    });
    instance
      .post(
        "appointments",
        {
          professional: professionalId,
          dateTime: new Date(dateTime),
          managerId: shopId,
          blocking: true,
          blockingDuration: duration,
          duration: duration,
          blockingReason: blockingReason,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      )
      .then((response) => {
        setModelState(false);
      })
      .catch((error) => {
        console.error(error.message);
      });
    console.log({
      professional: professionalId,
      dateTime: new Date(dateTime),
      managerId: shopId,
      blocking: true,
      blockingDuration: duration,
      duration: duration,
      blockingReason: blockingReason,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="flex flex-col justify-center items-center space-x-2">
          <FaSpinner className="animate-spin text-4xl text-teal-500" />
          <span className="mt-2">{t("Loading...")}</span>
        </div>
      </div>
    );
  }

  return (
    <Formik
      initialValues={{
        professional: professionalId,
        blockAllDay: memoizedBlockAllDay,
        // repetitions: "",
        // frequency: "",
        // repeat: "",
        blockingReason: "",
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => {
        return (
          <Form className="rounded px-8 pt-6 pb-8">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <div>
                  <label
                    htmlFor="professional"
                    className={`block text-sm  font-bold mb-2`}
                  >
                    {t("Select the professional")}
                  </label>
                  <Field
                    as="select"
                    id="professional"
                    name="professional"
                    className={`${
                      isDarkMode
                        ? DefaultInputDarkStyle
                        : DefaultInputLightStyle
                    }`}
                  >
                    <option value="">{t("Select professional")}</option>
                    {professionals.map((professional) => {
                      return (
                        <option key={professional._id} value={professional._id}>
                          {professional.name}
                        </option>
                      );
                    })}
                  </Field>
                  <ErrorMessage
                    name="professional"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
                <div className="mt-3">
                  <div className="flex justify-start items-center">
                    <label
                      htmlFor="blockAllDay"
                      className={`block text-sm  font-bold`}
                    >
                      {t("Block all day")}
                    </label>
                    <Switch
                      id="blockAllDay"
                      name="blockAllDay"
                      checked={blockAllDay}
                      onChange={handleBlockAllDayChange}
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
                </div>
                {/* <div className="flex items-end mt-2 pr-3">
              <label
                //   htmlFor="startDate"
                className={`block text-sm  font-bold mr-2`}
              >
                Start
              </label>
              <div>
                <Field
                  type="date"
                  id="startDate"
                  name="startDate"
                  className={`py-2 pl-3 border-b-2 border-gray-300  focus:outline-none focus:border-blue-500`}
                />
                <ErrorMessage
                  name="startDate"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              {!blockAllDay && (
                <>
                  <div className="mx-4">
                    <Field
                      as="select"
                      id="startTimeHour"
                      name="startTimeHour"
                      className={`py-2 pl-3 border-b-2 border-gray-300  focus:outline-none focus:border-blue-500`}
                    >
                      <option value="">Hour</option>
                      {hoursArr.map((hour, index) => {
                        return (
                          <option key={index} value={hour}>
                            {hour}
                          </option>
                        );
                      })}
                    </Field>
                    <ErrorMessage
                      name="startTimeHour"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  <div>
                    <Field
                      as="select"
                      id="startTimeMinute"
                      name="startTimeMinute"
                      className={`py-2 pl-3 border-b-2 border-gray-300  focus:outline-none focus:border-blue-500`}
                    >
                      <option value="">Minute</option>
                      <option value="0">00</option>
                      <option value="15">15</option>
                      <option value="30">30</option>
                      <option value="45">45</option>
                    </Field>
                    <ErrorMessage
                      name="startTimeMinute"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                </>
              )}
            </div>
            <div className="flex items-end">
              <label
                // htmlFor="endDate"
                className={`block text-sm  font-bold mr-4`}
              >
                End
              </label>
              <div>
                <Field
                  type="date"
                  id="endDate"
                  name="endDate"
                  className={`py-2 pl-3 border-b-2 border-gray-300  focus:outline-none focus:border-blue-500`}
                />
                <ErrorMessage
                  name="endDate"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>
              {!blockAllDay && (
                <>
                  <div className="mx-4">
                    <Field
                      as="select"
                      id="endTimeHour"
                      name="endTimeHour"
                      className={`py-2 pl-3 border-b-2 border-gray-300  focus:outline-none focus:border-blue-500`}
                    >
                      <option value="">Hour</option>
                      {hoursArr.map((hour, index) => {
                        return (
                          <option key={index} value={hour}>
                            {hour}
                          </option>
                        );
                      })}
                    </Field>
                    <ErrorMessage
                      name="endTimeHour"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                  <div>
                    <Field
                      as="select"
                      id="endTimeMinute"
                      name="endTimeMinute"
                      className={`py-2 pl-3 border-b-2 border-gray-300  focus:outline-none focus:border-blue-500`}
                    >
                      <option value="">Minute</option>
                      <option value="0">00</option>
                      <option value="15">15</option>
                      <option value="30">30</option>
                      <option value="45">45</option>
                    </Field>
                    <ErrorMessage
                      name="endTimeMinute"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                </>
              )}
            </div> */}
                <div className="mt-2">
                  <DateRangePicker
                    isDisabled={blockAllDay}
                    onDateChange={handleDateChange}
                  />
                </div>
              </div>
              <div>
                {/* <div className="flex items-center my-2">
          <label
            htmlFor="repetitions"
            className={`block text-sm  font-bold`}
          >
            Repetitions
          </label>
          <div
            className="ml-2 cursor-pointer"
            onClick={handleShowFrequencyChange}
          >
            {showFrequency ? (
              <FaChevronDown className={`text-gray-600`} />
            ) : (
              <FaChevronUp className={`text-gray-600`} />
            )}
          </div>
        </div> */}
                {showFrequency && (
                  <>
                    <div>
                      <label
                        htmlFor="frequency"
                        className={`block text-sm  font-bold mb-2`}
                      >
                        {t("Frequency")}
                      </label>
                      <Field
                        as="select"
                        id="frequency"
                        name="frequency"
                        className={`py-2 pl-8 border-b-2 border-gray-300 text-gray-700 focus:outline-none focus:border-blue-500 w-64`}
                      >
                        <option value="">{t("Select frequency")}</option>
                        <option value="single">{t("Single")}</option>
                        <option value="eachDay">{t("Each Day")}</option>
                        <option value="everyWeek">{t("Every Week")}</option>
                        <option value="eachMonth">{t("Each Month")}</option>
                      </Field>
                      <ErrorMessage
                        name="frequency"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="repeat"
                        className={`block text-sm text-gray-700 font-bold mb-2`}
                      >
                        {t("Repeat")}
                      </label>
                      <Field
                        as="select"
                        id="repeat"
                        name="repeat"
                        className={`py-2 pl-8 border-b-2 border-gray-300 text-gray-700 focus:outline-none focus:border-blue-500 w-64`}
                      >
                        <option value="">{t("Select repeat")}</option>
                        {[...Array(100)].map((_, index) => (
                          <option key={index} value={index + 1}>
                            {index + 1} {t("time")}
                            {index !== 0 && "s"}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name="repeat"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="mt-3">
              <label
                htmlFor="blockingReason"
                className={`block text-sm font-bold mb-2`}
              >
                {t("Blocking Reason")}
              </label>
              <Field
                as="textarea"
                id="blockingReason"
                name="blockingReason"
                className={`${
                  isDarkMode ? DefaultInputDarkStyle : DefaultInputLightStyle
                }`}
                rows="3"
              ></Field>
              <ErrorMessage
                name="blockingReason"
                component="div"
                className="text-red-500 text-xs mt-1"
              />
            </div>
            <div className="flex mt-2 items-center justify-between">
              <SubmitButton />
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default BlockSchedule;
