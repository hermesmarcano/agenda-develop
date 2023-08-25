import {
  FaCheckCircle,
  FaListUl,
  FaUser,
  FaCalendar,
  FaClock,
  FaClipboard,
  FaShoppingBag,
} from "react-icons/fa";

const StepIndicator = ({ currentStep }) => {
  const steps = [
    { icon: <FaListUl className="text-xl sm:text-3xl" />, text: "Services" },
    { icon: <FaUser className="text-xl sm:text-3xl" />, text: "Professional" },
    { icon: <FaCalendar className="text-xl sm:text-3xl" />, text: "Date" },
    { icon: <FaClock className="text-xl sm:text-3xl" />, text: "Hour" },
    {
      icon: <FaShoppingBag className="text-xl sm:text-3xl" />,
      text: "Products",
    },
    { icon: <FaClipboard className="text-xl sm:text-3xl" />, text: "Summary" },
  ];

  return (
    <div className="flex justify-between items-center mb-4">
      {steps.map((step, index) => (
        <div key={index} className={`relative ${index !== 0 ? "ml-4" : ""}`}>
          {index !== steps.length - 1 && (
            <div
              className={`absolute h-0.5 w-8 top-6 sm:h-1 sm:w-16 sm:top-11 ${
                currentStep > index + 1
                  ? "bg-indigo-500"
                  : "bg-gray-300 shadow-inner"
              }`}
              style={{ left: "100%" }}
            ></div>
          )}
          <div
            className={`w-14 h-14 sm:w-24 sm:h-24 rounded flex items-center justify-center sm:text-2xl text-lg ${
              currentStep >= index + 1
                ? "bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-lg"
                : "bg-gray-300 text-gray-500 shadow-inner"
            }`}
          >
            {currentStep > index + 1 ? (
              <FaCheckCircle className="text-lg sm:text-2xl text-green-500" />
            ) : (
              <div className="sm:text-xl flex flex-col justify-center items-center mt-4 sm:mt-0">
                {step.icon}
                <div
                  className={`text-sm text-transparent sm:text-gray-500 ${
                    currentStep >= index + 1
                      ? "sm:text-white"
                      : "sm:text-gray-500"
                  }`}
                >
                  {step.text}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;
