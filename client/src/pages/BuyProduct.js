import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { HiCheckCircle } from "react-icons/hi";
import instance from "../axiosConfig/axiosConfig";

const BuyProduct = () => {
  const params = useParams();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    instance.get(`/managers/shopname?urlSlug=${params.id}`).then((response) => {
      console.log(response.data);
      instance
        .get(`/products/shopname?shopName=${response.data.shopName}`)
        .then((response) => {
          console.log(response.data.products);
          setProducts(response.data.products);
        });
    });
  }, []);

  useEffect(() => {
    console.log(selectedProducts);
    localStorage.setItem("products", JSON.stringify(selectedProducts));
  }, [selectedProducts]);

  const handleProductSelection = (product) => {
    // Check if the product is already selected
    if (
      selectedProducts.some(
        (selectedProduct) => selectedProduct._id === product._id
      )
    ) {
      // If yes, remove it from the array
      setSelectedProducts(
        selectedProducts.filter(
          (selectedProduct) => selectedProduct._id !== product._id
        )
      );
    } else {
      // If no, add it to the array
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-3">
      <h1 className="text-5xl font-extrabold mb-8 text-gray-900">
        Buy a Product
      </h1>
      <div
        className={`grid grid-cols-1 ${
          products.length > 1 && "sm:grid-cols-2"
        } ${products.length > 3 && "md:grid-cols-4"} gap-4`}
      >
        {products.map((product) => (
          <div
            key={product._id}
            className={`bg-white rounded-lg shadow-md ${
              selectedProducts.some(
                (selectedProduct) => selectedProduct._id === product._id
              )
                ? "ring-2 ring-indigo-500"
                : ""
            }`}
            onClick={() => handleProductSelection(product)}
          >
            {product.productImg ? (
              //   <div
              //     className="w-[150px] h-[150px] bg-no-repeat bg-cover bg-center"
              //     style={{
              //       backgroundImage: `url(http://localhost:4040/uploads/products/${product.productImg})`,
              //     }}
              //   ></div>
              <img
                src={`http://localhost:4040/uploads/products/${product.productImg}`}
                alt={product.name}
                className="h-48 w-full  rounded-t-lg object-cover"
              />
            ) : (
              <img
                src="https://via.placeholder.com/150"
                alt={product.name}
                className="h-48 w-full  rounded-t-lg object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="text-xl font-medium text-gray-900">
                {product.name}
              </h2>
              <p className="text-gray-600">${product.price}</p>
            </div>
            {selectedProducts.some(
              (selectedProduct) => selectedProduct._id === product._id
            ) && (
              <div className="absolute top-0 right-0 mt-2 mr-2">
                <HiCheckCircle className="text-green-500 text-2xl" />
              </div>
            )}
          </div>
        ))}
      </div>
      {products.length === 0 && (
        <div className="flex flex-col items-center justify-center">
          <div className="mb-4">
            <HiCheckCircle className="h-16 w-16 text-gray-400" />
          </div>
          <p className="text-gray-500 mb-2">No available products</p>
        </div>
      )}
      {selectedProducts.length > 0 && (
        <div className="flex flex-col items-center">
          <Link to={`/shops/${params.id}/booking-summary`}>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-xl font-medium py-4 px-8 rounded-full mt-8 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Continue
            </button>
          </Link>
          <p className="text-gray-500 mt-4">or</p>

          <button
            className="text-gray-600 hover:text-indigo-600 mt-2 focus:outline-none"
            onClick={() => setSelectedProducts([])}
          >
            Skip
          </button>
        </div>
      )}
    </div>
  );
};

export default BuyProduct;
