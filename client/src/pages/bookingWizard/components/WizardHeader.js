import { FaCalendarAlt } from "react-icons/fa";

const WizardHeader = () => {
  return (
    <header className="bg-gray-200 text-teal-600 border-b-4 border-teal-600 mb-4 p-2 w-screen">
      <div className="flex items-center">
        <FaCalendarAlt className="text-4xl mr-2" />
        <h1 className="text-3xl font-semibold">Booking Service</h1>
      </div>
      {/* <div className="border-b border-white mt-2"></div> */}
    </header>
  );
};

export default WizardHeader;
