import React, { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Pagination = ({ itemsPerPage, totalItems, onPageChange }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) {
      return;
    }
    setCurrentPage(page);
    onPageChange(page);
  };

  const renderPageButtons = () => {
    const visiblePageButtons = [];
    const maxVisibleButtons = 4;

    let start = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
    let end = Math.min(start + maxVisibleButtons - 1, totalPages);

    if (end - start < maxVisibleButtons - 1) {
      start = Math.max(1, end - maxVisibleButtons + 1);
    }

    for (let page = start; page <= end; page++) {
      visiblePageButtons.push(
        <button
          key={page}
          className={`${currentPage === page
              ? "bg-gray-300 text-gray-700"
              : "bg-gray-100 text-gray-600"
            } px-4 py-2 mx-1 rounded-md h-[40px]`}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </button>
      );
    }

    return visiblePageButtons;
  };

  return (
    <div className="mt-6">
      {totalPages > 1 && (
        <nav className="flex flex-wrap items-center justify-center">
          <button
            className={`px-4 py-2 mx-1 rounded-md h-[40px] ${currentPage === 1
                ? "bg-gray-100 text-gray-700  cursor-not-allowed"
                : "bg-gray-100 text-gray-600 hover:bg-gray-300"
              }`}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <FiChevronLeft />
          </button>

          {currentPage > 3 && (
            <button
              className="h-[40px] mx-2 my-1 px-4 py-2 rounded-md bg-gray-100 text-gray-600"
              onClick={() => handlePageChange(1)}
            >
              1
            </button>
          )}

          {currentPage > 4 && (
            <button
              className="h-[40px] bg-gray-100 text-gray-600 px-4 py-2 mx-1 rounded-md cursor-default"
              disabled={true}
            >
              ...
            </button>
          )}

          {renderPageButtons()}

          {currentPage < totalPages - 3 && (
            <button
              className="h-[40px] bg-gray-100 text-gray-600 px-4 py-2 mx-1 rounded-md cursor-default"
              disabled={true}
            >
              ...
            </button>
          )}

          {currentPage < totalPages - 2 && (
            <button
              className="h-[40px] mx-2 my-1 px-4 py-2 rounded-md bg-gray-100 text-gray-600"
              onClick={() => handlePageChange(totalPages)}
            >
              {totalPages}
            </button>
          )}

          <button
            className={`px-4 py-2 mx-1 rounded-md h-[40px] ${currentPage === totalPages
                ? "bg-gray-100 text-gray-700  cursor-not-allowed"
                : "bg-gray-100 text-gray-600 hover:bg-gray-300"
              }`}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <FiChevronRight />
          </button>
        </nav>
      )}
    </div>
  );
};

export default Pagination;
