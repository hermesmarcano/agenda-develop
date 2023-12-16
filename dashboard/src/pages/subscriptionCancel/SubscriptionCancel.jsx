import React from "react";
import { BsExclamationCircle } from "react-icons/bs";

const SubscriptionCancel = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      <div className='p-8 bg-white rounded shadow-md w-full max-w-md mx-auto'>
        <BsExclamationCircle className='w-16 h-16 mx-auto text-red-500'/>
        <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
          Something Went Wrong
        </h2>
        <a 
          href="/" 
          className='mt-8 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-xl font-medium text-white bg-red-600 hover:bg-red-700'
        >
          Go To Homepage
        </a>
      </div>
    </div>
  );
};

export default SubscriptionCancel;
