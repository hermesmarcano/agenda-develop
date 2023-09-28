import { createContext, useState } from "react";
import instance from "../axiosConfig/axiosConfig";

const ShopNameContext = createContext();

const ShopNameContextWrapper = ({ children }) => {
  const token = localStorage.getItem("ag_app_shop_token");
  const [shopName, setShopName] = useState(new Date());

  instance.get('/managers/id', {
    headers: {
      Authorization: token,
    },
  }).then((res) => {
    setShopName(res.data.name)
  })

  const contextValue = {
    shopName,
    setShopName,
  };

  return (
    <ShopNameContext.Provider value={contextValue}>
      {children}
    </ShopNameContext.Provider>
  );
};

export { ShopNameContext, ShopNameContextWrapper };
