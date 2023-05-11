import React, { useEffect, useState } from "react";
import { Formik, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import ImageUpload from "../components/ImageUpload";
import axios from "axios";

const DashboardServices = () => {
  const [servicesDataArr, setServicesDataArr] = useState([]);
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
      console.log(response.data.admin.servicesData);
      setServicesDataArr(response.data.admin.servicesData);
    } catch (error) {
      console.log(error);
    }
  };
  const validationSchema = Yup.object().shape({
    servicesData: Yup.array().of(
      Yup.object().shape({
        title: Yup.string().required("Title is required"),
        image: Yup.mixed().required("Image is required"),
      })
    ),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        console.error("Token not found");
        return;
      }

      const uploadPromises = values.servicesData.map(async (service, index) => {
        const formData = new FormData();
        formData.append("image", service.image);
        servicesDataArr[index]
          ? formData.append("existingImg", servicesDataArr[index].image)
          : formData.append("existingImg", "nonExistingImg.jpeg");

        const uploadResponse = await axios.post(
          "http://localhost:4040/admin/uploads-services-imgs",
          formData,
          {
            headers: {
              Authorization: token,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        return {
          ...service,
          image: uploadResponse.data.filename,
        };
      });

      const uploadedServices = await Promise.all(uploadPromises);

      const response = await axios.patch(
        "http://localhost:4040/admin/",
        { servicesData: uploadedServices },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      alert("Data saved successfully");
      console.log(response.data); // Handle success response
      fetchAdminData(); // Call fetchAdminData to update the data after submit
    } catch (error) {
      console.log(error);
      // Handle error
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-4">Dashboard Services</h1>
      <Formik
        initialValues={{
          servicesData: Array.from({ length: 3 }, () => ({
            title: "",
            image: null,
          })),
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {(formikProps) => (
          <form onSubmit={formikProps.handleSubmit}>
            <FieldArray
              name="servicesData"
              render={(arrayHelpers) =>
                formikProps.values.servicesData.map((service, index) => (
                  <div key={index} className="mb-4">
                    <label
                      htmlFor={`title${index}`}
                      className="block font-medium mb-1"
                    >
                      Title
                    </label>
                    <input
                      type="text"
                      id={`title${index}`}
                      name={`servicesData[${index}].title`}
                      value={service.title}
                      onChange={formikProps.handleChange}
                      className="border-gray-300 border rounded-md p-2 w-full"
                    />
                    <ErrorMessage
                      name={`servicesData[${index}].title`}
                      component="div"
                      className="text-red-600"
                    />

                    <ImageUpload
                      field={{
                        name: `servicesData[${index}].image`,
                        value: service.image,
                        onChange: (file) =>
                          formikProps.setFieldValue(
                            `servicesData[${index}].image`,
                            file
                          ),
                        onBlur: formikProps.handleBlur,
                      }}
                      form={formikProps}
                    />

                    {/* {service.image && (
                      <img
                        src={URL.createObjectURL(service.image)}
                        alt={`Service Image ${index}`}
                        className="w-32 h-32 object-cover mt-2"
                      />
                    )} */}

                    {/* <button
                      type="button"
                      onClick={() => arrayHelpers.remove(index)}
                      className="text-red-600 font-medium mt-2"
                    >
                      Remove Service
                    </button> */}
                  </div>
                ))
              }
            />

            {/* <button
              type="button"
              onClick={() => formikProps.push({ title: "", image: null })}
              className="text-blue-600 font-medium mt-4"
            >
              Add Service
            </button> */}

            <button
              type="submit"
              disabled={formikProps.isSubmitting}
              className="bg-blue-600 text-white rounded-md py-2 px-4 mt-4"
            >
              Save
            </button>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default DashboardServices;
