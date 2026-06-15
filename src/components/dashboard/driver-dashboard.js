import React, { useState, useEffect, useContext } from "react";
import { UserContext } from '../../userContext/userContext';
import { Drawer, Sidebar, Avatar, Dropdown, Navbar } from "flowbite-react";
import { BsBusFront, BsBell, BsPersonGear, BsInfoCircle, BsPersonCircle  } from "react-icons/bs";
import { Routes, Route, Navigate } from "react-router-dom";
import { AiOutlineLogout, AiOutlineMenu } from "react-icons/ai";
import { BiHome } from "react-icons/bi";
import Home from '../menu/home';
import Notification from '../menu/notification';
import Profile from '../menu/profile';
import Help from '../menu/help';
import Settings from '../menu/settings';
import Compliant from '../menu/compliant';
import BusManagement from '../menu/bus management';
import busviewfront from '../images/frontviewbus.png'
import { GrTransaction } from "react-icons/gr";

export default function DashboardDriver() {

  const { user } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleclose = () => {
    setIsOpen(false);
  };

  return (
    <>
    <Routes>
      <Route path="/" element={<Navigate to="/driver-dashboard/home" replace />} />
        <Route path="/student-dashboard/home" element={<Home/>} />
        <Route path="/student-dashboard/bookings" element={<BusManagement/>} />
        <Route path="/student-dashboard/notification" element={<Notification/>} />
        <Route path="/student-dashboard/compliant" element={<Compliant/>} />
        <Route path="/student-dashboard/help" element={<Help/>} />
        <Route path="/student-dashboard/profile" element={<Profile/>} />
        <Route path="/student-dashboard/settings" element={<Settings/>} />
    </Routes>

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
                <Navbar.Link href="/bookings" className="flex items-center mr-4 text-black">
                  <BsBusFront className="h-5 w-5 mr-2" />
                  Bookings
                </Navbar.Link>
                <Navbar.Link href="/complaints" className="flex items-center mr-4 text-black">
                  <GrTransaction className="h-5 w-5 mr-2" />
                  Transaction
                </Navbar.Link>
              </Navbar.Collapse>
            </div>
            <div className="flex items-center font-chakra">
              <BsBell className="h-6 w-6 mr-3 mt-2 cursor-pointer" />
              <Dropdown
                arrowIcon={false}
                inline
                label={
                  <Avatar
                    alt="Account"
                    img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                    // placeholderInitials="RR"
                    className="cursor-pointer mt-1 ml-2"
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
              <h1 className="text-3xl font-bold font-chakra text-gray-800">Welcome {user?.name}</h1>
              <h3 className="text-lg text-gray-600 font-chakra mt-2">Let's Manage your Passengers and Bus</h3>
            </div>
          </div>
      </div>
      ) : (
        <AiOutlineMenu
          variant="text"
          size="small medium"
          className="h-8 w-8 rounded-lg fixed top-2 left-3 cursor-pointer stroke-2 hover:bg-grey-500"
          onClick={() => setIsOpen(true)}
        />
      )}
      <Drawer open={isOpen} onClose={handleclose}>
        <Drawer.Header titleIcon={() => 
        <>
        <Sidebar className="[&>div]:bg-transparent [&>div]:p-0">
          <Sidebar.Items>
            <Sidebar.ItemGroup>
              <div className="flex flex-wrap gap-2">
                <Avatar img="https://flowbite.com/docs/images/people/profile-picture-5.jpg" size="lg" className="cursor-pointer mt-2 ml-2" rounded bordered color="gray" status="online" statusPosition="bottom-right"/>
              </div>
              <span className="block ml-2 text-sm font-bold">Bonnie Green</span>
              <span className="block ml-2 truncate text-sm font-medium font-bold">@USERNAME</span>
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </Sidebar>
        </>
      } />
        <Drawer.Items>
          <Sidebar className="[&>div]:bg-transparent [&>div]:p-0">
            <div className="flex h-screen flex-col justify-between py-2">
                <Sidebar.Items>
                  <Sidebar.ItemGroup>
                    <Sidebar.Item href="/driver-dashboard/home" icon={BiHome}>Home</Sidebar.Item>
                    <Sidebar.Item href="/driver-dashboard/bus-management" icon={BsBusFront}>Bus Management</Sidebar.Item>
                    <Sidebar.Item href="/driver-dashboard/notification" icon={BsBell}>Notification</Sidebar.Item>
                    <Sidebar.Item href="/staff-dashboard/complaints">Complaints</Sidebar.Item>
                    <Sidebar.Item href="/staff-dashboard/help" icon={BsInfoCircle}>Help</Sidebar.Item>
                  </Sidebar.ItemGroup>
                  <Sidebar.ItemGroup>
                    <Sidebar.Item href="/staff-dashboard/profile" icon={ BsPersonCircle}>Profile</Sidebar.Item>
                    <Sidebar.Item href="/staff-dashboard/settings" icon={BsPersonGear }>Settings</Sidebar.Item>
                    <Sidebar.Item href="/login" icon={AiOutlineLogout} className="hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10">Logout</Sidebar.Item>
                  </Sidebar.ItemGroup>
                </Sidebar.Items>
                {/* Rest of the original code remains the same */}
            </div>
          </Sidebar>
        </Drawer.Items>
      </Drawer>
    </>
  );
}

