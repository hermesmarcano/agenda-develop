import React from "react";

const ShopCard = ({ name, imageUrl, shop, onClick, selectedShop }) => {
  return (
    <div
      className={`max-w-sm rounded overflow-hidden shadow-lg cursor-pointer ${
        selectedShop === shop ? "ring-2 ring-indigo-500" : ""
      }`}
      onClick={onClick}
    >
      <img className="w-full" src={imageUrl} alt={name} />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{name}</div>
      </div>
    </div>
  );
};

export default ShopCard;
