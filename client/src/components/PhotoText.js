import React, { useContext } from "react";
import section1Context from "../context/Section1Context";

const PhotoAndTextSection = () => {
  const { section1Data } = useContext(section1Context);

  return (
    <div className="container mx-auto py-8 px-4 flex flex-col md:flex-row">
      <div className={`w-full md:w-1/2 md:mr-8`}>
        <img
          src={`http://localhost:4040/uploads/admin/${section1Data.image}`}
          alt={section1Data.title}
          className="w-full"
        />
      </div>
      <div className={`w-full md:w-1/2 md:mr-8`}>
        <h2 className="text-2xl font-bold mb-4">{section1Data.title}</h2>
        <p className="text-gray-700">{section1Data.content}</p>
      </div>
    </div>
  );
};

export default PhotoAndTextSection;
