import React, { useContext, useEffect, useMemo, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import DateTimeContext from "../context/DateTimeContext";
import axios from "axios";
import SidebarContext from "../context/SidebarContext";
import { FaCheck, FaChevronDown, FaChevronUp, FaSpinner } from "react-icons/fa";
import Switch from "react-switch";

const BlockSchedule = () => {
  const [blockAllDay, setBlockAllDay] = useState(false);
  const [showFrequency, setShowFrequency] = useState(false);
  const { dateTime } = useContext(DateTimeContext);
  const token = localStorage.getItem("ag_app_shop_token");
  const { shopName } = useContext(SidebarContext);
  const [loading, setLoading] = React.useState(true);

  const [professionals, setProfessionals] = useState([]);
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
        console.log(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const hoursArr = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

  const handleBlockAllDayChange = () => {
    setBlockAllDay(!blockAllDay);
  };

  const handleShowFrequencyChange = () => {
    setShowFrequency(!showFrequency);
  };

  const initialValues = {
    professional: "",
    blockAllDay: blockAllDay,
    startDate: "",
    startTimeHour: "",
    startTimeMinute: "",
    endDate: "",
    endTimeHour: "",
    endTimeMinute: "",
    repetitions: "",
    frequency: "",
    repeat: "",
    blockingReason: "",
  };

  const validationSchema = Yup.object({
    professional: Yup.string().required("Professional is required"),
    startDate: Yup.date().required("Start Date is required"),
    startTimeHour: Yup.string(),
    startTimeMinute: Yup.string(),
    endDate: Yup.date().required("End Date is required"),
    endTimeHour: Yup.string(),
    endTimeMinute: Yup.string(),
    blockingReason: Yup.string().required("Blocking Reason is required"),
  });

  const handleSubmit = (values) => {
    // Handle form submission
    console.log(values);
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
    <Formik
      initialValues={{
        professional: "",
        blockAllDay: blockAllDay,
        startDate: "",
        startTimeHour: new Date(),
        startTimeMinute: "",
        endDate: new Date(),
        endTimeHour: "",
        endTimeMinute: "",
        repetitions: "",
        frequency: "",
        repeat: "",
        blockingReason: "",
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form className="bg-white rounded px-8 pt-6 pb-8">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <div>
              <label
                htmlFor="professional"
                className="block text-sm text-gray-700 font-bold mb-2"
              >
                Select the professional
              </label>
              <Field
                as="select"
                id="professional"
                name="professional"
                className="py-2 pl-8 border-b-2 border-gray-300 text-gray-700 focus:outline-none focus:border-blue-500 w-64"
              >
                <option value="">Select professional</option>
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
                  className="block text-sm text-gray-700 font-bold"
                >
                  Block all day
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
            <div className="flex items-end mt-2 pr-3">
              <label
                //   htmlFor="startDate"
                className="block text-sm text-gray-700 font-bold mr-2"
              >
                Start
              </label>
              <div>
                <Field
                  type="date"
                  id="startDate"
                  name="startDate"
                  className="py-2 pl-3 border-b-2 border-gray-300 text-gray-700 focus:outline-none focus:border-blue-500"
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
                      className="py-2 pl-3 border-b-2 border-gray-300 text-gray-700 focus:outline-none focus:border-blue-500"
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
                      className="py-2 pl-3 border-b-2 border-gray-300 text-gray-700 focus:outline-none focus:border-blue-500"
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
                className="block text-sm text-gray-700 font-bold mr-4"
              >
                End
              </label>
              <div>
                <Field
                  type="date"
                  id="endDate"
                  name="endDate"
                  className="py-2 pl-3 border-b-2 border-gray-300 text-gray-700 focus:outline-none focus:border-blue-500"
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
                      className="py-2 pl-3 border-b-2 border-gray-300 text-gray-700 focus:outline-none focus:border-blue-500"
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
                      className="py-2 pl-3 border-b-2 border-gray-300 text-gray-700 focus:outline-none focus:border-blue-500"
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
            </div>
          </div>
          <div>
            <div className="flex items-center">
              <label
                htmlFor="repetitions"
                className="block text-sm text-gray-700 font-bold"
              >
                Repetitions
              </label>
              <div
                className="ml-2 cursor-pointer"
                onClick={handleShowFrequencyChange}
              >
                {showFrequency ? (
                  <FaChevronDown className="text-gray-600" />
                ) : (
                  <FaChevronUp className="text-gray-600" />
                )}
              </div>
            </div>
            {showFrequency && (
              <>
                <div>
                  <label
                    htmlFor="frequency"
                    className="block text-sm text-gray-700 font-bold mb-2"
                  >
                    Frequency
                  </label>
                  <Field
                    as="select"
                    id="frequency"
                    name="frequency"
                    className="py-2 pl-8 border-b-2 border-gray-300 text-gray-700 focus:outline-none focus:border-blue-500 w-64"
                  >
                    <option value="">Select frequency</option>
                    <option value="single">Single</option>
                    <option value="eachDay">Each Day</option>
                    <option value="everyWeek">Every Week</option>
                    <option value="eachMonth">Each Month</option>
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
                    className="block text-sm text-gray-700 font-bold mb-2"
                  >
                    Repeat
                  </label>
                  <Field
                    as="select"
                    id="repeat"
                    name="repeat"
                    className="py-2 pl-8 border-b-2 border-gray-300 text-gray-700 focus:outline-none focus:border-blue-500 w-64"
                  >
                    <option value="">Select repeat</option>
                    {[...Array(100)].map((_, index) => (
                      <option key={index} value={index + 1}>
                        {index + 1} time{index !== 0 && "s"}
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
            className="block text-sm text-gray-700 font-bold mb-2"
          >
            Blocking Reason
          </label>
          <Field
            as="textarea"
            id="blockingReason"
            name="blockingReason"
            className="py-2 px-4 border border-gray-300 text-gray-700 focus:outline-none focus:border-blue-500 resize-none w-full"
            rows="3"
          ></Field>
          <ErrorMessage
            name="blockingReason"
            component="div"
            className="text-red-500 text-xs mt-1"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-gray-800 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Submit
          </button>
        </div>
      </Form>
    </Formik>
  );
};

export default BlockSchedule;
