import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../store';

const Navbar = () => {
  return (
    <header className="navbar">
      <div className="navbar_wrapper">
        <Link to="/">
          <img
            className="logo"
            src="/assets/logo.svg"
            height="100px"
            width="200px"
          />
        </Link>
      </div>
      <button className="logout">Logout</button>
    </header>
  );
};

export default Navbar;
