import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGraduate, faUserTie, faCar } from '@fortawesome/free-solid-svg-icons';
// import { CgProfile } from "react-icons/cg";
import { PiUserSwitchDuotone } from "react-icons/pi";
import { RiUserSharedLine } from "react-icons/ri";

const RoleSelection = ({ onSelectRole }) => {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    navigate(`/signup/${role}`);
    onSelectRole(role);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-green-400 to-blue-500 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 sm:p-10 lg:p-16 w-full max-w-lg md:max-w-2xl">
      <h2 className="flex items-center justify-center text-2xl font-bold font-chakra text-black-700">
  SELECT PROFILE 
  <PiUserSwitchDuotone className="ml-2" />
</h2>
        <br />
        <p className="flex items-center justify-center font-chakra font-semibold mb-10 text-lg text-center">
  Please choose your profile to proceed 
  <RiUserSharedLine className="ml-2" />
</p> 
        <div className="flex flex-col lg:flex-row lg:space-x-6 space-y-6 lg:space-y-0">
          <button
            className="flex-1 py-4 px-6 bg-transparent text-blue-500 border border-blue-500 
            font-medium font-chakra rounded-lg hover:bg-blue-100 text-lg focus:outline-none focus:ring-2 
            focus:ring-blue-500 flex items-center justify-center space-x-2 transition-all duration-100"
            onClick={() => handleRoleSelect('student')}
          >
            <FontAwesomeIcon icon={faUserGraduate} size="m" />
            <span>Student</span>
          </button>

          <button
            className="flex-1 py-4 px-6 bg-transparent text-blue-500 border border-blue-500
             font-medium font-chakra rounded-lg hover:bg-blue-100 text-lg focus:outline-none focus:ring-2 
             focus:ring-blue-500 flex items-center justify-center space-x-2 transition-all duration-100"
            onClick={() => handleRoleSelect('staff')}
          >
            <FontAwesomeIcon icon={faUserTie} size="m" />
            <span>Staff</span>
          </button>

          <button
            className="flex-1 py-4 px-6 bg-transparent text-blue-500 border border-blue-500 
            font-medium font-chakra rounded-lg hover:bg-blue-100 text-lg focus:outline-none focus:ring-2 
            focus:ring-blue-500 flex items-center justify-center space-x-2 transition-all duration-100"
            onClick={() => handleRoleSelect('driver')}
          >
            <FontAwesomeIcon icon={faCar} size="m" />
            <span>Driver</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
