import React, { useState, useEffect, useContext } from "react";
import { UserContext } from '../../userContext/userContext';
import { Drawer, Sidebar, Avatar, Dropdown, Navbar } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { BsBusFront, BsBell, BsPersonGear, BsInfoCircle, BsPersonCircle } from "react-icons/bs";
import { AiOutlineLogout, AiOutlineMenu } from "react-icons/ai";
import { BiHome } from "react-icons/bi";
import { FaMoneyBillAlt, FaRoute } from "react-icons/fa";
import { PiSeatBold } from "react-icons/pi";
import { MdDepartureBoard } from "react-icons/md";
import { GiSteeringWheel } from "react-icons/gi";
import { toast } from 'react-toastify';
import busviewfront from '../images/frontviewbus.png'

export default function DashboardStaff() {

  const { user } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 768);
  const [buses, setBuses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const response = await fetch('http://localhost:5000/available-buses');
        const data = await response.json();
        setBuses(data);
      } catch (error) {
        toast.error("Failed to fetch bus data", {
          position: "top-right",
          autoClose: 5000,
        });
      }
    };

    fetchBuses();
    const intervalId = setInterval(fetchBuses, 2000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleClose = () => setIsOpen(false);

  const renderBuses = () => (
    <div className="mt-6">
      <div className={`grid gap-4 ${isLargeScreen ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
        {buses.map(bus => (
          <div key={bus.bus_number} className="border rounded p-4 font-chakra shadow-lg bg-white">
            <p className="flex items-center"><GiSteeringWheel className="mr-2" /> <strong>Driver Name:</strong> <span className="ml-1 font-semibold">{bus.driver_name}</span></p>
            <p className="flex items-center"><BsBusFront className="mr-2" /> <strong>Bus Number:</strong> <span className="ml-1 font-semibold">{bus.bus_number}</span></p>
            <p className="flex items-center"><FaRoute className="mr-2" /> <strong>Route:</strong> <span className="ml-1 font-semibold">{bus.route}</span></p>
            <p className="flex items-center"><FaMoneyBillAlt className="mr-2" /> <strong>Price:</strong> <span className="ml-1 font-semibold">₦{bus.fare_amount}</span></p>
            <p className="flex items-center"><PiSeatBold className="mr-2" /> <strong>Capacity:</strong> <span className="ml-1 font-semibold">{bus.seat_capacity}</span></p>
            <p className="flex items-center"><MdDepartureBoard className="mr-2" /> <strong>Departure Time:</strong> <span className="ml-1 font-semibold">{bus.departure_time} PM</span></p>
            <button
              className="mt-2 py-1 px-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => navigate(`/bus-seats/${bus.bus_number}`)}
            >
              Book a Seat
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {isLargeScreen ? (
        <div className="min-h-screen bg-gray-100">
          <Navbar className="h-20 flex shadow rounded items-center justify-between px-4 bg-gradient-to-r from-green-400 to-blue-500 text-black">
            <Navbar.Brand href="https://flowbite-react.com">
              <img src={busviewfront} className="mr-3 h-6 sm:h-9" alt="Bookpal Logo" />
              <span className="self-center whitespace-nowrap text-xl font-semibold font-chakra dark:text-white">BOOKPAL</span>
            </Navbar.Brand>
            <div className="flex items-center font-chakra">
              <Navbar.Collapse>
                <Navbar.Link href="/home" className="flex items-center mr-4 text-black">
                  <BiHome className="h-6 w-6 mr-2" />
                  Home
                </Navbar.Link>
                <Navbar.Link href="/staff-dashboard/bookings" className="flex items-center mr-4 text-black">
                  <BsBusFront className="h-5 w-5 mr-2" />
                  Bookings
                </Navbar.Link>
                <Navbar.Link href="/complaints" className="flex items-center mr-4 text-black">
                  <BsInfoCircle className="h-5 w-5 mr-2" />
                  Booking Recepit
                </Navbar.Link>
              </Navbar.Collapse>
            </div>
            <div className="flex items-center font-chakra">
              <BsBell className="h-6 w-6 mr-4 cursor-pointer" />
              <Dropdown
                arrowIcon={false}
                inline
                label={
                  <Avatar
                    alt="Account"
                    img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                    className="cursor-pointer mt-2 ml-2"
                    rounded
                    bordered
                    color="gray"
                    status="online"
                    statusPosition="bottom-right"
                  />
                }
              >
                <Dropdown.Header>
                  <>
                    <span className="block text-sm font-bold">{user?.name}</span>
                    <span className="block truncate text-sm font-medium">{user?.username}</span>
                  </>
                </Dropdown.Header>
                <Dropdown.Item href="/profile" icon={BsPersonCircle}>
                  Profile
                </Dropdown.Item>
                <Dropdown.Item href="/settings" icon={BsPersonGear}>
                  Settings
                </Dropdown.Item>
                <Dropdown.Item href="/help" icon={BsInfoCircle}>
                  Help
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item
                  href="/login"
                  className="hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
                  icon={AiOutlineLogout}
                >
                  Logout
                </Dropdown.Item>
              </Dropdown>
            </div>
          </Navbar>
          <div className="mt-8 px-4">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold font-chakra text-gray-800">WELCOME {user?.name}</h1>
              <h3 className="text-lg text-gray-600 font-chakra mt-2">Let's reserve a seat!</h3>
            </div>
            <h2 className="text-2xl mb-4 text-center font-chakra text-gray-800">View Available Buses</h2>          
            {renderBuses()}
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-400 to-blue-500 text-white">
            <AiOutlineMenu
              variant="text"
              size="small medium"
              className="h-8 w-7 cursor-pointer hover:bg-grey"
              onClick={() => setIsOpen(true)}
            />
            <div className="flex items-center">
              <img src={busviewfront} className="r-7 h-6 sm:h-9 mr-2" alt="Bookpal Logo" />
              <span className="self-center whitespace-nowrap text-xl font-semibold font-chakra text-black">BOOKPAL</span>
          </div>
          </div>
          <div className="overflow-y-auto h-screen px-4 py-6 bg-gray-100">
            <div className="text-center font-chakra mb-6">
              <h2 className="text-3xl font-bold text-gray-800">WELCOME {user?.name}</h2>
              <h3 className="text-lg text-gray-600 font-chakra mt-2">Let's reserve a seat!</h3>
            </div>
            <h2 className="text-2xl mb-4 text-center font-chakra text-gray-800">View Available Buses</h2>
            {renderBuses()}
          </div>
        </>
      )}

      <Drawer open={isOpen} onClose={handleClose}>
        <Drawer.Header
          titleIcon={() => (
            <>
              <Sidebar className="[&>div]:bg-transparent [&>div]:p-0">
                <Sidebar.Items>
                  <Sidebar.ItemGroup>
                    <div className="flex flex-wrap gap-2">
                      <Avatar
                        img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                        size="lg"
                        className="cursor-pointer mt-2 ml-2"
                        rounded
                        bordered
                        color="gray"
                        status="online"
                        statusPosition="bottom-right"
                      />
                    </div>
                    <>
                      <span className="block ml-2 text-sm font-bold">{user?.name}</span>
                      <span className="block ml-2 truncate text-sm font-medium font-bold">{user?.username}</span>
                    </>
                  </Sidebar.ItemGroup>
                </Sidebar.Items>
              </Sidebar>
            </>
          )}
        />
        <Drawer.Items>
          <Sidebar className="[&>div]:bg-transparent [&>div]:p-0">
            <div className="flex h-screen flex-col justify-between font-chakra py-2">
              <Sidebar.Items>
                <Sidebar.ItemGroup>
                  <Sidebar.Item href="/home" icon={BiHome} className="text-gray">
                    Home
                  </Sidebar.Item>
                  <Sidebar.Item href="/bookings" icon={BsBusFront} className="text-gray">
                    Bookings
                  </Sidebar.Item>
                  <Sidebar.Item href="/notification" icon={BsBell} className="text-gray">
                    Notification
                  </Sidebar.Item>
                  <Sidebar.Item href="/complaints" icon={BsInfoCircle} className="text-gray">
                    Complaints
                  </Sidebar.Item>
                  <Sidebar.Item href="/help" icon={BsInfoCircle} className="text-gray">
                    Help
                  </Sidebar.Item>
                </Sidebar.ItemGroup>
                <Sidebar.ItemGroup>
                  <Sidebar.Item href="/profile" icon={BsPersonCircle} className="text-gray">
                    Profile
                  </Sidebar.Item>
                  <Sidebar.Item href="/settings" icon={BsPersonGear} className="text-gray">
                    Settings
                  </Sidebar.Item>
                  <Sidebar.Item
                    href="/login"
                    icon={AiOutlineLogout}
                    className="hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10 text-gray"
                  >
                    Logout
                  </Sidebar.Item>
                </Sidebar.ItemGroup>
              </Sidebar.Items>
            </div>
          </Sidebar>
        </Drawer.Items>
      </Drawer>
    </>
  );
}
