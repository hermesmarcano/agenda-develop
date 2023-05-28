import React, { useContext, useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import SidebarContext from "../context/SidebarContext";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
import ImageUpload from "../components/ImageUpload";

const Settings = () => {
  const { shopName, setShopName } = useContext(SidebarContext);
  const token = localStorage.getItem("ag_app_shop_token");
  const [shopData, setShopData] = useState({});
  const initialValues = {
    shopName: "",
    name: "",
  };

  const initialValues2 = {
    profileImg: "",
  };

  useEffect(() => {
    axios
      .get("http://localhost:4040/managers/id", {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        console.log(response.data);
        setShopData(response.data);
      })
      .catch((error) => console.log(error));
  }, []);

  const handleSubmit = (values, { resetForm }) => {
    // Code to save the changes made to the settings
    console.log(JSON.stringify(values));

    axios
      .patch("http://localhost:4040/managers", JSON.stringify(values), {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      })
      .then((response) => {
        console.log(response.data);
        setShopName(response.data.shopName);
      })
      .catch((error) => console.log(error));
  };

  const deleteProfileImg = () => {
    axios
      .delete(`http://localhost:4040/managers/profile/${shopData.profileImg}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        console.log(response.data);
        // Update shopData with the empty profile image
        setShopData({ ...shopData, profileImg: "" });
      })
      .catch((error) => console.log(error));
  };

  const uploadProfileImg = (values, { resetForm }) => {
    const formData = new FormData();
    formData.append("profileImg", values.profileImg);
    let updatedImg = {
      profileImg: values.profileImg,
    };
    console.log(updatedImg);
    axios
      .post("http://localhost:4040/managers/profileImg", updatedImg, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token,
        },
      })
      .then((response) => {
        console.log(response.data);
        // Update shopData with the new profile image
        axios
          .patch(
            "http://localhost:4040/managers/",
            JSON.stringify({ profileImg: response.data.profileImg }),
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: token,
              },
            }
          )
          .then((response) => {
            console.log(response.data);
            setShopData({
              ...shopData,
              profileImg: response.data.manager.profileImg,
            });
          });
        // setShopData({ ...shopData, profileImg: response.data.profileImg });
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="p-6 ">
      <h1 className="text-3xl font-bold mb-6">Dashboard Settings</h1>
      <div>
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <Form className="bg-white rounded-lg shadow-md px-8 py-6 mb-4">
              <div className="mb-6">
                <label
                  htmlFor="shop-name"
                  className="block text-lg text-gray-800 font-semibold mb-2"
                >
                  Shop Name:
                </label>
                <Field
                  type="text"
                  id="shop-name"
                  name="shopName"
                  className="py-2 px-4 border border-gray-300 rounded-md text-gray                  focus:outline-none focus:border-blue-500 w-full"
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="manager-name"
                  className="block text-lg text-gray-800 font-semibold mb-2"
                >
                  Manager Name:
                </label>
                <Field
                  type="text"
                  id="manager-name"
                  name="name"
                  className="py-2 px-4 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:border-blue-500 w-full"
                />
              </div>
              <div className="flex items-center justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
                  disabled={isSubmitting}
                >
                  Save Changes
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      <h2 className="text-2xl font-semibold mt-6">Profile Image</h2>

      {shopData.profileImg && (
        <div className="relative">
          <img
            src={`http://localhost:4040/uploads/profile/${shopData.profileImg}`}
            alt={`${shopData.profileImg}`}
            className="w-screen rounded-md max-h-40 object-cover mt-2"
          />
          <button
            type="button"
            onClick={deleteProfileImg}
            className="text-red-600 font-medium mt-2 absolute right-1 top-1"
          >
            <FaTrash />
          </button>
        </div>
      )}

      {!shopData.profileImg && (
        <Formik initialValues={initialValues2} onSubmit={uploadProfileImg}>
          {({ isSubmitting }) => (
            <Form>
              <Field name="profileImg" component={ImageUpload} />
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 mt-3 rounded focus:outline-none focus:shadow-outline"
                disabled={isSubmitting}
              >
                Upload
              </button>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
};

export default Settings;
