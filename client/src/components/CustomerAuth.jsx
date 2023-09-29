import React, { useState } from 'react';
import CustomerSignIn from './CustomerSignIn';
import CustomerRegister from './CustomerRegister';

const CustomerAuth = ({shopId, setSignInPopup}) => {
  const [isRegistered, setIsRegistered] = useState(true);

  const toggleForm = () => {
    setIsRegistered((prevIsRegistered) => !prevIsRegistered);
  };

  return (
    <div className="flex items-center justify-center bg-gray-100">
        {isRegistered ? (
          <CustomerSignIn toggleForm={toggleForm} setSignInPopup={setSignInPopup} />
        ) : (
          <CustomerRegister toggleForm={toggleForm} shopId={shopId}/>
        )}
        
    </div>
  );
};

export default CustomerAuth;
