import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PDFDownloadLink, Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import approvedReceipt from '../images/icons8-receipt-approved-50.png'
import { FaMoneyBillAlt } from "react-icons/fa";
import { MdDepartureBoard } from "react-icons/md";
import { BsBusFront } from "react-icons/bs";
import { FaRoute } from "react-icons/fa";
import { PiSeatBold } from "react-icons/pi";
import { GrTransaction } from "react-icons/gr";
import { AiFillSchedule } from "react-icons/ai";
import { AiOutlineUser } from "react-icons/ai";
import { toast } from 'react-toastify';


{/* <a target="_blank" href="https://icons8.com/icon/t3De8IRRmcYq/receipt-approved">Receipt Approved</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a> */}

const CustomCloseButton = ({ closeToast }) => (
  <button onClick={closeToast} className="text-white ml-4">×</button>
);


export default function Receipt () {

  const { reservation_id } = useParams();
  const [receipt, setReceipt] = useState(null);
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {

    const fetchReceipt = async () => {
      try {
        const response = await fetch(`http://localhost:5000/receipt/${reservation_id}`);
        const data = await response.json();
        
        if (data && data.receipt) {
          setReceipt(data.receipt);
          setRole(data.receipt.role_name); 
        } else {
          throw new Error('Failed to fetch receipt');
        }
      } catch (error) {
        console.error('Error fetching receipt:', error);
      }
    };

    fetchReceipt();
  }, [reservation_id]);

  const handleNavigation = () => {
    switch (role) {
      case 'student':
        toast.success('Welldone! ', {
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
          navigate('/student-dashboard/home');
        }, 3000);
        break;
      case 'staff':
        toast.success('Welldone!', {
          position: "top-right",
          autoClose: 1500,
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
          navigate('/staff-dashboard/home');
        }, 3000);
        break;
      default:
        navigate('/default-route');
        break;
    }
  };

  const styles = StyleSheet.create({
    page: {
      padding: 30,
    },
    section: {
      marginBottom: 10,
    },
    heading: {
      fontSize: 20,
      marginBottom: 10,
    },
    text: {
      fontSize: 12,
      marginBottom: 5,
    },
  });

  const ReceiptDocument = ({ receipt }) => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.heading}>Booking Receipt</Text>
          <Text style={styles.text}>Name: {receipt.name}</Text>
          <Text style={styles.text}>Seat Number: {receipt.seat_number}</Text>
          <Text style={styles.text}>Bus Number: {receipt.bus_number}</Text>
          <Text style={styles.text}>Destination Route: {receipt.route_name}</Text>
          <Text style={styles.text}>Fare: ₦{receipt.amount}</Text>
          <Text style={styles.text}>Reservation Date: {receipt.reservation_date}</Text>
          <Text style={styles.text}>Departure Time: {receipt.departure_time} PM</Text>
          <Text style={styles.text}>Transaction Payment Ref: {receipt.reference}</Text>
        </View>
      </Page>
    </Document>
  );

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-r from-green-400 to-blue-500 p-8">
      <div className="p-10 max-w-2xl mx-auto bg-white rounded-xl shadow-md space-y-6">
        <div className="flex justify-center mb-6">
          <span className="text-3xl font-bold mr-5 font-chakra text-black-700">
            <p>Receipt</p>
          </span>
          <span className="l-4 mt-1">
            <img className="h-8 w-auto" src={approvedReceipt} alt="Booking logo" />
          </span>
        </div>
        {receipt ? (
          <div className="space-y-4 font-chakra">
            <p className="flex items-center text-gray-700"><AiOutlineUser className="mr-2" /> <strong>Name:</strong> <span className="ml-1 font-semibold">{receipt.name}</span></p>
            <p className="flex items-center text-gray-700"><PiSeatBold className="mr-2" /> <strong>Seat Number:</strong> <span className="ml-1 font-semibold">{receipt.seat_number}</span></p>
            <p className="flex items-center text-gray-700"><BsBusFront className="mr-2" /> <strong>Bus Number:</strong> <span className="ml-1 font-semibold">{receipt.bus_number}</span></p>
            <p className="flex items-center text-gray-700"><FaRoute className="mr-2" /> <strong>Destination Route:</strong> <span className="ml-1 font-semibold">{receipt.route_name}</span></p>
            <p className="flex items-center text-gray-700"><FaMoneyBillAlt className="mr-2" /> <strong>Fare:</strong> <span className="ml-1 font-semibold">₦{receipt.amount}</span></p>
            <p className="flex items-center text-gray-700"><AiFillSchedule className="mr-2" /> <strong>Reservation Date:</strong> <span className="ml-1 font-semibold">{receipt.reservation_date}</span></p>
            <p className="flex items-center text-gray-700"><MdDepartureBoard className="mr-2" /> <strong>Departure Time:</strong> <span className="ml-1 font-semibold">{receipt.departure_time} PM</span></p>
            <p className="flex items-center text-gray-700"><GrTransaction className="mr-2" /> <strong>Transaction Payment Ref:</strong> <span className="ml-1 font-semibold">{receipt.reference}</span></p>
            <div className="flex justify-between mt-6">
              <button
                className="px-4 py-2 bg-blue-500 text-white font-chakra rounded hover:bg-blue-700"
                onClick={handleNavigation}
              >
                Back to Dashboard
              </button>
              <PDFDownloadLink
                document={<ReceiptDocument receipt={receipt} />}
                fileName="Booking Receipt.pdf"
              >
                {({ loading }) => (
                  <button
                    className="px-4 py-2 bg-green-500 text-white font-chakra rounded hover:bg-green-700"
                  >
                    {loading ? 'Generating PDF...' : 'Download PDF'}
                  </button>
                )}
              </PDFDownloadLink>
            </div>
          </div>
        ) : (
          <p className="text-center font-chakra text-gray-500">Loading receipt...</p>
        )}
      </div>
    </div>
  );
}
