import { TextInput, Label, Checkbox } from 'flowbite-react';
import { Select } from 'flowbite-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsBusFront } from "react-icons/bs";
import { FaRoute } from "react-icons/fa";
import driverWheelImage from "../images/driverwheelwithhands.png"
// import { GiMoneyStack } from "react-icons/gi"; //money bundle icon
// import { GiTakeMyMoney } from "react-icons/gi"; //take money iocn
// import { FaRegMoneyBill1 } from "react-icons/fa6"; // money icon 2
import { FaMoneyBillAlt } from "react-icons/fa";
import { PiSeatBold } from "react-icons/pi";
// import { GiCarSeat } from "react-icons/gi"; //driver wheel icon
import { MdDepartureBoard } from "react-icons/md";
import { toast } from 'react-toastify';

const CustomCloseButton = ({ closeToast }) => (
  <button onClick={closeToast} className="text-white ml-4">×</button>
);

export default function CreateBus () {

  const [busNumber, setBusNumber] = useState('');
  const [seatCapacity, setSeatCapacity] = useState('');
  const [routeName, setRouteName] = useState('');
  const [fareAmount, setFareAmount] = useState('');
  const[departureTime, setDepartureTime] = useState('');
  
  const navigate = useNavigate();

  const handleBusSubmit = async (e) => {

    e.preventDefault();

    const token = localStorage.getItem('token');

    const response = await fetch('http://localhost:5000/driver/create-bus', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'authorization': token, 
      },
      body: JSON.stringify(
        {
        bus_number: busNumber,
        route_name: routeName,
        fare_amount: fareAmount, 
        seat_capacity: seatCapacity,
        departure_time: departureTime
      }
    )
    });

    const data = await response.json();

    if (response.ok) {
      toast.success(`Welcome ${data.message}`  , {
        position: "top-right",
        autoClose: 5000,
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
        navigate('/driver-dashboard');
      }, 1000);
    } else {
      alert('Error creating bus');
    }
  };

return (

    <div className="flex justify-center items-center w-screen h-screen bg-gradient-to-r from-green-400 to-blue-500">
      <div className="bg-white rounded-lg shadow-md px-8 py-12 p-10 md:p-14 w-full max-w-lg">
        <div className="flex justify-center mb-6">
          <span className="text-3xl font-bold font-chakra mr-5 text-black-700">
            <p>Create Bus</p>
          </span>
          <span>
            <img className="h-8 w-auto l-6" src={driverWheelImage} alt="Booking logo" />
          </span>
        </div>
        {/* <h1 className="text-2xl font-bold text-center text-gray-700 mb-6">Create Bus</h1> */}
        
        <form onSubmit={handleBusSubmit} className="flex flex-col gap-2">
          <div className="mb-2 block font-chakra">
            <Label htmlFor="bus number" value="Bus Number" />
            <TextInput
              type="text"
              id="Bus Number"
              placeholder="Bus Number"
              icon={BsBusFront}
              value={busNumber}
              onChange={(e) => setBusNumber(e.target.value)}    
              required
              shadow
            />
          </div>

          <div className="max-w-md font-chakra">
            <div className="mb-2 block">
              <Label htmlFor="route_name" value="Route Name" />
            </div>
            <Select id="route_name" 
            required 
            shadow 
            icon={FaRoute}
            value={routeName} 
            onChange={(e) => setRouteName(e.target.value)} 
            >
              <option>Unigate</option>
              <option>Unigate/Stella-Maris/Total/Oke-odo</option>
              <option>Oke-odo/Sanrab</option>
              <option>Tanke/Tipper-garage</option>
              <option>Termius</option>
              <option>Post-office/Challenge</option>
              <option>Taiwo</option>
              <option>Stella-Maris</option>
              <option>Oke-odo</option>
              <option>Tanke</option>
              <option>Tipper-garage</option>
              <option>Sanrab</option>
            </Select>
          </div>

          <div className="mb-2 block font-chakra">
            <Label htmlFor="price" value="Price"/>
            <TextInput 
              type="number" 
              id="price" 
              icon={FaMoneyBillAlt}
              value={fareAmount} 
              onChange={(e) => setFareAmount(e.target.value)} 
              required 
              shadow
              />
          </div>

          <div className="mb-2 block font-chakra">
            <Label htmlFor="capacity" value="Seat Capacity" />
            <TextInput
            type="number"
            id="capacity"
            icon={PiSeatBold}
            placeholder="Bus Capacity"
            value={seatCapacity}
            onChange={(e) => setSeatCapacity(e.target.value)} 
            required
            shadow
            />
            </div>   

            <div className="mb-2 block font-chakra">
              <Label htmlFor="departure-time" value="Departure Time"/>
              <TextInput 
              type="time" 
              id="departure-time" 
              icon={MdDepartureBoard}
              value={departureTime} 
              onChange={(e) => setDepartureTime(e.target.value)} 
              required 
              shadow/>
          </div>

          <div className="flex items-center font-chakra gap-2 mb-4">
            <Checkbox id="agree" required />
            <Label htmlFor="agree" className="flex">
              I agree with the&nbsp;
              <a href="#" className="text-cyan-600 hover:underline dark:text-cyan-500">
                terms and conditions
              </a>
            </Label>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-400 text-white font-medium rounded-lg 
            hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
            focus:ring-blue-500 text-sm font-chakra transition-all duration-300"
            >  
            Create Bus
          </button>
        </form>
    </div>
</div>
)}

  