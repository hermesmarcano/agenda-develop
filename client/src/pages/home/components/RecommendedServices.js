import { useContext } from "react";
import ServiceCard from "./ServiceCard";
import { ServicesContext } from "../../../context/ServicesContext";
import { useTranslation } from "react-i18next";

const RecommendedServices = () => {
  const { t } = useTranslation();
  const { servicesData } = useContext(ServicesContext);
  return (
    <div className="bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-4">{t('Recommended Services')}</h2>
        <div className="flex flex-wrap -mx-2">
          {servicesData.map((service) => (
            <div
              className="w-full md:w-1/2 lg:w-1/3 px-2 mb-4"
              key={service._id}
            >
              <ServiceCard service={service} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecommendedServices;
