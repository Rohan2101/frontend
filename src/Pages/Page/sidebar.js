import React from 'react';
import { Link } from 'react-router-dom';
import './sidebar.css';  // Assuming you will create a separate CSS file for styling

const Sidebar = () => {
  return (
    <div className="sidebar">
      <a href="/inventory" className="sidebar-item">Inventory Table</a>
      <a href="/scan-receipt" className="sidebar-item">Scan Receipt</a>
      <a href="/scan-expiry" className="sidebar-item">Scan Expiry Date</a>
      <a href="/savings-waste" className="sidebar-item">Savings and Waste Tracker</a>
    </div>
  );
};

export default Sidebar;
