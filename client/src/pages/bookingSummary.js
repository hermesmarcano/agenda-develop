import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TiTick } from "react-icons/ti";
import { FaCalendarAlt, FaClock } from "react-icons/fa";
import instance from "../axiosConfig/axiosConfig";

const BookingSummary = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [shopName, setShopName] = useState("");
  const [shopId, setShopId] = useState("");
  const professional = JSON.parse(
    localStorage.getItem(`professional_${params.id}`)
  );
  const services = JSON.parse(localStorage.getItem(`services_${params.id}`));
  const servicesId = [];
  const servicesNames = [];
  services.map((service) => {
    servicesId.push(service["_id"]);
  });
  services.map((service) => {
    servicesNames.push(service.name);
  });
  const products = JSON.parse(localStorage.getItem(`products_${params.id}`));
  console.log("products: ", products);
  const productsId = [];
  const productsNames = [];
  if (products) {
    products.map((product) => {
      productsId.push(product["_id"]);
    });
    products.map((product) => {
      productsNames.push(product.name);
    });
  }
  const d = new Date(localStorage.getItem(`dateTime_${params.id}`));
  const date = new Intl.DateTimeFormat(["ban", "id"]).format(d);
  const time = new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).format(d);
  useEffect(() => {
    instance.get(`/managers/shop?urlSlug=${params.id}`).then((response) => {
      console.log(response.data);
      setShopName(response.data.shopName);
      setShopId(response.data._id);
    });
  }, []);

  const handleConfirmation = () => {
    let total = 0;
    const sum = services.reduce((acc, service) => {
      return acc + service.price;
    }, 0);
    total = sum;
    if (products) {
      const sum2 = products.reduce((acc, product) => {
        return acc + product.price;
      }, sum);
      console.log("sum2: ", sum2);
      total = sum2;
    }

    let duration = services.reduce(
      (totalDuration, s) => totalDuration + s.duration,
      0
    );

    localStorage.setItem(
      "bookingInfo",
      JSON.stringify({
        managerId: shopId,
        customer: "",
        professional: professional._id,
        service: servicesId,
        duration: duration,
        product: productsId,
        dateTime: d,
        amount: total,
      })
    );
    console.log({
      managerId: shopId,
      customer: "",
      professional: professional._id,
      service: servicesId,
      duration: duration,
      product: productsId,
      dateTime: d,
      amount: total,
    });
    localStorage.setItem(
      "bookingDetails",
      JSON.stringify({
        customer: "",
        professional: professional.name,
        service: servicesNames,
        product: productsNames,
        dateTime: d,
        amount: total,
      })
    );
    if (localStorage.getItem("ag_app_customer_token")) {
      navigate(`/shops/${params.id}/booking-checkout`);
    } else {
      navigate(`/shops/${params.id}/signIn`);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col items-center justify-center">
      <h1 className="text-5xl font-extrabold mb-8 text-gray-900">
        Booking Summary
      </h1>
      <div className="max-w-3xl w-full bg-white rounded-lg shadow-lg p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-6">
              <p className="text-lg font-semibold mb-2">Shop Name:</p>
              <p className="text-xl">{shopName}</p>
            </div>
            <div className="mb-6">
              <p className="text-lg font-semibold mb-2">Professional:</p>
              <p className="text-xl">{professional.name}</p>
            </div>
          </div>
          <div>
            <div className="mb-6">
              <p className="text-lg font-semibold mb-2">Services:</p>
              <p className="text-xl">
                {services.map((service) => (
                  <span key={service._id}>{service.name} </span>
                ))}
              </p>
            </div>
            <div className="mb-6">
              <p className="text-lg font-semibold mb-2">Products:</p>
              <p className="text-xl">
                {products ? (
                  products.map((product) => (
                    <span key={product._id}>{product.name} </span>
                  ))
                ) : (
                  <span>-</span>
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="mb-6">
            <p className="text-lg font-semibold mb-2">Selected Date:</p>
            <div className="flex items-center">
              <FaCalendarAlt className="mr-2" />
              <p className="text-xl">{date}</p>
            </div>
          </div>
          <div className="mb-6">
            <p className="text-lg font-semibold mb-2">Selected Time:</p>
            <div className="flex items-center">
              <FaClock className="mr-2" />
              <p className="text-xl">{time}</p>
            </div>
          </div>
        </div>
        <button
          onClick={handleConfirmation}
          className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white text-xl font-medium py-4 px-8 rounded-full mt-8 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <TiTick className="mr-2" />
          Confirm
        </button>
      </div>
    </div>
  );
};

export default BookingSummary;
