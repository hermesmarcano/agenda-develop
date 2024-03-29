import React, { useContext } from "react";
import { Section2Context } from "../../../context/Section2Context";

const PhotoTextReversed = () => {
  const { section2Data } = useContext(Section2Context);

  return (
    <div className="container mx-auto py-8 px-4 flex flex-col md:flex-row">
      <div className={`w-full md:w-1/2 md:mr-8`}>
        <h2 className="text-2xl font-bold mb-4">{section2Data.title}</h2>
        <p className="text-gray-700">{section2Data.content}</p>
      </div>
      <div className={`w-full md:w-1/2 md:mr-8`}>
        <img
          src={section2Data.image}
          alt={section2Data.title}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default PhotoTextReversed;
