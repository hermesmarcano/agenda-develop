import React, { useState, useEffect, useContext } from "react";
import { Formik, ErrorMessage } from "formik";
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
import { Section2Context } from "../../../context/Section2Context";

const DashboardSectionTwo = () => {
  const { section2Data, setSection2Data } = useContext(Section2Context);

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
      console.log(response.data.admin.section2Data);
      setSection2Data(response.data.admin.section2Data);
      if (!response.data.admin.section2Data) {
        let section2 = section2Data;
        section2.image = null;
        console.log(section2);
        instance
          .patch(
            "admin/",
            { section2Data: section2 },
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
    } catch (error) {
      console.log(error);
    }
  };

  const handleFormSubmit = async (values, { setSubmitting }) => {
    try {
      const token = localStorage.getItem("ag_app_admin_token");
      if (!token) {
        console.error("Token not found");
        return;
      }

      if (section2Data.section2Img !== null) {
        console.log("uploading ....");
        if (values.image === null) return;
        let imageName = v4(values.image);
        const fileRef = ref(storage, `section2/${imageName}`);
        const uploadTask = uploadBytesResumable(fileRef, values.image);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            let progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(progress);
          },
          (error) => {
            console.log("error");
          },
          () => {
            console.log("success");
            let section2Img = null;
            getDownloadURL(uploadTask.snapshot.ref)
              .then((downloadURL) => {
                console.log(downloadURL);
                section2Img = downloadURL;
              })
              .then(() => {
                const patchData = {
                  section2Data: {
                    title: values.title || section2Data.title,
                    image: section2Img,
                    content: values.content || section2Data.content,
                  },
                };

                instance
                  .patch("admin", patchData, {
                    headers: {
                      Authorization: token,
                    },
                  })
                  .then((res) => {
                    console.log(res);
                    alert("Data saved successfully");
                    fetchAdminData();
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              });
          }
        );
      } else {
        const patchData = {
          section2Data: {
            title: values.title || section2Data.title,
            image: section2Data.image,
            content: values.content || section2Data.content,
          },
        };
        instance
          .patch("admin", patchData, {
            headers: {
              Authorization: token,
            },
          })
          .then((res) => {
            console.log(res);
            alert("Data saved successfully");
            fetchAdminData();
          });
      }
    } catch (error) {
      console.log(error);
    }

    setSubmitting(false);
  };

  const deleteImage = (formikProps) => {
    try {
      const token = localStorage.getItem("ag_app_admin_token");
      if (!token) {
        console.error("Token not found");
        return;
      }
      const desertRef = ref(storage, section2Data.image);
      let updatedSection2 = section2Data;
      updatedSection2.image = null;
      deleteObject(desertRef)
        .then(() => {
          updatedSection2.image = null;
          setSection2Data((prev) => updatedSection2);
        })
        .then(() => {
          instance
            .patch(
              "admin/",
              { section2Data: updatedSection2 },
              {
                headers: {
                  Authorization: token,
                },
              }
            )
            .then((res) => {
              console.log(res.data);
              fetchAdminData();
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
      <h1 className="text-3xl font-bold mb-4">Section 2</h1>
      {section2Data ? (
        <Formik
          initialValues={{
            title: section2Data.title,
            content: section2Data.content,
            image: null,
          }}
          validationSchema={Yup.object({
            title: Yup.string(),
            content: Yup.string(),
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

                {/* <Field name="image" component={ImageUpload} /> */}
                {section2Data.image && (
                  <div className="relative">
                    <img
                      src={section2Data.image}
                      alt={section2Data.image}
                      className="w-screen rounded-md max-h-40 object-cover mt-2"
                    />

                    <button
                      type="button"
                      onClick={() => deleteImage(formikProps)}
                      className="text-red-600 font-medium mt-2 absolute right-1 top-1"
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}

                {!section2Data.image && (
                  <div>
                    <ImageUpload
                      field={{
                        name: `image`,
                        value: formikProps.values.image,
                        onChange: (file) =>
                          formikProps.setFieldValue(`image`, file),
                        onBlur: formikProps.handleBlur,
                      }}
                      form={formikProps}
                    />
                  </div>
                )}
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

export default DashboardSectionTwo;
