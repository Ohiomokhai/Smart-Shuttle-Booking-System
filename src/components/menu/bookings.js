import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function Bookings () {

  const { user_id } = useParams();

  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [previousBookings, setPreviousBookings] = useState([]);

  useEffect(() => {
    
    const fetchBookings = async () => {
      try {
        const response = await fetch(`/booking-history/${user_id}`);
        const data = await response.json();
        setUpcomingBookings(data.upcomingBookings);
        setPreviousBookings(data.previousBookings);
      } catch (error) {
        console.error('Error fetching booking history:', error);
      }
    };

    fetchBookings();
  }, [user_id]);

  const handleCancel = async (reservation_id, departure_time) => {
    const currentTime = new Date();
    const departureTime = new Date(departure_time);
    const timeDifference = (departureTime - currentTime) / 60000; 

    if (timeDifference <= 5) {
      console.error('Cannot cancel booking within 5 minutes of departure');
      return;
    }

    try {
      const response = await fetch('/cancel-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservation_id })
      });

      if (response.ok) {
        setUpcomingBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking.reservation_id === reservation_id ? { ...booking, status: 'canceled' } : booking
          )
        );
      } else {
        console.error('Error canceling booking');
      }
    } catch (error) {
      console.error('Error canceling booking:', error);
    }
  };

  return (
    <div>
      <h2>Bookings </h2>
      <h3>Upcoming Bookings</h3>
      {upcomingBookings.map((booking) => (
        <div key={booking.reservation_id}>
          <p>Bus Number: {booking.bus_number}</p>
          <p>Route: {booking.route_name}</p>
          <p>Departure Time: {new Date(booking.departure_time).toLocaleString()}</p>
          <p>Amount: {booking.amount}</p>
          <p>Status: {booking.status}</p>
          <p>Date: {new Date(booking.reservation_date).toLocaleString()}</p>
          {booking.status === 'active' && (
            <button onClick={() => handleCancel(booking.reservation_id, booking.departure_time)}>Cancel Booking</button>
          )}
        </div>
      ))}

      <h3>Previous Bookings</h3>
      {previousBookings.map((booking) => (
        <div key={booking.reservation_id}>
          <p>Bus Number: {booking.bus_number}</p>
          <p>Route: {booking.route_name}</p>
          <p>Departure Time: {new Date(booking.departure_time).toLocaleString()}</p>
          <p>Amount: {booking.amount}</p>
          <p>Status: {booking.status}</p>
          <p>Date: {new Date(booking.reservation_date).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};


