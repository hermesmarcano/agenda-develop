import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';
import { FiPhone } from 'react-icons/fi';
import instance from '../axiosConfig/axiosConfig';
import { useTranslation } from 'react-i18next';

const CustomerSignIn = ({toggleForm, setSignInPopup}) => {
  const { t } = useTranslation();
  const [phoneNumber, setPhoneNumber] = useState('');
  const fadeIn = useSpring({ opacity: 1, from: { opacity: 0 } });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Phone Number:', phoneNumber);
    const customerLogin = {
        phone: phoneNumber
    }
    instance
    .post("/customers/login", customerLogin)
    .then((response) => {
      console.log(response.data.token);
      localStorage.setItem("ag_app_customer_token", response.data.token);
      setSignInPopup(false);
    })
    .catch((error) => {
      console.log(error);
    });
  };

  return (
    <animated.div style={fadeIn} className="flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-lg p-8 max-w-md w-full space-y-4">
        <h2 className="text-2xl font-semibold text-center">{t('Sign In')}</h2>
        <form onSubmit={handleSubmit} className='grid grid-col-1 gap-1'>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FiPhone className="text-gray-400" />
            </div>
            <input
              type="tel"
              className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-sky-300"
              placeholder={t("Phone Number")}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-sky-600 hover:bg-sky-500 text-white py-2 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
          >
            {t('Sign In')}
          </button>
        </form>
        <div className="text-center">
          <p className="text-sm text-gray-600">
            {t("Don't have an account?")}{' '}
            <button onClick={toggleForm} className="text-sky-600 hover:underline">
              {t('Register here')}
            </button>
          </p>
        </div>
      </div>
    </animated.div>
  );
};

export default CustomerSignIn;
