import React from 'react';
import Sidebar from '../../components/Sidebar';
import { Outlet } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="dashboard flex">
      <Sidebar />
      <div className="content flex-1 p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
