import React, { useContext, useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import SidebarContext from "../context/SidebarContext";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";

const UpdateProfessional = ({ setModelState, professionalId }) => {
  const [professionalData, setProfessionalData] = useState(null);
  const token = localStorage.getItem("ag_app_shop_token");
  useEffect(() => {
    axios
      .get(`http://localhost:4040/professionals/${professionalId}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        console.log(response.data.data);
        setProfessionalData(response.data.data);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, []);

  const { shopName } = useContext(SidebarContext);
  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    officeHours: Yup.string().required("Required"),
    description: Yup.string().required("Required"),
  });

  return (
    <>
      <h2 className="text-xl text-left font-bold mb-4">Update Professional</h2>
      {professionalData ? (
        <Formik
          initialValues={{
            name: professionalData.name,
            officeHours: professionalData.officeHours,
            description: professionalData.description,
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
                  `http://localhost:4040/professionals/${professionalId}`,
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
            <Form className="bg-white text-left rounded px-8 pt-6 pb-8 mb-4">
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
                  Update
                </button>
              </div>
            </Form>
          )}
        </Formik>
      ) : (
        <div className="flex items-center justify-center h-screen">
          <div className="flex flex-col justify-center items-center space-x-2">
            <FaSpinner className="animate-spin text-4xl text-blue-500" />
            <span className="mt-2">Loading...</span>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateProfessional;
