import React, { useState, useEffect } from "react";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import ImageUpload from "../components/ImageUpload";

const DashboardSection2 = () => {
  const [section2Data, setSection2Data] = useState({});

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        console.error("Token not found");
        return;
      }

      const response = await axios.get("http://localhost:4040/admin", {
        headers: {
          Authorization: token,
        },
      });
      console.log(response.data.admin.section2Data);
      setSection2Data(response.data.admin.section2Data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFormSubmit = async (values, { setSubmitting }) => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        console.error("Token not found");
        return;
      }

      const formData = new FormData();
      formData.append("image", values.image);
      formData.append("existingImg", section2Data.image);

      // Upload the image
      const uploadResponse = await axios.post(
        "http://localhost:4040/admin/uploads-section2-imgs",
        formData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Get the uploaded image name from the response
      const { filename } = uploadResponse.data;

      // Update the admin data with new values (including the image name)
      const patchData = {
        section2Data: {
          title: values.title,
          image: filename,
          content: values.content,
        },
      };

      const updateResponse = await axios.patch(
        "http://localhost:4040/admin",
        patchData,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      alert("Data saved successfully");
      console.log(updateResponse.data); // Updated admin data
      fetchAdminData(); // Call fetchAdminData to update the data after submit
    } catch (error) {
      console.log(error);
    }

    setSubmitting(false);
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-4">Dashboard Section 2</h1>
      <Formik
        initialValues={{
          title: "",
          content: "",
          image: "",
        }}
        validationSchema={Yup.object({
          title: Yup.string().required("Required"),
          content: Yup.string().required("Required"),
          image: Yup.string().required("Required"),
        })}
        onSubmit={handleFormSubmit}
      >
        {(formikProps) => (
          <form onSubmit={formikProps.handleSubmit}>
            <div className="mb-4">
              <label htmlFor={`title`} className="block font-medium mb-1">
                Title
              </label>
              <input
                type="text"
                id={`title`}
                name={`title`}
                value={formikProps.values.title}
                onChange={formikProps.handleChange}
                className="border-gray-300 border rounded-md p-2 w-full"
              />
              <ErrorMessage
                name={`title`}
                component="div"
                className="text-red-600"
              />

              <label
                htmlFor={`content`}
                className="block font-medium mb-1 mt-4"
              >
                Content
              </label>
              <textarea
                id={`content`}
                name={`content`}
                value={formikProps.values.content}
                onChange={formikProps.handleChange}
                className="border-gray-300 border rounded-md p-2 w-full"
              />
              <ErrorMessage
                name={`content`}
                component="div"
                className="text-red-600"
              />

              <Field name="image" component={ImageUpload} />
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Submit
            </button>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default DashboardSection2;
