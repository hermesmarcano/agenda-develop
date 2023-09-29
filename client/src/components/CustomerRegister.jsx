import React, { useState } from "react";
import { useSpring, animated } from "react-spring";
import { FiPhone, FiMail, FiUser, FiCalendar, FiMapPin } from "react-icons/fi";
import instance from "../axiosConfig/axiosConfig";
import { useTranslation } from "react-i18next";

const CustomerRegister = ({ toggleForm, shopId }) => {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    birthday: "",
    address: "",
  });

  const fadeIn = useSpring({ opacity: 1, from: { opacity: 0 } });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    const postData = {
      name: formData.name,
      phone: formData.phone,
      managerId: shopId,
    };

    if (formData.email) {
      postData.email = formData.email;
    }

    if (formData.birthday) {
      postData.birthday = formData.birthday;
    }

    if (formData.address) {
      postData.address = formData.address;
    }

    const fetchRequest = async () => {
      instance
        .post("customers/", postData, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          toggleForm();
        })
        .catch((e) => console.log(e));
    };

    fetchRequest();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <animated.div
      style={fadeIn}
      className="flex items-center justify-center bg-gray-100"
    >
      <div className="bg-white rounded-lg p-8 max-w-md w-full space-y-4">
        <h2 className="text-2xl font-semibold text-center">Register</h2>
        <form onSubmit={handleSubmit} className="grid grid-col-1 gap-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FiUser className="text-gray-400" />
            </div>
            <input
              type="text"
              name="name"
              className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-teal-300"
              placeholder={t("Full Name")}
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FiPhone className="text-gray-400" />
            </div>
            <input
              type="tel"
              name="phone"
              className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-teal-300"
              placeholder={t("Phone Number")}
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FiMail className="text-gray-400" />
            </div>
            <input
              type="email"
              name="email"
              className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-teal-300"
              placeholder={t("Email (Optional)")}
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FiCalendar className="text-gray-400" />
            </div>
            <input
              type="date"
              name="birthday"
              className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-teal-300"
              placeholder={t("Date of Birth (Optional)")}
              value={formData.dob}
              onChange={handleChange}
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FiMapPin className="text-gray-400" />
            </div>
            <input
              type="text"
              name="address"
              className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-teal-300"
              placeholder={t("Address (Optional)")}
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-500 text-white py-2 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
          >
            {t('Register')}
          </button>
        </form>
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <button
              onClick={toggleForm}
              className="text-teal-600 hover:underline"
            >
              {t('Sign In here')}
            </button>
          </p>
        </div>
      </div>
    </animated.div>
  );
};

export default CustomerRegister;
