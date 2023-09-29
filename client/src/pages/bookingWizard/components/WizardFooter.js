import { useTranslation } from "react-i18next";

const WizardFooter = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-gray-200 text-gray-500 mt-4 p-2 shadow-inner w-screen">
      {/* <div className="border-b border-gray-500 mt-2"></div> */}
      <div className="flex items-center justify-start">
        <p className="text-sm">{t('Powered by Agenda App © 2023')}</p>
      </div>
    </footer>
  );
};

export default WizardFooter;
