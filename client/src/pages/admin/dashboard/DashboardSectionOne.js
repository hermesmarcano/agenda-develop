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
import { Section1Context } from "../../../context/Section1Context";
import { LoadingSaveButton } from "../../../components/Styled";
import { Store } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import { useTranslation } from "react-i18next";

const DashboardSectionOne = () => {
  const { t } = useTranslation();
  const { section1Data, setSection1Data } = useContext(Section1Context);
  const [loading, setLoading] = useState(false);

  const notify = (title, message, type) => {
    const notification = {
      title: title,
      message: message,
      type: type,
      insert: "top",
      container: "bottom-center",
      animationIn: ["animated", "fadeIn"],
      animationOut: ["animated", "fadeOut"],
      dismiss: {
        duration: 5000,
        onScreen: true,
      },
    };
    Store.addNotification(notification);
  };
  
  const remove = () => {
    Store.removeNotification();
  };
  

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
      setSection1Data(response.data.admin.section1Data);
      if (!response.data.admin.section1Data) {
        let section1 = section1Data;
        section1.image = null;
        console.log(section1);
        instance
          .patch(
            "admin/",
            { section1Data: section1 },
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
    setLoading(true);
    try {
      console.log("submitting");
      const token = localStorage.getItem("ag_app_admin_token");
      if (!token) {
        console.error("Token not found");
        return;
      }

      if (section1Data.section1Img !== null) {
        console.log("uploading ....");
        if (values.image === null) return;
        let imageName = v4(values.image);
        const fileRef = ref(storage, `section1/${imageName}`);
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
            let section1Img = null;
            getDownloadURL(uploadTask.snapshot.ref)
              .then((downloadURL) => {
                console.log(downloadURL);
                section1Img = downloadURL;
              })
              .then(() => {
                const patchData = {
                  section1Data: {
                    title: values.title || section1Data.title,
                    image: section1Img,
                    content: values.content || section1Data.content,
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
                    setLoading(false);
                    notify(
                      "Update",
                      t("Section 1")` Data saved successfully`,
                      "success"
                    );
                    fetchAdminData();
                  })
                  .catch((error) => {
                    notify("Error", `${error.message}`, "danger");
                  });
              });
          }
        );
      } else {
        const patchData = {
          section1Data: {
            title: values.title || section1Data.title,
            image: section1Data.image,
            content: values.content || section1Data.content,
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
            setLoading(false);
            notify(
              "Update",
              t("Section 1")` Data saved successfully`,
              "success"
            );
            fetchAdminData();
          });
      }
    } catch (error) {
      notify("Error", `${error.message}`, "danger");
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
      const desertRef = ref(storage, section1Data.image);
      let updatedSection1 = section1Data;
      updatedSection1.image = null;
      deleteObject(desertRef)
        .then(() => {
          updatedSection1.image = null;
          setSection1Data((prev) => updatedSection1);
        })
        .then(() => {
          instance
            .patch(
              "admin/",
              { section1Data: updatedSection1 },
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
      <h1 className="text-3xl font-bold mb-4">Section 1</h1>
      {section1Data ? (
        <Formik
          initialValues={{
            title: section1Data.title,
            content: section1Data.content,
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

                {section1Data.image && (
                  <div className="relative">
                    <img
                      src={section1Data.image}
                      alt={section1Data.image}
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

                {!section1Data.image && (
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

              {/* <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Submit
              </button> */}
              <LoadingSaveButton
                disabled={formikProps.isSubmitting}
                isSaving={loading}
              />
            </form>
          )}
        </Formik>
      ) : (
        <div className="flex items-center justify-center h-screen">
          <div className="flex flex-col justify-center items-center space-x-2">
            <FaSpinner className="animate-spin text-4xl text-blue-500" />
            <span className="mt-2">{t('Loading...')}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardSectionOne;
