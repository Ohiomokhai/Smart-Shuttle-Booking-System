import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { jwtDecode }from 'jwt-decode';
import { toast } from 'react-toastify';

const CustomCloseButton = ({ closeToast }) => (
  <button onClick={closeToast} className="text-white ml-4">×</button>
);

export default function ReserveSeat() {

  const { bus_number } = useParams();
  const [seats, setSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSeats = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      const decodedToken = jwtDecode(token);
      const userId = decodedToken.user_id;

      try {
        const response = await fetch(`http://localhost:5000/bus-seats/${bus_number}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'authorization': token
          }
        });

        const data = await response.json();

        const bookedResponse = await fetch(`http://localhost:5000/booked-seats/${bus_number}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'authorization': token
          }
        });

        const bookedData = await bookedResponse.json();
        
        // const bookedSeats = Array.isArray(bookedData.bookedSeats) ? bookedData.bookedSeats : [];

        const bookedSeat = bookedData.bookedSeats 

        // app.get('/bus-seats/:bus_number', async (req, res) => {
        //   const { bus_number } = req.params;
        //   const user_id = req.user.id; // Assuming you have middleware to get the user from the token
        
        //   try {
        //     const seats = await db('seats')
        //       .join('reservations', 'seats.seat_id', '=', 'reservations.seat_id')
        //       .join('buses', 'reservations.bus_id', '=', 'buses.bus_id')
        //       .select('seats.seat_id', 'seats.seat_number', 'seats.status', 'reservations.user_id')
        //       .where('buses.bus_number', bus_number);
        
        //     const updatedSeats = seats.map(seat => ({
        //       ...seat,
        //       status: seat.user_id === user_id ? 'booked' : seat.status
        //     }));
        
        //     res.status(200).json(updatedSeats);
        //   } catch (err) {
        //     console.error(err.message);
        //     res.status(500).json({ message: 'Server error' });
        //   }
        // });

        const sortedData = data.sort((a, b) => a.seat_number - b.seat_number);

        const seatUpdate = sortedData.map((seat) => {

          let seatClass = 'w-12 h-12 flex items-center justify-center text-base cursor-pointer border rounded-lg ';

          // const seatBooked = bookedSeat.find(booked => booked.seat_number === seat.seat_number);

          if (bookedSeat) {
            if (bookedSeat.user_id === userId && bookedSeat.status === 'booked') {
              seatClass += 'bg-blue-500 border-blue-600'; 
              seat.status = 'booked';
            } else if (bookedSeat.user_id !== userId && bookedSeat.status === 'booked'){
              seatClass += 'bg-green-500 border-green-600';
              seat.status = 'booked';
            }
          } else {
            seatClass += seat.status === 'available' ? 
              'bg-gray-400 border-gray-500 hover:bg-gray-300' : 
              'bg-red-500 border-red-600';
          }

          return {
            ...seat,
            seatClass
          };
        });

        setSeats(seatUpdate);
      } catch (error) {
        console.error('Error fetching seat data:', error);
      }
    };

    fetchSeats();

    const intervalId = setInterval(fetchSeats, 1000);

    return () => clearInterval(intervalId);
  }, [bus_number]);

  const handleSeatClick = (seat) => {
    if (seat.status === 'available') {
      setSelectedSeat(seat.seat_number);
    }
  };

  const handlePayment = () => {
    toast.success('You selected a seat to proceed payment', {
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
      navigate(`/payment/${bus_number}/${selectedSeat}`);
    }, 2000);
  };

  return (
    <div className="bg-gradient-to-r from-green-400 to-blue-500 min-h-screen flex items-center justify-center">
      <div className="p-10 mt-10 max-w-7xl h-auto mx-auto bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-center font-chakra">Book a Seat</h2>
        <div className="flex gap-4 mb-4 justify-center font-chakra">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-400 border border-gray-500 rounded-lg"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-500 border border-green-600 rounded-lg"></div>
            <span>Booked (Other Users)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-500 border border-blue-600 rounded-lg"></div>
            <span>Booked (You)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-500 border border-red-600 rounded-lg"></div>
            <span>Broken</span>
          </div>
        </div>
        <div className="grid ml-8 grid-cols-4 gap-4">
          {seats.length > 0 ? (
            seats.map((seat) => (
              <div
                key={seat.seat_id}
                className={`w-12 h-12 flex items-center justify-center text-base cursor-pointer font-chakra border mt-3 rounded-lg ${seat.seatClass}`}
                onClick={() => handleSeatClick(seat)}
              >
                {seat.seat_number}
              </div>
            ))
          ) : (
            <div>No seats available</div>
          )}
        </div>
        <div className="flex justify-center mt-7">
          <button
            className="px-4 py-2 bg-blue-500 font-chakra text-white rounded disabled:bg-gray-400"
            onClick={handlePayment}
            disabled={!selectedSeat}
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
}
