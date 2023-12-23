import React, { useState, useEffect } from "react";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaSpinner } from "react-icons/fa";
import instance from "../../../axiosConfig/axiosConfig";
import { LoadingSaveButton } from "../../../components/Styled";
import {
  NotificationContainer,
  NotificationManager,
} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { useTranslation } from "react-i18next";

const DashboardSettings = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [isFetched, setIsFetched] = useState(false);
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

      const response = await instance.get("admin/id", {
        headers: {
          Authorization: token,
        },
      });
      console.log(response.data.admin);
      setUsername(response.data.admin.username);
      setIsFetched(true);
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

        const patchData = {
          username: values.title || username,
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
            setLoading(false);
                    createNotification(
                      "Update",
                      t("Shops")+" "+t('data saved successfully'),
                      "success"
                    );
            fetchAdminData();
          });
    } catch (error) {
      createNotification("Error", `${error.message}`, "error");
    }

    setSubmitting(false);
  };

  return (
    <>
    <NotificationContainer/>
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-4">{t('Settings')}</h1>
      {isFetched ? (
        <Formik
          initialValues={{
            username: username,
            password: "",
          }}
          validationSchema={Yup.object({
            username: Yup.string(),
            password: Yup.string(),
          })}
          onSubmit={handleFormSubmit}
        >
          {(formikProps) => (
            <form onSubmit={formikProps.handleSubmit}>
              <div className="mb-4">
                <label htmlFor={`username`} className="block font-medium mb-1">
                  {t('Username')}
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
                  {t('Password')}
                </label>
                <input
                  type="password"
                  id={`password`}
                  name={`password`}
                  placeholder={t("Enter a new password")}
                  value={formikProps.values.password}
                  onChange={formikProps.handleChange}
                  className="border-gray-300 border rounded-md p-2 w-full"
                />
                <ErrorMessage
                  name={`password`}
                  component="div"
                  className="text-red-600"
                />

              </div>

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

export default DashboardSettings;
