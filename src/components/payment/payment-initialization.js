import React, { useState, useEffect } from 'react';
import PaystackPop from '@paystack/inline-js';
import { useParams, useNavigate } from 'react-router-dom';
import { TextInput, Label } from 'flowbite-react';
import {  BsFillEnvelopeAtFill  } from "react-icons/bs";
import { GiTakeMyMoney } from "react-icons/gi"; 
import { RiSecurePaymentFill } from "react-icons/ri";


export default function PaymentInitialization() {
  const publicKey = "pk_test_c76d26f0a76ed0cdef9da8bdf9cbeee35668a089";
  const { bus_number, seat_number } = useParams();
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    console.log(`Bus Number: ${bus_number}, Seat Number: ${seat_number}`);
  }, [bus_number, seat_number]);

  const payWithPayStack = (e) => {
    e.preventDefault();

    const paystack = new PaystackPop();
    paystack.newTransaction({
      key: publicKey,
      amount: amount * 100,
      email,
      metadata: {
        custom_fields: [
          { 
            display_name: "Bus Number", 
            variable_name: "bus_number", 
            value: bus_number 
          },
          { 
            display_name: "Seat Number", 
            variable_name: "seat_number", 
            value: seat_number 
          },
        ],
      },
      callback: (transaction) => handleSuccess(transaction),
      onClose: () => alert('Wait! You need this payment to confirm your seat.'),
    });
  };

  function handleSuccess(transaction) {
    let reference = `${transaction.reference}`;
    navigate(`/payment-verification/${bus_number}/${seat_number}/${reference}`);
  };

  return (
    
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-green-400 to-blue-500 p-4">
      <div className="bg-white rounded-lg shadow-md px-8 py-12 p-10 md:p-14 w-full max-w-lg">
      <h1 className="text-2xl font-bold font-chakra mb-6 text-center text-black-700 flex items-center justify-center"> 
        Make Payment <RiSecurePaymentFill className="ml-2 mt-1" />
      </h1>
        <form className="flex flex-col gap-3" onSubmit={payWithPayStack}>
          <div className="mb-2 block font-chakra">
            <Label htmlFor="email" className="block text-black font-semibold" value="Email" />
            <TextInput
              type="email"
              id="email"
              placeholder="Enter your email"
              shadow
              icon={BsFillEnvelopeAtFill}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-2 block font-chakra">
            <Label htmlFor="amount"  className="block text-black font-semibold" value="Amount" />
            <div className="relative">
              <TextInput
                type="number"
                id="amount"
                placeholder="Enter Amount"
                shadow
                icon={GiTakeMyMoney}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white font-chakra rounded-lg hover:bg-blue-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            disabled={!bus_number || !seat_number}
          >
            Pay ₦{amount} Now 
          </button>
        </form>
      </div>
    </div>
  );
}
