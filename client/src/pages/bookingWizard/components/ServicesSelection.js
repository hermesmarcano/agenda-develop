import React, { useEffect, useState } from "react";
import { FiArrowLeft, FiArrowRight, FiCheckCircle } from "react-icons/fi";
import instance from "../../../axiosConfig/axiosConfig";
import ReactPaginate from "react-paginate";
import { useTranslation } from "react-i18next";

const ServicesSelection = ({ paramsId, setHasSelectedService }) => {
  const { t } = useTranslation();
  const [selectedServices, setSelectedServices] = useState([]);
  const [services, setServices] = useState([]);
  const perPage = 4; // Number of services per page
  const [currentPage, setCurrentPage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    instance.get(`/managers/shop?urlSlug=${paramsId}`).then((response) => {
      instance
        .get(`/services/shop?shopId=${response.data._id}`)
        .then((response) => {
          setServices(response.data.services);
        });
    });
  }, []);

  useEffect(() => {
    localStorage.setItem(
      `services_${paramsId}`,
      JSON.stringify(selectedServices)
    );
  }, [selectedServices]);

  const handlePageChange = (selected) => {
    setCurrentPage(selected.selected);
  };

  const visibleServices = services.slice(
    currentPage * perPage,
    (currentPage + 1) * perPage
  );

  const handleServiceSelection = (service) => {
    const updatedServices = selectedServices.some(
      (selectedService) => selectedService._id === service._id
    )
      ? selectedServices.filter(
          (selectedService) => selectedService._id !== service._id
        )
      : [...selectedServices, service];

    setSelectedServices(updatedServices);

    // Store selected services along with the shop parameter in localStorage
    localStorage.setItem(
      `services_${paramsId}`,
      JSON.stringify(updatedServices)
    );

    setHasSelectedService(updatedServices.length > 0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto mt-8">
        <div className="mt-8">
          {/* Pagination */}
          <ReactPaginate
            previousLabel={<FiArrowLeft />}
            nextLabel={<FiArrowRight />}
            pageCount={Math.ceil(services.length / perPage)}
            onPageChange={handlePageChange}
            containerClassName={
              "pagination flex justify-center items-center mb-3"
            }
            previousLinkClassName={
              "pagination__link flex px-2 py-2 bg-gray-200 hover:bg-gray-300 border rounded-l"
            }
            nextLinkClassName={
              "pagination__link flex px-2 py-2 bg-gray-200 hover:bg-gray-300 border rounded-r"
            }
            disabledClassName={"pagination__link--disabled"}
            activeClassName={
              "pagination__link--active bg-blue-500 text-white font-bold"
            }
          />

          <div
            className={`grid grid-cols-1 ${
              services.length > 1 && "sm:grid-cols-2"
            } ${services.length > 3 && "md:grid-cols-4"} gap-4`}
          >
            {visibleServices.map((service) => (
              <div
                key={service._id}
                className={`bg-white rounded-lg shadow-md relative overflow-hidden transform transition-transform duration-300 hover:scale-95 ${
                  selectedServices.some(
                    (selectedService) => selectedService._id === service._id
                  )
                    ? "ring-2 ring-teal-500"
                    : ""
                }`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => handleServiceSelection(service)}
              >
                {service.serviceImg ? (
                  <img
                  src={service.serviceImg}
                  alt={service.name}
                  className="h-32 w-full rounded-t-lg object-cover"
                />
                
                ) : (
                  <img
                    src="https://via.placeholder.com/150"
                    alt={service.name}
                    className="h-32 w-full rounded-t-lg object-cover"
                  />
                )}
                <div className="p-2">
                  <h2 className={`text-sm font-medium text-gray-900 `}>
                    {service.name}
                  </h2>
                  <div className="absolute top-4 right-4">
                    {selectedServices.some(
                      (selectedService) => selectedService._id === service._id
                    ) && <FiCheckCircle className="text-green-500 text-2xl" />}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {services.length === 0 && (
            <div className="flex flex-col items-center justify-center">
              <div className="mb-4">
                <svg
                  className="h-16 w-16 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a7 7 0 100 14 7 7 0 000-14zM2.472 8.528A7 7 0 010 6a8 8 0 003.938 6.905l-1.466 1.466a10.001 10.001 0 015.895-5.895L9.462 7.04a8.018 8.018 0 00-6.99 1.489z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-gray-500 mb-2">{t('No available services')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServicesSelection;
