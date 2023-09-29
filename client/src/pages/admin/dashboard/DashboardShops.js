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
import { ShopsContext } from "../../../context/ShopsContext";
import { LoadingSaveButton } from "../../../components/Styled";
import {
  NotificationContainer,
  NotificationManager,
} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { useTranslation } from "react-i18next";

const DashboardShops = () => {
  const { t } = useTranslation();
  const [shopsDataArr, setShopsDataArr] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);
  const [hiddenImages, setHiddenImages] = useState([]);
  const { shopsData } = useContext(ShopsContext);
  const [loading, setLoading] = useState(false);

  const createNotification = (title, message, type) => {
    switch (type) {
      case 'success':
        NotificationManager.success(message, title);
        break;
      case 'error':
        NotificationManager.error(message, title, 5000, () => {
          alert('callback');
        });
        break;
      default:
        break;
    }
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
      console.log(response.data.admin);
      setShopsDataArr(response.data.admin.shopsData);
      if (response.data.admin.shopsData.length === 0) {
        let shopsDataArr = shopsData;
        shopsDataArr.map((shop) => {
          delete shop["_id"];
          shop.image = null;
        });
        console.log(shopsDataArr);
        instance
          .patch(
            "admin/",
            { shopsData: shopsDataArr },
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
    shopsData: Yup.array().of(
      Yup.object().shape({
        title: Yup.string(),
        urlSlug: Yup.string(),
      })
    ),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("ag_app_admin_token");
      if (!token) {
        console.error("Token not found");
        return;
      }


      const uploadPromises = values.shopsData.map((shop, index) => {
        if (shop.image !== null) {
          return new Promise((resolve, reject) => {
            console.log("uploading ....");
            let imageName = v4(shop.image.name);
            const fileRef = ref(storage, `home/shops/${imageName}`);
            const uploadTask = uploadBytesResumable(fileRef, shop.image);

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
                    resolve({ ...shop, image: downloadURL });
                  })
                  .catch((err) => {
                    reject(err);
                  });
              }
            );
          });
        } else {
          console.log(shopsDataArr[index]);
          let oldShop = shopsDataArr[index];
          return oldShop;
        }
      });

      const shopsPatchedData = await Promise.all(uploadPromises);

      instance
        .patch(
          "admin/",
          { shopsData: shopsPatchedData },
          {
            headers: {
              Authorization: token,
            },
          }
        )
        .then((res) => {
          console.log(res.data);
          setLoading(false);
          createNotification("Update", t("Shops")+" "+t('data saved successfully'), "success");
          fetchAdminData();
        })
        .catch((err) => {
          createNotification("Error", `${err.message}`, "error");
        });
    } catch (error) {
      console.log(error);
      // Handle error
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
      const desertRef = ref(storage, shopsDataArr[index].image);
      let updatedShopsArr = shopsDataArr
      updatedShopsArr[index].image = null
      deleteObject(desertRef)
        .then(() => {
          updatedShopsArr[index].image = null;
          setShopsDataArr((prev) => (updatedShopsArr));
        })
        .then(() => {
          instance
            .patch(
              "admin/",
              { shopsData: updatedShopsArr },
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
    <>
    <NotificationContainer/>
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-4">{t('Reccomended Shops')}</h1>
      {dataFetched ? (
        <Formik
          initialValues={{
            shopsData: shopsDataArr.map((shop) => ({
              title: shop.title,
              image: null,
              urlSlug: shop.urlSlug,
            })),
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {(formikProps) => (
            <form onSubmit={formikProps.handleSubmit}>
              <FieldArray
                name="shopsData"
                render={(arrayHelpers) =>
                  formikProps.values.shopsData.map((shop, index) => (
                    <div key={index} className="mb-4">
                      <label
                        htmlFor={`title${index}`}
                        className="block font-medium mb-1"
                      >
                        {t('Title')}
                      </label>
                      <input
                        type="text"
                        id={`title${index}`}
                        name={`shopsData[${index}].title`}
                        value={shop.title}
                        onChange={formikProps.handleChange}
                        onBlur={formikProps.handleBlur}
                        className="border-gray-300 border rounded-md p-2 w-full"
                      />
                      <ErrorMessage
                        name={`shopsData[${index}].title`}
                        component="div"
                        className="text-red-600"
                      />

                      <label
                        htmlFor={`image${index}`}
                        className="block font-medium mb-1 mt-4"
                      >
                        {t('Image')}
                      </label>
                      {/* <ImageUpload
                        field={{
                          name: `shopsData[${index}].image`,
                          value: shop.image,
                          onChange: formikProps.handleChange,
                          onBlur: formikProps.handleBlur,
                        }}
                        form={formikProps}
                      /> */}
                      {shopsDataArr[index].image && (
                        <div className="relative">
                          <img
                            src={shopsDataArr[index].image}
                            alt={`${t('Shop')} ${index}`}
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

                      {!shopsDataArr[index].image && (
                        <div>
                          <ImageUpload
                            field={{
                              name: `shopsData[${index}].image`,
                              value: shop.image,
                              onChange: (file) =>
                                formikProps.setFieldValue(
                                  `shopsData[${index}].image`,
                                  file
                                ),
                              onBlur: formikProps.handleBlur,
                            }}
                            form={formikProps}
                          />
                        </div>
                      )}

                      <label
                        htmlFor={`urlSlug${index}`}
                        className="block font-medium mb-1 mt-4"
                      >
                        {t('URL Slug')}
                      </label>
                      <input
                        type="text"
                        id={`urlSlug${index}`}
                        name={`shopsData[${index}].urlSlug`}
                        value={shop.urlSlug}
                        onChange={formikProps.handleChange}
                        onBlur={formikProps.handleBlur}
                        className="border-gray-300 border rounded-md p-2 w-full"
                      />
                      <ErrorMessage
                        name={`shopsData[${index}].urlSlug`}
                        component="div"
                        className="text-red-600"
                      />
                    </div>
                  ))
                }
              />

              {/* <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
                disabled={formikProps.isSubmitting}
              >
                Save
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
    </>
  );
};

export default DashboardShops;
