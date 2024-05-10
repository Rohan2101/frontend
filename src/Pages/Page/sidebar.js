import React from 'react';
import { Link } from 'react-router-dom';
import './sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Dashboard</h3>
      </div>
      <Link to="/inventory" className="sidebar-item">Scan Receipt</Link>
      <Link to="/scan-receipt" className="sidebar-item">Inventory Overview</Link>
      <Link to="/scan-expiry" className="sidebar-item">Scan Expiry Date</Link>
      <Link to="/savings-waste" className="sidebar-item">Savings and Waste Tracker</Link>
    </div>
  );
};

export default Sidebar;
