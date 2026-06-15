import React from "react";
import { useNavigate } from "react-router-dom";

const PasswordSuccess = () => {
    const navigate = useNavigate();

    const returnLogin = () => {
        navigate('/');
    };

    return (
        <div className="flex justify-center items-center w-screen h-screen bg-gray-100">
            <div className="bg-white rounded-lg shadow-md px-8 py-12 md:p-14 w-full max-w-2xl text-center">
                <div className="flex flex-col items-center">
                    <span className="text-6xl mb-4">🎉</span>
                    <h1 className="text-4xl font-bold mb-4">Password Reset Successfully!!</h1>
                    <a href="/login" className="text-lg text-blue-600 underline hover:text-blue-500" onClick={returnLogin}>
                        Return to the login page
                    </a>
                </div>
            </div>
        </div>
    );
};

export default PasswordSuccess;
