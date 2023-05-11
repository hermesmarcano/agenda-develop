import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import {
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaIdCard,
  FaLink,
  FaLock,
  FaTrashAlt,
  FaUpload,
  FaCloudUploadAlt,
  FaUser,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
// import { useDropzone } from "react-dropzone";

const Register = () => {
  const navigate = useNavigate();

  // const ImageUpload = ({ field, form, ...props }) => {
  //   const handleChange = (event) => {
  //     const file = event.currentTarget.files[0];
  //     form.setFieldValue(field.name, file);
  //   };

  //   const hasError = form.touched[field.name] && form.errors[field.name];

  //   return (
  //     <div className="mt-2">
  //       <input
  //         id={field.name}
  //         name={field.name}
  //         type="file"
  //         accept="image/*"
  //         onChange={handleChange}
  //         className="hidden"
  //         {...props}
  //       />
  //       <label htmlFor={field.name}>
  //         <div className="h-40 w-full rounded-md border-dashed border-2 border-gray-300 flex flex-col justify-center items-center">
  //           {form.values[field.name] ? (
  //             <img
  //               src={URL.createObjectURL(form.values[field.name])}
  //               alt="Uploaded profileImg"
  //               className="h-full w-full object-contain"
  //             />
  //           ) : (
  //             <div className="text-center">
  //               <svg
  //                 className="mx-auto h-12 w-12 text-gray-400"
  //                 fill="none"
  //                 stroke="currentColor"
  //                 viewBox="0 0 48 48"
  //                 aria-hidden="true"
  //               >
  //                 <path
  //                   strokeLinecap="round"
  //                   strokeLinejoin="round"
  //                   strokeWidth={2}
  //                   d="M20 30l10-10m0 0l10 10m-10-10v18"
  //                 />
  //               </svg>
  //               <p className="mt-1 text-sm text-gray-600">
  //                 Click or drag a file to upload
  //               </p>
  //             </div>
  //           )}
  //         </div>
  //       </label>
  //       {hasError && (
  //         <div className="mt-2 text-sm text-red-500">
  //           {form.errors[field.name]}
  //         </div>
  //       )}
  //     </div>
  //   );
  // };
  const ImageUpload = ({ field, form, ...props }) => {
    const handleChange = (event) => {
      const file = event.currentTarget.files[0];
      form.setFieldValue(field.name, file);
    };

    const hasError = form.touched[field.name] && form.errors[field.name];

    return (
      <div className="mt-2">
        <input
          id={field.name}
          name={field.name}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
          {...props}
        />
        <label htmlFor={field.name}>
          <div className="h-40 w-full rounded-md border-dashed border-2 border-gray-300 flex flex-col justify-center items-center">
            {form.values[field.name] ? (
              <img
                src={URL.createObjectURL(form.values[field.name])}
                alt="Uploaded profileImg"
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="text-center">
                <FaCloudUploadAlt className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-1 text-sm text-gray-600">
                  Click or drag a file to upload
                </p>
              </div>
            )}
          </div>
        </label>
        {hasError && (
          <div className="mt-2 text-sm text-red-500">
            {form.errors[field.name]}
          </div>
        )}
      </div>
    );
  };
  const [registered, setRegistered] = useState(true);
  const RegisterSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string()
      .required("Required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: Yup.string()
      .required("Required")
      .oneOf([Yup.ref("password")], "Passwords must match"),
    shopName: Yup.string().required("Shop Name is required"),
    urlSlug: Yup.string()
      .required("URL Slug is required")
      .matches(
        /^[a-zA-Z0-9]+$/,
        "This field cannot contain white space and special character"
      ),
    profileImg: Yup.mixed().required("Profile image is required"),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="h-screen bg-gray-50 py-12 sm:px-6 lg:px-8 overflow-auto">
      <div className="flex flex-col justify-center h-full ">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create a new account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Sign in
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <Formik
              initialValues={{
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
                shopName: "",
                urlSlug: "",
                profileImg: "",
              }}
              validationSchema={RegisterSchema}
              onSubmit={(values, { setSubmitting }) => {
                const formData = new FormData();
                formData.append("name", values.name);
                formData.append("email", values.email);
                formData.append("password", values.password);
                formData.append("confirmPassword", values.confirmPassword);
                formData.append("shopName", values.shopName);
                formData.append("urlSlug", values.urlSlug);
                formData.append("profileImg", values.profileImg);

                fetch("http://localhost:4040/managers/", {
                  method: "POST",
                  body: formData,
                })
                  .then((response) => {
                    if (response.ok) {
                      setRegistered(true);
                    } else {
                      setRegistered(false);
                    }
                    return response.json();
                  })
                  .then((data) => {
                    console.log(data);
                    if (registered) {
                      alert("registered successfully");
                      navigate("/login");
                    }
                  })

                  .catch((errors) => console.log(errors));

                setSubmitting(false);
              }}
            >
              {({ errors, touched }) => (
                <Form className="space-y-6">
                  <div>
                    <label htmlFor="name" className="sr-only">
                      Name
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 right-2 pl-3 flex items-center pointer-events-none">
                        <FaUser
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </div>
                      <Field
                        id="name"
                        name="name"
                        type="name"
                        autoComplete="name"
                        className={`appearance-none rounded-md block w-full px-3 py-2 border ${
                          errors.name && touched.name
                            ? "border-red-500"
                            : "border-gray-300"
                        } placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                        placeholder="Name"
                      />
                    </div>
                    {errors.name && touched.name ? (
                      <div className="mt-2 text-sm text-red-500">
                        {errors.name}
                      </div>
                    ) : null}
                  </div>

                  <div>
                    <label htmlFor="email" className="sr-only">
                      Email address
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 right-2 pl-3 flex items-center pointer-events-none">
                        <FaEnvelope
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </div>
                      <Field
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        className={`appearance-none rounded-md block w-full px-3 py-2 border ${
                          errors.email && touched.email
                            ? "border-red-500"
                            : "border-gray-300"
                        } placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                        placeholder="Email address"
                      />
                    </div>
                    {errors.email && touched.email ? (
                      <div className="mt-2 text-sm text-red-500">
                        {errors.email}
                      </div>
                    ) : null}
                    {!registered ? (
                      <div className="mt-2 text-sm text-red-500">
                        This email has been registered before
                      </div>
                    ) : null}
                  </div>

                  <div>
                    <label htmlFor="password" className="sr-only">
                      Password
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 right-2 pl-3 flex items-center pointer-events-none">
                        <FaLock
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </div>
                      <Field
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        className={`appearance-none rounded-md block w-full px-3 py-2 border ${
                          errors.password && touched.password
                            ? "border-red-500"
                            : "border-gray-300"
                        } placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                        placeholder="Password"
                      />
                      <div className="absolute inset-y-0 right-5 pr-3 flex items-center text-sm leading-5">
                        <button
                          type="button"
                          className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <FaEye size={20} />
                          ) : (
                            <FaEyeSlash size={20} />
                          )}
                        </button>
                      </div>
                    </div>
                    {errors.password && touched.password ? (
                      <div className="mt-2 text-sm text-red-500">
                        {errors.password}
                      </div>
                    ) : null}
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="sr-only">
                      Confirm Password
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 right-2 pl-3 flex items-center pointer-events-none">
                        <FaLock
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </div>
                      <Field
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        className={`appearance-none rounded-md block w-full px-3 py-2 border ${
                          errors.confirmPassword && touched.confirmPassword
                            ? "border-red-500"
                            : "border-gray-300"
                        } placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                        placeholder="Confirm Password"
                      />
                      <div className="absolute inset-y-0 right-5 pr-3 flex items-center text-sm leading-5">
                        <button
                          type="button"
                          className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <FaEye size={20} />
                          ) : (
                            <FaEyeSlash size={20} />
                          )}
                        </button>
                      </div>
                    </div>
                    {errors.confirmPassword && touched.confirmPassword ? (
                      <div className="mt-2 text-sm text-red-500">
                        {errors.confirmPassword}
                      </div>
                    ) : null}
                  </div>
                  <div>
                    <label htmlFor="shopName" className="sr-only">
                      Shop Name
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 right-2 pl-3 flex items-center pointer-events-none">
                        <FaIdCard
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </div>
                      <Field
                        id="shopName"
                        name="shopName"
                        type="shopName"
                        autoComplete="shopName"
                        className={`appearance-none rounded-md block w-full px-3 py-2 border ${
                          errors.shopName && touched.shopName
                            ? "border-red-500"
                            : "border-gray-300"
                        } placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                        placeholder="Shop Name"
                      />
                    </div>
                    {errors.shopName && touched.shopName ? (
                      <div className="mt-2 text-sm text-red-500">
                        {errors.shopName}
                      </div>
                    ) : null}
                  </div>
                  <div>
                    <label htmlFor="urlSlug" className="sr-only">
                      URL Slug
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 right-2 pl-3 flex items-center pointer-events-none">
                        <FaLink
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </div>
                      <Field
                        id="urlSlug"
                        name="urlSlug"
                        type="urlSlug"
                        autoComplete="urlSlug"
                        className={`appearance-none rounded-md block w-full px-3 py-2 border ${
                          errors.urlSlug && touched.urlSlug
                            ? "border-red-500"
                            : "border-gray-300"
                        } placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                        placeholder="URL Sulg"
                      />
                    </div>
                    {errors.urlSlug && touched.urlSlug ? (
                      <div className="mt-2 text-sm text-red-500">
                        {errors.urlSlug}
                      </div>
                    ) : null}
                  </div>

                  <Field name="profileImg" component={ImageUpload} />

                  <div>
                    <button
                      type="submit"
                      className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded  text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Register
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Register;
