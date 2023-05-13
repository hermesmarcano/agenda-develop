import React, { useEffect, useState } from "react";
import { Formik, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import ImageUpload from "../components/ImageUpload";

const DashboardArticles = () => {
  const [articlesDataArr, setArticlesDataArr] = useState([]);

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
      console.log(response.data.admin.articlesData);
      setArticlesDataArr(response.data.admin.articlesData);
    } catch (error) {
      console.log(error);
    }
  };

  const validationSchema = Yup.object().shape({
    articlesData: Yup.array().of(
      Yup.object().shape({
        title: Yup.string().required("Title is required"),
        author: Yup.string().required("Author is required"),
        date: Yup.string().required("Date is required"),
        content: Yup.string().required("Content is required"),
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

      const uploadPromises = values.articlesData.map(async (article, index) => {
        const formData = new FormData();
        formData.append("image", article.image);
        articlesDataArr[index]
          ? formData.append("existingImg", articlesDataArr[index].image)
          : formData.append("existingImg", "nonExistingImg.jpeg");

        const uploadResponse = await axios.post(
          "http://localhost:4040/admin/uploads-articles-Imgs",
          formData,
          {
            headers: {
              Authorization: token,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        return {
          ...article,
          image: uploadResponse.data.filename,
        };
      });

      const uploadedArticles = await Promise.all(uploadPromises);

      const response = await axios.patch(
        "http://localhost:4040/admin/",
        { articlesData: uploadedArticles },
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
      <h1 className="text-3xl font-bold mb-4">Dashboard Articles</h1>
      <Formik
        initialValues={{
          articlesData: Array.from({ length: 4 }, () => ({
            title: "",
            author: "",
            date: "",
            content: "",
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
                      Title
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
                      Author
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
                      Date
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
                      Content
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

                    <ImageUpload
                      field={{
                        name: `articlesData[${index}].image`,
                        value: article.image,
                        onChange: formikProps.handleChange,
                        onBlur: formikProps.handleBlur,
                      }}
                      form={formikProps}
                    />
                  </div>
                ))
              }
            />

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
              disabled={formikProps.isSubmitting}
            >
              Save
            </button>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default DashboardArticles;
