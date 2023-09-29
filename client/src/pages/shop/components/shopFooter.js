import { useTranslation } from "react-i18next";

const ShopFooter = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-gray-200 text-gray-500 p-2 shadow-inner w-screen">
      <div className="flex items-center justify-start">
        <p className="text-sm">{t('Powered by Agenda App © 2023')}</p>
      </div>
    </footer>
  );
};

export default ShopFooter;
