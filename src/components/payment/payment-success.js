import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
  
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/confirm-booking');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex justify-center items-center w-screen h-screen bg-gradient-to-r from-green-400 to-blue-500 text-white">
      <div className="bg-white rounded-lg shadow-md px-8 py-12 md:p-14 w-full max-w-2xl text-center">
        <div className="flex flex-col font-chakra items-center">
          <span className="text-6xl mb-4">🎉</span>
          <h2 className="text-3xl font-semibold mb-2 text-blue-700">Payment Successful!</h2>
          <p className="text-lg mb-6 text-gray-700">Thank you for your payment. You will be redirected shortly to confirm your bookings.</p>
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
