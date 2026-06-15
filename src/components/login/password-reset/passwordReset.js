import { TextInput, Checkbox, Label } from 'flowbite-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function ChangePassword() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const passwordSuccess = () => {
    navigate('/password-success');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordsMatch(false);
      return;
    }
    // Implement logic to change password here
    console.log('Email:', email);
    console.log('New Password:', newPassword);
    console.log('Confirm Password:', confirmPassword);
    passwordSuccess();
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-md px-8 py-12 p-10 md:p-14 w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6">Reset Password</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="mb-2 block">
            <Label htmlFor="email" value="Email" />
            <TextInput
              type="email"
              id="email"
              placeholder="User@gmail.com"
              shadow
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-2 block">
            <Label htmlFor="newPassword" value="New Password" />
            <div className="relative">
              <TextInput
                type={showPassword ? 'text' : 'password'}
                id="newPassword"
                placeholder="New Password"
                shadow
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 px-3 py-2 text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>
          <div className="mb-2 block">
            <Label htmlFor="confirmPassword" value="Confirm Password" />
            <div className="relative">
              <TextInput
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                placeholder="Confirm Password"
                shadow
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 px-3 py-2 text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>
          {!passwordsMatch && (
            <div className="text-red-500 text-sm mb-2">Passwords do not match</div>
          )}
          <div className="flex item-center gap-2">
            <Checkbox
              id="agree"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
            />
            <Label htmlFor="agree" className="flex">
              I agree with the&nbsp;
              <a href="#" className="text-cyan-600 hover:underline dark:text-cyan-500">
                terms and conditions
              </a>
            </Label>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 transparent text-blue-500 border border-blue-500 font-medium
            rounded-lg hover:bg-blue-100 text-sm focus:outline-none focus:ring-2
            focus:ring-blue-500 flex items-center justify-center space-x-2 transition-all duration-300 cursor-pointer"
            disabled={!email || !newPassword || !confirmPassword || !acceptedTerms}
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;
