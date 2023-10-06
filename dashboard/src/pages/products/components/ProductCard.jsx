import { useContext } from "react";
import { DarkModeContext } from "../../../context/DarkModeContext";
import { FaEdit, FaUser } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const ProductCard = ({
  product,
  selectedIds,
  setUpdateModelState,
  setSelectedProductId,
}) => {
  const { t } = useTranslation();
  const { isDarkMode } = useContext(DarkModeContext);
  return (
    <div
      className={`w-64 h-64 border-b-4 border-teal-500 ${
        selectedIds.includes(product._id)
          ? isDarkMode
            ? "bg-teal-600"
            : "bg-teal-100"
          : isDarkMode
          ? "bg-gray-800"
          : "bg-white"
      } shadow-md text-center rounded-lg p-4 mb-4 hover:shadow-lg`}
    >
      <div className="flex justify-end items-center">
        <button
          className="text-gray-500 hover:text-gray-700"
          onClick={() => {
            setUpdateModelState(true);
            setSelectedProductId(product._id);
          }}
        >
          <FaEdit />
        </button>
      </div>
      <div className="flex flex-col justify-center items-center">
        <div className="flex justify-center items-center rounded-full bg-gray-100 p-2">
          <img
            className="h-16 w-16 rounded-full object-cover border border-gray-400 bg-white"
            src={product.productImg}
            alt="Shop logo"
          />
        </div>
        <h2 className="text-lg ml-2 font-semibold text-center">
          {product.name}
        </h2>
      </div>
      <div className="mt-2">
        <div className="mb-2 flex justify-center">
          <strong>
            {t("For")}:{" "}
            <p className="text-base text-gray-500">{product.speciality}</p>
          </strong>
        </div>
        <div className="mb-2 flex justify-center gap-1">
          <strong>
            <p className="text-base text-gray-50 rounded-full p-2 bg-gray-500">
              {t("BRL")} {product.costBRL}
            </p>
          </strong>
          <strong>
            <p className="text-base text-gray-50 rounded-full p-2 bg-gray-500">
              {product.stock} {t("items")}
            </p>
          </strong>
          <strong>
            <p className="text-base text-gray-50 rounded-full p-2 bg-gray-500">
              {t("$")} {product.price}
            </p>
          </strong>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
