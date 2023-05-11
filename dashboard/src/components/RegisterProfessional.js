import React, { useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import SidebarContext from "../context/SidebarContext";
import axios from "axios";

const RegisterProfessional = ({ setModelState }) => {
  const { shopName } = useContext(SidebarContext);
  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    officeHours: Yup.string().required("Required"),
    description: Yup.string().required("Required"),
  });

  return (
    <>
      <h2 className="text-xl font-bold mb-4">Register a Professional</h2>
      <Formik
        initialValues={{
          name: "",
          officeHours: "",
          description: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          console.log(values);
          const postData = {
            name: values.name,
            officeHours: values.officeHours,
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
                    Authorization: localStorage.getItem("token"),
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
          <Form className="bg-white rounded px-8 pt-6 pb-8 mb-4">
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
                htmlFor="officeHours"
                className="block text-sm text-gray-700 font-bold mb-2"
              >
                Office Hours
              </label>
              <Field
                type="text"
                id="officeHours"
                name="officeHours"
                placeholder="Enter the office hours"
                className="py-2 pl-8 border-b-2 border-gray-300 text-gray-700 focus:outline-none focus:border-blue-500 w-full"
              />
              <ErrorMessage
                name="officeHours"
                component="p"
                className="text-red-500 text-xs italic"
              />
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
                className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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
