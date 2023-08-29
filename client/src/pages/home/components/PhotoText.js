import React, { useContext } from "react";
import { Section1Context } from "../../../context/Section1Context";

const PhotoText = () => {
  const { section1Data } = useContext(Section1Context);

  return (
    <div className="container mx-auto py-8 px-4 flex flex-col md:flex-row">
      <div className={`w-full md:w-1/2 md:mr-8`}>
        <img
          src={`${process.env.REACT_APP_API}uploads/admin/${section1Data.image}`}
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

export default PhotoText;
