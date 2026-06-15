import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dirverImage from '../images/driverwheelwithhands.png';
import { FaMoneyBillAlt } from "react-icons/fa";
import { PiSeatBold } from "react-icons/pi";
import { MdDepartureBoard } from "react-icons/md";
import { BsBusFront } from "react-icons/bs";
import { FaRoute } from "react-icons/fa";
import { GiSteeringWheel } from "react-icons/gi";
import { toast } from 'react-toastify';

const CustomCloseButton = ({ closeToast }) => (
  <button onClick={closeToast} className="text-white ml-4">×</button>
);

export default function ConfirmBookings() {

  const [busDetails, setBusDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchParams = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://localhost:5000/transaction-params', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'authorization': token
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch reservation parameters');
        }

        const data = await response.json();
        setParams(data);
      } catch (error) {
        console.error('Error fetching reservation parameters:', error);
        setError(error.message);
      }
    };

    fetchParams();
  }, []);

  useEffect(() => {
    if (!params) return;

    const fetchBusDetails = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`http://localhost:5000/bus-details/${params.bus_number}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',  
            'authorization': token
          }
        });

        if (!response.ok) {
          toast.error('Failed to fetch bus details', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            className: 'bg-red-600 text-white text-lg p-4 rounded shadow-lg',
            bodyClassName: 'flex items-center',
            closeButton: CustomCloseButton,
          });
          throw new Error('Failed to fetch bus details');
        }

        const data = await response.json();
        setBusDetails(data);
      } catch (error) {
        console.error('Error fetching bus details:', error);
        setError(error.message);
      }
    };

    fetchBusDetails();
  }, [params]);

  const handleBooking = async () => {

    if (!params || !busDetails) return;

    const token = localStorage.getItem('token');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/confirm-reservation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token
        },
        body: JSON.stringify({
          // bus_number: "016",
          // route_name: "Tanke/Tipper-garage",
          // seat_number: "6",
          // departure_time: "04:00:00",
          // amount: "350",
          // reference: "T889956278822612"
        // })
          bus_number: params.bus_number,
          route_name: busDetails.route_name,
          seat_number: params.seat_number,
          departure_time: busDetails.departure_time,
          amount: busDetails.fare_amount,
          reference: busDetails.reference
        })
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          className: 'bg-red-600 text-white text-lg p-4 rounded shadow-lg',
          bodyClassName: 'flex items-center',
          closeButton: CustomCloseButton,
        });
        throw new Error('Failed to book seat');
      } else {
        toast.success(data.message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          className: 'bg-green-600 text-white text-lg p-4 rounded shadow-lg',
          bodyClassName: 'flex items-center',
          closeButton: CustomCloseButton,
        });

        setTimeout(() => {
          navigate(`/receipt/${data.reservation.reservation_id}`);
        }, 3000);
      }
    } catch (error) {
      console.error('Error booking seat:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-r from-green-400 to-blue-500 p-8">
      {error && <p className="text-red-500">{error}</p>}
      {busDetails ? (
        <div className="bg-white shadow-md rounded-lg p-10 w-full max-w-2xl space-y-6">
          <div className="flex justify-center mb-6">
            <span className="text-3xl font-bold font-chakra mr-5 text-black-700">
              <p>Confirm Booking</p>
            </span>
            <span>
              <img className="h-9 w-auto l-6" src={dirverImage} alt="driver logo" />
            </span>
          </div>
          <div className="space-y-4 font-chakra">
            <p className="flex items-center"><BsBusFront className="mr-2" /> <span className="font-bold text-gray-800">Bus Number:</span> <span className="ml-1 font-semibold">{params.bus_number}</span></p>
            <p className="flex items-center"><FaRoute className="mr-2" /> <span className="font-bold text-gray-800">Route:</span> <span className="ml-1 font-semibold">{busDetails.route_name}</span></p>
            <p className="flex items-center"><GiSteeringWheel className="mr-2" /> <span className="font-bold text-gray-800">Driver:</span> <span className="ml-1 font-semibold">{busDetails.driver_name}</span></p>
            <p className="flex items-center"><FaMoneyBillAlt className="mr-2" /> <span className="font-bold text-gray-800">Amount paid:</span> <span className="ml-1 font-semibold">₦{busDetails.fare_amount}</span></p>
            <p className="flex items-center"><MdDepartureBoard className="mr-2" /> <span className="font-bold text-gray-800">Departure Time:</span> <span className="ml-1 font-semibold">{busDetails.departure_time} PM</span></p>
            <p className="flex items-center"><PiSeatBold className="mr-2" /> <span className="font-bold text-gray-800">Seat number:</span> <span className="ml-1 font-semibold">{params.seat_number}</span></p>
          </div>
          <button 
            onClick={handleBooking} 
            disabled={loading} 
            className="w-full bg-blue-400 text-white font-chakra font-semibold py-3 px-6 rounded-lg hover:bg-blue-600 transition duration-500"
          >
            {loading ? 'Booking...' : 'Confirm Booking'}
          </button>
        </div>
      ) : (
        <p className="text-white text-lg">Loading...</p>
      )}
    </div>
  );
}
