import { useTranslation } from "react-i18next";
import { FaCalendarAlt } from "react-icons/fa";

const WizardHeader = () => {
  const { t } = useTranslation();
  return (
    <header className="bg-gray-200 text-sky-600 border-b-4 border-sky-600 mb-4 p-2 w-screen">
      <div className="flex items-center">
        <FaCalendarAlt className="text-4xl mr-2" />
        <h1 className="text-3xl font-semibold">{t('Booking Service')}</h1>
      </div>
    </header>
  );
};

export default WizardHeader;
