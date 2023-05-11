import React from "react";

const ServiceCard = ({ service }) => {
  const cardStyle = {
    backgroundImage: `url(http://localhost:4040/uploads/admin/${service.image})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "300px",
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg">
      <div style={cardStyle}>
        <div className="p-4 bg-black bg-opacity-60 h-full flex flex-col justify-end">
          <h3 className="font-bold text-lg mb-2 text-white">{service.title}</h3>
          <div className="mt-4 flex justify-center">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Start Now!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
