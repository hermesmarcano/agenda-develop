import { useTranslation } from "react-i18next";
import {
  FaUser,
  FaCalendar,
  FaClock,
  FaWrench,
  FaShoppingCart,
} from "react-icons/fa";
import i18next from 'i18next';

const BookingSummary = ({ paramsId }) => {
  const { t } = useTranslation();
  const professional = JSON.parse(
    localStorage.getItem(`professional_${paramsId}`)
  );
  const services = JSON.parse(localStorage.getItem(`services_${paramsId}`));
  const servicesId = [];
  const servicesNames = [];
  services.map((service) => {
    servicesId.push(service["_id"]);
  });
  services.map((service) => {
    servicesNames.push(service.name);
  });
  const products = JSON.parse(localStorage.getItem(`products_${paramsId}`));
  const productsId = [];
  const productsNames = [];
  if (products) {
    products.map((product) => {
      productsId.push(product["_id"]);
    });
    products.map((product) => {
      productsNames.push(product.name);
    });
  }

  const d = new Date(localStorage.getItem(`dateTime_${paramsId}`));

  function getCurrentLanguage() {
    return i18next.language || "en";
  }

  function formatDate(date, language) {
    const dateFormats = {
      en: { hour: "2-digit", minute: "numeric", hourCycle: "h23" },
      es: { hour: "2-digit", minute: "numeric", hourCycle: "h23" },
    };    

    return new Intl.DateTimeFormat(language, dateFormats[language]).format(
      date
    );
  }
  const date = new Intl.DateTimeFormat(["ban", "id"]).format(d);
  const time = formatDate(d, getCurrentLanguage())

  return (
    <div className="bg-teal-600 text-white p-8 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <FaUser className="mr-2 text-3xl" />
          <span className="text-lg font-semibold">{professional.name}</span>
        </div>
        <div className="flex items-center">
          <FaCalendar className="mr-2 text-3xl" />
          <span className="text-lg font-semibold">{date}</span>
        </div>
      </div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">{t('Booking Details')}</h2>
        <div className="mb-2">
          <h3 className="text-lg font-semibold mb-1">{t('Services:')}</h3>
          {servicesNames.map((service, index) => (
            <div key={index} className="flex items-center">
              <FaWrench className="mr-2 text-xl" />
              <span className="text-lg">{service}</span>
            </div>
          ))}
        </div>
        <div className="mb-2">
          <h3 className="text-lg font-semibold mb-1">{t('Products:')}</h3>
          {productsNames.map((product, index) => (
            <div key={index} className="flex items-center">
              <FaShoppingCart className="mr-2 text-xl" />
              <span className="text-lg">{product}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center">
        <FaClock className="mr-2 text-3xl" />
        <span className="text-lg">{time}</span>
      </div>
    </div>
  );
};

export default BookingSummary;
