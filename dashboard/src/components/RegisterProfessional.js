import React, { useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import SidebarContext from "../context/SidebarContext";
import axios from "axios";

const RegisterProfessional = ({ setModelState }) => {
  const { shopName } = useContext(SidebarContext);
  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    startHour: Yup.number()
      .required("Start hour is required")
      .min(8, "Start hour must be between 8 and 17")
      .max(17, "Start hour must be between 8 and 17"),
    endHour: Yup.number()
      .required("End hour is required")
      .min(8, "End hour must be between 8 and 17")
      .max(17, "End hour must be between 8 and 17")
      .test(
        "is-greater-than-start",
        "End hour must be greater than Start hour",
        function (value) {
          const startHour = this.resolve(Yup.ref("startHour"));
          return value > startHour;
        }
      ),
    description: Yup.string().required("Required"),
  });

  const hoursOptions = [];
  for (let i = 8; i <= 17; i++) {
    const hour = i <= 12 ? i : i - 12;
    const period = i < 12 ? "AM" : "PM";
    hoursOptions.push(
      <option key={i} value={i}>
        {hour}:00 {period}
      </option>
    );
  }

  return (
    <>
      <h2 className="text-xl font-bold mb-4">Register a Professional</h2>
      <Formik
        initialValues={{
          name: "",
          startHour: "",
          endHour: "",
          description: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          console.log(values);
          const postData = {
            name: values.name,
            startHour: values.startHour,
            endHour: values.endHour,
            description: values.description,
            shopName: shopName,
          };

          const fetchRequest = async () => {
            try {
              const response = await axios.post(
                "http://localhost:4040/professionals/",
                postData,
                {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("ag_app_shop_token"),
                  },
                }
              );
              console.log(response);
            } catch (e) {
              console.error(e.message);
            }
          };

          fetchRequest();
          setSubmitting(false);
          resetForm();
          setModelState(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form className="bg-white rounded px-8 pt-6 pb-8 mb-4 overflow-y-auto min-w-[350px] sm:min-w-[500px] mx-auto">
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm text-gray-700 font-bold mb-2"
              >
                Name
              </label>
              <Field
                type="text"
                id="name"
                name="name"
                placeholder="Enter the name of the professional"
                className="py-2 pl-8 border-b-2 border-gray-300 text-gray-700 focus:outline-none focus:border-blue-500 w-full"
              />
              <ErrorMessage
                name="name"
                component="p"
                className="text-red-500 text-xs italic"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="hours"
                className="block text-sm text-gray-700 font-bold mb-2"
              >
                Office Hours
              </label>
              <div className="flex">
                <div className="mr-4">
                  <label
                    htmlFor="startHour"
                    className="block text-xs text-gray-700 font-bold"
                  >
                    Start Time
                  </label>
                  <Field
                    as="select"
                    id="startHour"
                    name="startHour"
                    className="py-2 px-4 border border-gray-300 focus:outline-none focus:border-blue-500"
                  >
                    {hoursOptions}
                  </Field>
                  <ErrorMessage
                    name="startHour"
                    component="p"
                    className="text-red-500 text-xs italic"
                  />
                </div>
                <div>
                  <label
                    htmlFor="endHour"
                    className="block text-xs text-gray-700 font-bold"
                  >
                    End Time
                  </label>
                  <Field
                    as="select"
                    id="endHour"
                    name="endHour"
                    className="py-2 px-4 border border-gray-300 focus:outline-none focus:border-blue-500"
                  >
                    {hoursOptions}
                  </Field>
                  <ErrorMessage
                    name="endHour"
                    component="p"
                    className="text-red-500 text-xs italic"
                  />
                </div>
              </div>
            </div>
            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-sm text-gray-700 font-bold mb-2"
              >
                Description
              </label>
              <Field
                as="textarea"
                id="description"
                name="description"
                placeholder="Enter a description of the professional"
                className="py-2 pl-8 border-b-2 border-gray-300 text-gray-700 focus:outline-none focus:border-blue-500 w-full"
              />
              <ErrorMessage
                name="description"
                component="p"
                className="text-red-500 text-xs italic"
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-gray-800 hover:bg-gray-600 text-white text-sm font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                disabled={isSubmitting}
              >
                Register
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default RegisterProfessional;
