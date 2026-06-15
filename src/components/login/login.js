import React, { useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { UserContext } from "../../userContext/userContext";
import { Checkbox, Label, TextInput } from "flowbite-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import backgroundImage from '../images/marcopolo2.png';
import frontViewBus from '../images/frontviewbus.png'; 
import { BsPersonCircle } from "react-icons/bs";
import { BsFillKeyFill } from "react-icons/bs";

const CustomCloseButton = ({ closeToast }) => (
  <button onClick={closeToast} className="text-white ml-4">×</button>
);

export default function Login () {

  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleSignupClick = () => {
    navigate('/role-selection');
  };

  const changePassword = () => {
    navigate('/password-reset');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!username || !password) {
      toast.error('Username and password are required', {
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
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        toast.error(data.error || 'Invalid credentials! 🧐' , {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          className: 'bg-red-600 text-white text-lg p-4 rounded shadow-lg',
          bodyClassName: 'flex items-center',
          closeButton: CustomCloseButton,
        });
        return;
      }
  
      localStorage.setItem('token', data.token);
      setUser({ name: data.user.name, username: data.user.username, role: data.user.role });
  
      if (data.user.role === 'driver') {
        if (data.hasBusRoute) {
          toast.success('Login successful! 🔓', {
            position: "top-right",
            autoClose: 2000,
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
            navigate('/driver-dashboard');
          }, 2000);
        } else {
          toast.success(`Let's create your bus 🚍`, {
            position: "top-right",
            autoClose: 2000,
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
            navigate('/driver/create-bus');
          }, 3000);
        }
      } else {
        toast.success('Login successful! 🔓 ', {
          position: "top-right",
          autoClose: 2000,
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
          navigate(`/${data.user.role}-dashboard/home`);
        }, 2000);
      }
    } catch (error) {
      toast.error('Error during fetch: ' + error.message, {
        position: "top-right",
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: 'bg-red-600 text-white font-chakra text-lg p-4 rounded shadow-lg',
        bodyClassName: 'flex items-center',
        closeButton: CustomCloseButton,
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="bg-white px-8 py-16 rounded shadow-md text-left w-full max-w-md md:max-w-lg lg:max-w-xl font-poppins">
        <div className="flex justify-center mb-6">
          <span className="text-2xl font-bold font-chakra mr-5 mt-1 text-black-600">
          <p>BOOKPAL</p>
          </span>
          <span>
          <img className="h-8 w-auto l-6" src={frontViewBus} alt="Booking logo" />
          </span>
        </div>
        <div>
          <h2 className="text-2xl font-bold font-chakra text-center text-gray-700">Sign in to your account</h2>
          <p className="text-gray-600 text-center mt-4 text-lg font-chakra font-semibold">
            Don't have an account?{' '}
            <a href="/role-selection" className="text-blue-500 underline font-semibold font-chakra hover:text-blue-700" onClick={handleSignupClick}>
              Sign up now
            </a>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="-space-y-1 font-chakra">
            <Label htmlFor="username" className="block text-black font-medium mb-2" value="Username"/>
            <TextInput
              id="username"
              type="text"
              required
              icon={BsPersonCircle}
              shadow
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="-space-y-1 relative font-chakra">
            <Label htmlFor="password" className="block text-black font-medium mb-2" value="Password"/>
            <TextInput
              id="password"
              type={showPassword ? "text" : "password"}
              required
              shadow
              icon={BsFillKeyFill}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute bottom-10 inset-y-0 right-0 pr-3 py-2 font-chakra text-gray-600 pt-9"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Checkbox id="remember-me"/>
              <Label htmlFor="remember-me" className="ml-2 text-sm font-chakra text-gray-600">
                Remember me
              </Label>
            </div>
            <a href="/password-reset" className="text-blue-500 underline font-chakra font-semibold hover:text-blue-700" onClick={changePassword}>
              Forgot your password?
            </a>
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 rounded-lg 
              bg-blue-500 text-sm font-chakra font-medium text-white hover:bg-blue-700 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
