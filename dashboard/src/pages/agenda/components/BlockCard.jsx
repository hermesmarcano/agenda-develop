import i18next from "i18next";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FaRegCalendarTimes } from "react-icons/fa";

const BlockCard = ({ blockingPeriod }) => {
  const { t } = useTranslation();
  const { professional, dateTime, blockingReason, blockingDuration } =
    blockingPeriod;
  function getCurrentLanguage() {
    return i18next.language || "en"; // Default to English if language is not set
  }

  function formatDate(date, language) {
    const dateFormats = {
      en: { dateStyle: "full", timeStyle: "long" },
      es: { dateStyle: "full", timeStyle: "long" },
    };

    return new Intl.DateTimeFormat(language, dateFormats[language]).format(
      date
    );
  }

  const endDateTime = useMemo(() => {
    const startDate = new Date(dateTime);
    const endDate = new Date(
      startDate.getTime() + blockingDuration * 60 * 1000
    );

    const currentLanguage = getCurrentLanguage();

    return formatDate(endDate, currentLanguage);
  }, [dateTime, blockingDuration]);

  return (
    <div className="p-4 rounded-lg shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <FaRegCalendarTimes className="text-red-500 text-3xl mr-2" />
          <div>
            <p className="text-xl font-semibold">{t("Blocked Period")}</p>
            <p>
              <span className="text-gray-400">{t("Professional")}:</span>{" "}
              {professional.name}
            </p>
            <p>
              <span className="text-gray-400">{t("Blocking Reason")}:</span>{" "}
              {blockingReason}
            </p>
            <p>
              <span className="text-gray-400">{t("Block Duration")}:</span>{" "}
              {formatDate(new Date(dateTime), getCurrentLanguage())} -{" "}
              {endDateTime}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockCard;
