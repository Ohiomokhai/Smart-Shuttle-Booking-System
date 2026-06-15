import React, { useState } from 'react';
import { Routes, Route, Navigate} from 'react-router-dom';
import { UserProvider } from '../../userContext/userContext';
import Login from '../login/login';
import RoleSelection from '../role-selection/roleSelection';
import ChangePassword from '../login/password-reset/passwordReset';
import PasswordSuccess from '../login/password-success/password-success';
import StudentSignup from '../register/studentSignup';
import StaffSignup from '../register/staffSignup';
import DriverSignup from '../register/driverSignup';
import DashboardStudent from '../dashboard/student-dashboard';
import DashboardDriver from '../dashboard/driver-dashboard';
import DashboardStaff from '../dashboard/staff-dashboard';
import DashboardHome from '../menu/home';
import Bookings from '../menu/bookings';
import Notification from '../menu/notification';
import Profile from '../menu/profile';
import Help from '../menu/help';
import Settings from '../menu/settings';
import Compliant from '../menu/compliant';
import BusManagement from '../menu/bus management';
import CreateBus from '../create-bus/create-bus';
import ReserveSeat from '../reserveSeat/reserve-seat';
import PaymentInitialization from '../payment/payment-initialization';
import PaymentVerification from '../payment/payment-verification';
import PaymentSuccess from '../payment/payment-success';
import ConfirmBookings from '../confirm-bookings/confirm-booking';
import Receipt from '../receipt/receipt';
import NotFound from '../404page/404page';

const Navigation = () => {

    const [selectedRole, setSelectedRole] = useState(null);  
    
    const handleRoleSelection = (role) => {
        setSelectedRole(role);
    };
    
    return (
        <>
           <UserProvider>
                    <Routes>
                        <Route path="/" element={<Navigate to="/login" replace />} /> 
                                
                        <Route path="/login" element={<Login />} /> 
                        
                        <Route path="/role-selection" element={<RoleSelection onSelectRole={handleRoleSelection} />} />
            
                        {selectedRole === 'student' && (
                            <Route path="/signup/student" element={<StudentSignup />} />
                        )}
                        {selectedRole === 'staff' && (
                            <Route path="/signup/staff" element={<StaffSignup />} />
                        )}
                        {selectedRole === 'driver' && (
                            <Route path="/signup/driver" element={<DriverSignup />} />
                        )}

                        <Route path="/password-reset" element={<ChangePassword />} />

                        <Route path="/password-success" element={<PasswordSuccess />} />

                        <Route path="/driver/create-bus" element={<CreateBus/>} />

                        <Route path="/bus-seats/:bus_number" element={<ReserveSeat />} />

                        <Route path="/payment/:bus_number/:seat_number" element={<PaymentInitialization />} />

                        <Route path="/payment-verification/:bus_number/:seat_number/:reference" element={<PaymentVerification />} />

                        <Route path="/payment-success" element={<PaymentSuccess />} />

                        <Route path="/confirm-booking" element={<ConfirmBookings />} />

                        <Route path="/receipt/:reservation_id" element={<Receipt/>} />


                        <Route path="/student-dashboard/*" element={<DashboardStudent />}>
                            <Route path="home" element={<DashboardHome/>} />
                            <Route path="bookings" element={<Bookings/>} />
                            <Route path="notification" element={<Notification/>} />
                            <Route path="compliant" element={<Compliant/>} />
                            <Route path="help" element={<Help/>} />
                            <Route path="profile" element={<Profile/>} />
                            <Route path="settings" element={<Settings/>} />
                        </Route>

                        {/* <Route path="home" element={<DashboardHome/>} /> */}

                        
                        <Route path="/driver-dashboard/*" element={<DashboardDriver />}>
                            <Route path="home" element={<DashboardHome/>} />
                            <Route path="bus-management" element={<BusManagement/>} />
                            <Route path="notification" element={<Notification/>} />
                            <Route path="compliant" element={<Compliant/>} />
                            <Route path="help" element={<Help/>} />
                            <Route path="profile" element={<Profile/>} />
                            <Route path="settings" element={<Settings/>} />
                        </Route>

                        <Route path="/staff-dashboard/*" element={<DashboardStaff />}>
                            <Route path="home" element={<DashboardHome/>} />
                            <Route path="bookings" element={<Bookings/>} />
                            <Route path="notification" element={<Notification/>} />
                            <Route path="compliant" element={<Compliant/>} />
                            <Route path="help" element={<Settings/>} />
                            <Route path="profile" element={<Profile/>} />
                            <Route path="settings" element={<Settings/>} />
                        </Route>

                        <Route path="*" element={<NotFound/>}/>
                    </Routes>
            </UserProvider>
        </>
    );
};

export default Navigation;


