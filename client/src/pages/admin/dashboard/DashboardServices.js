import React, { useContext, useEffect, useState } from "react";
import { Formik, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import ImageUpload from "../../../components/ImageUpload";
import { FaSpinner, FaTrash } from "react-icons/fa";
import instance from "../../../axiosConfig/axiosConfig";
import { storage } from "../../../services/firebaseStorage";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { v4 } from "uuid";
import { ServicesContext } from "../../../context/ServicesContext";

const DashboardServices = () => {
  const [servicesDataArr, setServicesDataArr] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);
  const [hiddenImages, setHiddenImages] = useState([]);
  const { servicesData } = useContext(ServicesContext);

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

      const response = await instance.get("admin", {
        headers: {
          Authorization: token,
        },
      });
      console.log(response.data.admin.servicesData);
      setServicesDataArr(response.data.admin.servicesData);
      if (response.data.admin.servicesData.length === 0) {
        let servicesDataArr = servicesData;
        servicesDataArr.map((service) => {
          delete service["_id"];
          service.image = null;
        });
        console.log(servicesDataArr);
        instance
          .patch(
            "admin/",
            { servicesData: servicesDataArr },
            {
              headers: {
                Authorization: token,
              },
            }
          )
          .then((res) => {
            console.log(res.data);
          });
      }
      setDataFetched(true);
    } catch (error) {
      console.log(error);
    }
  };
  const validationSchema = Yup.object().shape({
    servicesData: Yup.array().of(
      Yup.object().shape({
        title: Yup.string(),
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

      const uploadPromises = values.servicesData.map((service, index) => {
        if (service.image !== null) {
          return new Promise((resolve, reject) => {
            console.log("uploading ....");
            let imageName = v4(service.image.name);
            const fileRef = ref(storage, `home/services/${imageName}`);
            const uploadTask = uploadBytesResumable(fileRef, service.image);

            uploadTask.on(
              "state_changed",
              (snapshot) => {
                let progress =
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(progress);
              },
              (error) => {
                console.log("error");
                reject(error);
              },
              () => {
                console.log("success");
                getDownloadURL(uploadTask.snapshot.ref)
                  .then((downloadURL) => {
                    console.log(downloadURL);
                    resolve({ ...service, image: downloadURL });
                  })
                  .catch((err) => {
                    reject(err);
                  });
              }
            );
          });
        } else {
          console.log(servicesDataArr[index]);
          let oldService = servicesDataArr[index];
          return oldService;
        }
      });

      const servicesPatchedData = await Promise.all(uploadPromises);

      instance
        .patch(
          "admin/",
          { servicesData: servicesPatchedData },
          {
            headers: {
              Authorization: token,
            },
          }
        )
        .then((res) => {
          console.log(res.data);
          alert("Data saved successfully");
          fetchAdminData();
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  const deleteImage = (formikProps, index) => {
    try {
      const token = localStorage.getItem("ag_app_admin_token");
      if (!token) {
        console.error("Token not found");
        return;
      }
      const desertRef = ref(storage, servicesDataArr[index].image);
      let updatedServicesArr = servicesDataArr
      updatedServicesArr[index].image = null
      deleteObject(desertRef)
        .then(() => {
          updatedServicesArr[index].image = null;
          setServicesDataArr((prev) => (updatedServicesArr));
        })
        .then(() => {
          instance
            .patch(
              "admin/",
              { servicesData: updatedServicesArr },
              {
                headers: {
                  Authorization: token,
                },
              }
            )
            .then((res) => {
              console.log(res.data);
              fetchAdminData()
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-4">Reccomended Services</h1>
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

                      {servicesDataArr[index].image && (
                        <div className="relative">
                          <img
                            src={servicesDataArr[index].image}
                            alt={servicesDataArr[index].image}
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

                      {!servicesDataArr[index].image && (
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
