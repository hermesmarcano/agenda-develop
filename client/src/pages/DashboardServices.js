import React, { useEffect, useState } from "react";
import { Formik, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import ImageUpload from "../components/ImageUpload";
import axios from "axios";
import { FaSpinner, FaTrash } from "react-icons/fa";

const DashboardServices = () => {
  const [servicesDataArr, setServicesDataArr] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);
  const [hiddenImages, setHiddenImages] = useState([]);
  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem("ag_app_admin_token");
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
      setDataFetched(true);
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
      const token = localStorage.getItem("ag_app_admin_token");
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

  const deleteImage = (formikProps, index) => {
    formikProps.setFieldValue(`servicesData[${index}].image`, null);
    setHiddenImages((prevHiddenImages) => [...prevHiddenImages, index]);
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-4">Dashboard Services</h1>
      {dataFetched ? (
        <Formik
          initialValues={{
            servicesData: servicesDataArr.map((service) => ({
              title: service.title,
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

                      <label
                        htmlFor={`image${index}`}
                        className="block font-medium mb-1"
                      >
                        Image
                      </label>

                      {!hiddenImages.includes(index) && (
                        <div className="relative">
                          <img
                            src={`http://localhost:4040/uploads/admin/${servicesDataArr[index].image}`}
                            alt={`${servicesDataArr[index].image}`}
                            className="w-screen rounded-md max-h-40 object-cover mt-2"
                          />
                          <button
                            type="button"
                            onClick={() => deleteImage(formikProps, index)}
                            className="text-red-600 font-medium mt-2 absolute right-1 top-1"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      )}

                      {hiddenImages.includes(index) &&
                        servicesDataArr[index].image && (
                          <div>
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
                          </div>
                        )}
                    </div>
                  ))
                }
              />

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
      ) : (
        <div className="flex items-center justify-center h-screen">
          <div className="flex flex-col justify-center items-center space-x-2">
            <FaSpinner className="animate-spin text-4xl text-blue-500" />
            <span className="mt-2">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardServices;
