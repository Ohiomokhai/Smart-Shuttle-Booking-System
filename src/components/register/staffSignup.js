import React, { useState } from "react";
import { Checkbox, Label, TextInput } from "flowbite-react";
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { BsPersonCircle, BsFillKeyFill, BsFillEnvelopeAtFill } from "react-icons/bs";
import { AiOutlineUser } from "react-icons/ai";
import { FaIdCardAlt } from "react-icons/fa";
import { toast } from 'react-toastify';
import { RiUserSmileLine } from "react-icons/ri";


const CustomCloseButton = ({ closeToast }) => (
  <button onClick={closeToast} className="text-white ml-4">×</button>
);

export default function StaffSignup() {

  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [employeeIdNumber, setEmployeeIdNumber] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch('http://localhost:5000/signup/staff', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, username, email, password, employee_id_number: employeeIdNumber }),
    });

    const data = await response.json();

    if (response.ok) {
      toast.success('You are successfully signed up a staff', {
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
        navigate('/');
      }, 2000);
      console.log('Signup successful');
    } else {
      console.error('Failed to sign up:', data);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-green-400 to-blue-500 p-4">
      <div className="bg-white rounded-lg shadow-md px-8 py-12 p-10 md:p-14 w-full max-w-lg md:max-w-2xl max-h-full md:max-h-screen">
        <h1 className="text-2xl font-bold font-chakra text-center text-gray-700">SIGN UP AS A STAFF</h1><br />
        <p className="flex items-center justify-center text-center mb-9 font-semibold font-chakra text-xl text-black">
  Please fill your details below 
  <RiUserSmileLine className="ml-2 mt-1" />
</p>

        <form className="flex flex-col" onSubmit={handleSubmit}>
          <div className="mb-2 font-chakra">
            <Label htmlFor="name" className="block text-black-700 font-medium mb-2" value="Name" />
            <TextInput
              id="name"
              type="text"
              placeholder="Enter full name"
              required
              icon={AiOutlineUser}
              shadow
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mb-2 font-chakra">
            <Label htmlFor="username" className="block text-black-700 font-medium mb-2" value="Username" />
            <TextInput
              id="username"
              type="text"
              placeholder="Enter username"
              icon={BsPersonCircle}
              required
              shadow
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="mb-2 font-chakra">
            <Label htmlFor="email" className="block text-black-700 font-medium mb-2" value="Email" />
            <TextInput
              id="email"
              type="email"
              placeholder="Enter your email"
              required
              icon={BsFillEnvelopeAtFill}
              shadow
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative mb-2 font-chakra">
            <Label htmlFor="password" className="block text-black-700 font-medium mb-2" value="Password" />
            <TextInput
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              required
              icon={BsFillKeyFill}
              shadow
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-black-600 mt-7"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="mb-4 font-chakra">
            <Label htmlFor="special" className="block text-black-700 font-medium mb-2" value="Employee ID Number" />
            <TextInput
              id="special"
              type="text"
              placeholder="Enter ID number"
              required
              icon={FaIdCardAlt}
              shadow
              value={employeeIdNumber}
              onChange={(e) => setEmployeeIdNumber(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 mb-3 font-chakra">
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
            className="w-full px-4 py-2 bg-blue-500 text-white font-medium rounded-lg 
            hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
            focus:ring-blue-500 text-sm font-chakra transition-all duration-300"
          >
            Create account
          </button>
        </form>
      </div>
    </div>
  );
}
