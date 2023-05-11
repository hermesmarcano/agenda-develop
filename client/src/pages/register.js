import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import instance from "../axiosConfig/axiosConfig";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const params = useParams();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Name:", name);
    console.log("Phone:", phone);
    instance
      .get(`/managers/shopname?urlSlug=${params.id}`)
      .then((response) => {
        instance
          .post("/customers", {
            name: name,
            phone: phone,
            shopName: response.data.shopName,
          })
          .then((response) => {
            console.log(response);
            navigate(`/shops/${params.id}/`);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });

    // Implement logic to register the client
    // Redirect to the home page
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-5xl font-extrabold mb-8 text-gray-900">Register</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md"
      >
        <div className="mb-4">
          <label htmlFor="name" className="text-lg font-semibold">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-gray-400 border-solid border-2 rounded-md p-2 w-full mt-2"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="phone" className="text-lg font-semibold">
            Phone
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border-gray-400 border-solid border-2 rounded-md p-2 w-full mt-2"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xl font-medium py-4 px-8 rounded-full mt-8 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Register
        </button>
        <div className="mt-4">
          Already have an account?{" "}
          <Link to="/signin" className="text-indigo-600 hover:text-indigo-800">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
