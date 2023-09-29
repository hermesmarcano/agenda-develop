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
import { ArticlesContext } from "../../../context/ArticlesContext";
import {
  NotificationContainer,
  NotificationManager,
} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { LoadingSaveButton } from "../../../components/Styled";
import { useTranslation } from "react-i18next";

const DashboardArticles = () => {
  const { t } = useTranslation();
  const [articlesDataArr, setArticlesDataArr] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);
  const { articlesData } = useContext(ArticlesContext);
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
      setArticlesDataArr((prev) => response.data.admin.articlesData);
      if (response.data.admin.articlesData.length === 0) {
        let articlesDataArr = articlesData;
        articlesDataArr.map((article) => {
          delete article["_id"];
          article.image = null;
        });
        console.log(articlesDataArr);
        instance
          .patch(
            "admin/",
            { articlesData: articlesDataArr },
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
    articlesData: Yup.array().of(
      Yup.object().shape({
        title: Yup.string(),
        author: Yup.string(),
        date: Yup.string(),
        content: Yup.string(),
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

      const uploadPromises = values.articlesData.map((article, index) => {
        if (article.image !== null) {
          return new Promise((resolve, reject) => {
            console.log("uploading ....");
            let imageName = v4(article.image.name);
            const fileRef = ref(storage, `home/articles/${imageName}`);
            const uploadTask = uploadBytesResumable(fileRef, article.image);

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
                    resolve({ ...article, image: downloadURL });
                  })
                  .catch((err) => {
                    reject(err);
                  });
              }
            );
          });
        } else {
          console.log(articlesDataArr[index]);
          let oldArticle = articlesDataArr[index];
          return oldArticle;
        }
      });

      const articlesPatchedData = await Promise.all(uploadPromises);

      instance
        .patch(
          "admin/",
          { articlesData: articlesPatchedData },
          {
            headers: {
              Authorization: token,
            },
          }
        )
        .then((res) => {
          console.log(res.data);
          createNotification("Update", t("Articles")+" "+t('data saved successfully'), "success");
          setLoading(false);
        })
        .catch((err) => {
          createNotification("Error", `${err.message}`, "error");
          fetchAdminData();
        });
    } catch (error) {
      createNotification("Error", `${error.message}`, "error");
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
      const desertRef = ref(storage, articlesDataArr[index].image);
      let updatedArticlesArr = articlesDataArr;
      updatedArticlesArr[index].image = null;
      deleteObject(desertRef)
        .then(() => {
          updatedArticlesArr[index].image = null;
          setArticlesDataArr((prev) => updatedArticlesArr);
        })
        .then(() => {
          instance
            .patch(
              "admin/",
              { articlesData: updatedArticlesArr },
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
    <>
    <NotificationContainer/>
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-4">{t('Articles')}</h1>
      {dataFetched ? (
        <Formik
          initialValues={{
            articlesData: articlesDataArr.map((article) => ({
              title: article.title,
              author: article.author,
              date: article.date,
              content: article.content,
              image: null,
            })),
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {(formikProps) => (
            <form onSubmit={formikProps.handleSubmit}>
              <FieldArray
                name="articlesData"
                render={(arrayHelpers) =>
                  formikProps.values.articlesData.map((article, index) => (
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
                        name={`articlesData[${index}].title`}
                        value={article.title}
                        onChange={formikProps.handleChange}
                        className="border-gray-300 border rounded-md p-2 w-full"
                      />
                      <ErrorMessage
                        name={`articlesData[${index}].title`}
                        component="div"
                        className="text-red-600"
                      />

                      <label
                        htmlFor={`author${index}`}
                        className="block font-medium mb-1 mt-4"
                      >
                        {t('Author')}
                      </label>
                      <input
                        type="text"
                        id={`author${index}`}
                        name={`articlesData[${index}].author`}
                        value={article.author}
                        onChange={formikProps.handleChange}
                        className="border-gray-300 border rounded-md p-2 w-full"
                      />
                      <ErrorMessage
                        name={`articlesData[${index}].author`}
                        component="div"
                        className="text-red-600"
                      />

                      <label
                        htmlFor={`date${index}`}
                        className="block font-medium mb-1 mt-4"
                      >
                        {t('Date')}
                      </label>
                      <input
                        type="text"
                        id={`date${index}`}
                        name={`articlesData[${index}].date`}
                        value={article.date}
                        onChange={formikProps.handleChange}
                        className="border-gray-300 border rounded-md p-2 w-full"
                      />
                      <ErrorMessage
                        name={`articlesData[${index}].date`}
                        component="div"
                        className="text-red-600"
                      />

                      <label
                        htmlFor={`content${index}`}
                        className="block font-medium mb-1 mt-4"
                      >
                        {t('Content')}
                      </label>
                      <textarea
                        id={`content${index}`}
                        name={`articlesData[${index}].content`}
                        value={article.content}
                        onChange={formikProps.handleChange}
                        className="border-gray-300 border rounded-md p-2 w-full"
                      />
                      <ErrorMessage
                        name={`articlesData[${index}].content`}
                        component="div"
                        className="text-red-600"
                      />

                      {articlesDataArr[index].image && (
                        <div className="relative">
                          <img
                            src={articlesDataArr[index].image}
                            alt={`${t('Service')} ${index}`}
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

                      {!articlesDataArr[index].image && (
                        <div>
                          <ImageUpload
                            field={{
                              name: `articlesData[${index}].image`,
                              value: article.image,
                              onChange: (file) =>
                                formikProps.setFieldValue(
                                  `articlesData[${index}].image`,
                                  file
                                ),
                              onBlur: formikProps.handleBlur,
                            }}
                            form={formikProps}
                          />
                        </div>
                      )}

                      <hr className="my-1" />
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

export default DashboardArticles;
