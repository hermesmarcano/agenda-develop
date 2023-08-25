import { FaCalendarAlt } from "react-icons/fa";

const CheckoutHeader = () => {
  return (
    <header className="bg-indigo-600 text-white p-2 w-screen">
      <div className="flex items-center">
        <FaCalendarAlt className="text-4xl mr-2" />
        <h1 className="text-3xl font-semibold">Booking Service</h1>
      </div>
      <div className="border-b border-white"></div>
    </header>
  );
};

export default CheckoutHeader;
