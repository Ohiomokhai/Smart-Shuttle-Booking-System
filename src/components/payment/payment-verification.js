import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const CustomCloseButton = ({ closeToast }) => (
  <button onClick={closeToast} className="text-white ml-4">×</button>
);

const PaymentVerification = () => {
  
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { reference } = useParams();

  useEffect(() => {
    if (!reference) {
      setMessage("Missing reference ID");
      setLoading(false);
    } else {
      handlePaymentVerification(reference);
    }
  }, [reference]);

  const handlePaymentVerification = async (reference) => {

    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://localhost:5000/verify-payment/${reference}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token,
        }
      });

      const data = await response.json();

      if (response.ok && data.message === 'Payment verified successfully') {
        setMessage('Payment verified successfully');
        setLoading(false);
        toast.success(data.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          className: 'bg-green-600 text-white font-chakra text-lg p-4 rounded shadow-lg',
          bodyClassName: 'flex items-center',
          closeButton: CustomCloseButton,
        });
      
        setTimeout(() => {
          navigate('/payment-success')
        }, 4000);
      } else {
        toast.error('Try again!', {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          className: 'bg-red-600 text-white font-chakra text-lg p-4 rounded shadow-lg',
          bodyClassName: 'flex items-center',
          closeButton: CustomCloseButton,
        });    
        setMessage('Payment verification failed');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      setMessage('Error verifying payment');
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen bg-gradient-to-r from-green-400 to-blue-500">
      <div className="bg-gray-200 rounded-lg shadow-md px-8 py-12 md:p-14 w-full max-w-2xl font-chakra text-center">
        <h2 className="text-2xl font-semibold mb-4 text-grey-800">Verifying Payment...</h2>
        {loading ? (
          <div className="flex justify-center items-center mt-6">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          </div>
        ) : (
          <div className="mt-6 bg-blue-400 p-4 font-chakra rounded shadow">
            <p className="text-lg text-white">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentVerification;
