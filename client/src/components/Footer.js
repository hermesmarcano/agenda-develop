import { useEffect } from "react";
import { useState } from "react";
import instance from "../axiosConfig/axiosConfig";

const Footer = () => {
  const [websiteTitle, setWebsiteTitle] = useState("");

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const response = await instance.get("admin");
      console.log(response.data.admin);

      if (response.data.admin.websiteTitle) {
        setWebsiteTitle(response.data.admin.websiteTitle);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-gray-900 text-gray-500 py-8">
      <div className="container mx-auto px-4">
        <p className="text-center">
          &copy; 2023 {websiteTitle}. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
