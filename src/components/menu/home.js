import React, { useContext } from 'react';
import { UserContext } from '../../userContext/userContext';
import DashboardStudent from '../dashboard/student-dashboard';


export default function DashboardHome () {

  const { user } = useContext(UserContext);

  return (
    <>
      <DashboardStudent/>
      <span className="truncate text-sm font-medium">Welcome {user?.name}</span>

    </>
  );
}



