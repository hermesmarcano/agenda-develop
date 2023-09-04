import React, { useState, useEffect, useContext } from "react";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import ImageUpload from "../../../components/ImageUpload";
import { FaSpinner, FaTrash } from "react-icons/fa";
import instance from "../../../axiosConfig/axiosConfig";
import { storage } from "../../../services/fireBaseStorage";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { v4 } from "uuid";
import { LogoContext } from "../../../context/LogoContext";
import { WebsiteTitleContext } from "../../../context/WebsiteTitleContext";

const DashboardSettings = () => {
  const [username, setUsername] = useState("");
  const { websiteTitle, setWebsiteTitle } = useContext(WebsiteTitleContext);
  const { logo, setLogo } = useContext(LogoContext);
  const [ isFetched, setIsFetched ] = useState(false);
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

      const response = await instance.get("admin/id", {
        headers: {
          Authorization: token,
        },
      });
      console.log(response.data.admin);
      setUsername(response.data.admin.username);
      setWebsiteTitle(response.data.admin.websiteTitle);
      setLogo(response.data.admin.logo)
      setIsFetched(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFormSubmit = async (values, { setSubmitting }) => {
    try {
      console.log("submitting");
      const token = localStorage.getItem("ag_app_admin_token");
      if (!token) {
        console.error("Token not found");
        return;
      }

      if (logo !== null) {
        console.log("uploading ....");
        if (values.logo === null) return;
        let imageName = v4(values.logo);
        const fileRef = ref(storage, `logo/${imageName}`);
        const uploadTask = uploadBytesResumable(fileRef, values.logo);

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
            let logoImg = null;
            getDownloadURL(uploadTask.snapshot.ref)
              .then((downloadURL) => {
                console.log(downloadURL);
                logoImg = downloadURL;
              })
              .then(() => {
                const patchData = {
                  username: values.title || username,
                  websiteTitle: values.websiteTitle || websiteTitle,
                  logo: logoImg,
                };

                if (values.password) {
                  patchData.password = values.password;
                }

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
          username: values.title || username,
          websiteTitle: values.websiteTitle || websiteTitle,
          logo: logo,
        };

        if (values.password) {
          patchData.password = values.password;
        }

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
      const desertRef = ref(storage, logo);
      let updatedLogo = logo;
      updatedLogo = null;
      deleteObject(desertRef)
        .then(() => {
          updatedLogo = null;
          setLogo((prev) => updatedLogo);
        })
        .then(() => {
          instance
            .patch(
              "admin/",
              { logo: updatedLogo },
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
      <h1 className="text-3xl font-bold mb-4">Settings</h1>
      {isFetched ? (
        <Formik
          initialValues={{
            username: username,
            websiteTitle: websiteTitle,
            password: "",
            logo: null,
          }}
          validationSchema={Yup.object({
            username: Yup.string(),
            websiteTitle: Yup.string(),
            password: Yup.string(),
          })}
          onSubmit={handleFormSubmit}
        >
          {(formikProps) => (
            <form onSubmit={formikProps.handleSubmit}>
              <div className="mb-4">
                <label htmlFor={`username`} className="block font-medium mb-1">
                  Username
                </label>
                <input
                  type="text"
                  id={`username`}
                  name={`username`}
                  value={formikProps.values.username}
                  onChange={formikProps.handleChange}
                  className="border-gray-300 border rounded-md p-2 w-full"
                />
                <ErrorMessage
                  name={`username`}
                  component="div"
                  className="text-red-600"
                />

                <label
                  htmlFor={`password`}
                  className="block font-medium mb-1 mt-4"
                >
                  Password
                </label>
                <input
                  type="password"
                  id={`password`}
                  name={`password`}
                  placeholder="Enter a new password"
                  value={formikProps.values.password}
                  onChange={formikProps.handleChange}
                  className="border-gray-300 border rounded-md p-2 w-full"
                />
                <ErrorMessage
                  name={`password`}
                  component="div"
                  className="text-red-600"
                />

                <label
                  htmlFor={`websiteTitle`}
                  className="block font-medium mb-1 mt-4"
                >
                  Website Title
                </label>
                <input
                  type="websiteTitle"
                  id={`websiteTitle`}
                  name={`websiteTitle`}
                  value={formikProps.values.websiteTitle}
                  onChange={formikProps.handleChange}
                  className="border-gray-300 border rounded-md p-2 w-full"
                />
                <ErrorMessage
                  name={`websiteTitle`}
                  component="div"
                  className="text-red-600"
                />

                <label
                  htmlFor={`websiteTitle`}
                  className="block font-medium mb-1 mt-4"
                >
                  Logo
                </label>

                {logo && (
                  <div className="relative h-40 border-2 border-dashed rounded-md flex items center justify-center">
                    <img
                      src={logo}
                      alt={logo}
                      className="rounded-md h-[100%]"
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

                {!logo && (
                  <div>
                    <ImageUpload
                      field={{
                        name: `logo`,
                        value: formikProps.values.logo,
                        onChange: (file) =>
                          formikProps.setFieldValue(`logo`, file),
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

export default DashboardSettings;
