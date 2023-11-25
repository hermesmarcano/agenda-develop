import { useState, useEffect } from 'react';
import instance from '../../../axiosConfig/axiosConfig';
import { useTranslation } from "react-i18next";

const CheckoutFooter = () => {
  const { t } = useTranslation();
  const [websiteTitle, setWebsiteTitle] = useState("");

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const response = await instance.get("admin");
      if (response.data.admin.websiteTitle) {
        setWebsiteTitle(response.data.admin.websiteTitle);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <footer className="bg-gray-200 text-gray-500 p-2 shadow-inner w-screen">
      <div className="flex items-center justify-start">
        <p className="text-sm">&copy; {t('2023')} {websiteTitle}. {t('All rights reserved')}{" "}.{t('Powered by Innovative360 - Upwork Agency © 2023')}</p>
      </div>
    </footer>
  );
};

export default CheckoutFooter;
