import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <ul style={{ listStyleType: 'none', display: 'flex', gap: '1rem' }}>
        <li><Link to="/">Login</Link></li>
        <li><Link to="/register">Register</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/garden">Garden</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
