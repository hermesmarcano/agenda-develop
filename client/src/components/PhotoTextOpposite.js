import React, { useContext } from "react";
import section2Context from "../context/Section2Context";

const PhotoAndTextSectionReversed = () => {
  const { section2Data } = useContext(section2Context);

  return (
    <div className="container mx-auto py-8 px-4 flex flex-col md:flex-row">
      <div className={`w-full md:w-1/2 md:mr-8`}>
        <h2 className="text-2xl font-bold mb-4">{section2Data.title}</h2>
        <p className="text-gray-700">{section2Data.content}</p>
      </div>
      <div className={`w-full md:w-1/2 md:mr-8`}>
        <img
          src={`http://localhost:4040/uploads/admin/${section2Data.image}`}
          alt={section2Data.title}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default PhotoAndTextSectionReversed;
