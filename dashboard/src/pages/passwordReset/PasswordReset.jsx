import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { RiLockPasswordLine } from "react-icons/ri";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaSpinner } from "react-icons/fa";
import instance from "../../axiosConfig/axiosConfig";
import { useTranslation } from "react-i18next";

const PasswordReset = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { token } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [waiting, setWaiting] = useState(false);

  const handleFormSubmit = async (values) => {
    setIsSubmitting(true);
    setWaiting(true);
    try {
      const response = await instance.post("password/reset-password", {
        token,
        newPassword: values.newPassword,
      });

      setIsSubmitting(false);
      setWaiting(false);
      navigate("/login");
    } catch (error) {
      setIsSubmitting(false);
      console.error(error);
    }
  };

  const validationSchema = Yup.object().shape({
    newPassword: Yup.string().required(t("New password is required")),
  });

  return (
    <>
      {waiting ? (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="flex flex-col items-center space-x-2 max-w-md mx-auto p-4 bg-white rounded-lg">
            <FaSpinner className="animate-spin text-6xl text-blue-500" />
            <span className="mt-2 text-gray-800">
              {t("Updating credentials...")}
            </span>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center">
          <div className="max-w-md w-full mx-auto p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4">{t("Reset Password")}</h2>
            <Formik
              initialValues={{
                newPassword: "",
              }}
              validationSchema={validationSchema}
              onSubmit={handleFormSubmit}
            >
              <Form>
                <div className="mb-4">
                  <label htmlFor="newPassword" className="block mb-1">
                    <span className="flex items-center">
                      <RiLockPasswordLine className="mr-2" />
                      {t("New Password")}:
                    </span>
                  </label>
                  <Field
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    className="border border-gray-300 p-2 w-full"
                  />
                  <ErrorMessage
                    name="newPassword"
                    component="div"
                    className="text-red-500"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t("Resetting...") : t("Reset Password")}
                </button>
              </Form>
            </Formik>
          </div>
        </div>
      )}
    </>
  );
};

export default PasswordReset;
