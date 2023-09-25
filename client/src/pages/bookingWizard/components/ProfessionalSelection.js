import React, { useEffect, useState } from "react";
import { FiArrowLeft, FiArrowRight, FiCheckCircle } from "react-icons/fi"; // You can import other icons as needed
import instance from "../../../axiosConfig/axiosConfig";
import ReactPaginate from "react-paginate";

const ProfessionalSelection = ({ paramsId }) => {
  const [professionals, setProfessionals] = useState([]);
  const [selectedProfessional, setSelectedProfessional] = useState(null);

  useEffect(() => {
    instance.get(`/managers/shop?urlSlug=${paramsId}`).then((response) => {
      console.log(response.data);
      instance
        .get(`/professionals/shop?shopId=${response.data._id}`)
        .then((response) => {
          console.log(response.data.data);
          setProfessionals(response.data.data);
        });
    });
  }, []);

  useEffect(() => {
    localStorage.setItem(
      `professional_${paramsId}`,
      JSON.stringify(selectedProfessional)
    );
  }, [selectedProfessional]);

  const handleSelection = (pro) => {
    setSelectedProfessional(pro);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto mt-8">
        <div className="mt-8">
          <ProfessionalsList
            professionals={professionals}
            handleSelection={handleSelection}
            selectedProfessional={selectedProfessional}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfessionalSelection;

const ProfessionalCard = ({
  professional,
  handleSelection,
  selectedProfessional,
}) => {
  const [hovered, setHovered] = useState(false);

  const handleHover = () => {
    setHovered(true);
  };

  const handleHoverExit = () => {
    setHovered(false);
  };

  return (
    <li
      className={`py-2 px-4 my-1 bg-white rounded-lg shadow-md transition-transform transform ${
        hovered ? "scale-105" : ""
      } ${professional?._id === selectedProfessional?._id && "scale-105"}`}
      onMouseEnter={handleHover}
      onMouseLeave={handleHoverExit}
    >
      <button
        onClick={() => handleSelection(professional)}
        className="block focus:outline-none"
      >
        <div className="flex items-center space-x-2">
          <div className="flex-shrink-0">
            <FiArrowRight
              className={`h-6 w-6 text-gray-400 transition-colors ${
                hovered ? "text-teal-500" : ""
              } ${
                professional?._id === selectedProfessional?._id &&
                "text-teal-500"
              }`}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div
              className={`text-base font-medium text-left leading-5 text-gray-900 ${
                hovered ? "text-teal-600" : ""
              } ${
                professional?._id === selectedProfessional?._id &&
                "text-teal-600"
              }`}
            >
              {professional.name}
            </div>
            <div
              className={`text-sm leading-5 text-left text-gray-500 ${
                hovered ? "text-gray-700" : ""
              } ${
                professional?._id === selectedProfessional?._id &&
                "text-gray-700"
              }`}
            >
              {professional.description}
            </div>
          </div>
        </div>
      </button>
    </li>
  );
};

const ProfessionalsList = ({
  professionals,
  handleSelection,
  selectedProfessional,
}) => {
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(0);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedProfessionals = professionals.slice(startIndex, endIndex);

  return (
    <div>
      <ReactPaginate
        previousLabel={<FiArrowLeft />}
        nextLabel={<FiArrowRight />}
        breakLabel={"..."}
        pageCount={Math.ceil(professionals.length / itemsPerPage)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageChange}
        containerClassName={"pagination flex justify-center items-center mb-3"}
        previousLinkClassName={
          "pagination__link flex px-2 py-2 bg-gray-200 hover:bg-gray-300 border rounded-l"
        }
        nextLinkClassName={
          "pagination__link flex px-2 py-2 bg-gray-200 hover:bg-gray-300 border rounded-r"
        }
        disabledClassName={"pagination__link--disabled"}
        activeClassName={"active"}
      />
      <ul className="divide-y divide-gray-200">
        {displayedProfessionals.map((professional) => (
          <ProfessionalCard
            key={professional._id}
            professional={professional}
            handleSelection={handleSelection}
            selectedProfessional={selectedProfessional}
          />
        ))}
      </ul>
    </div>
  );
};
