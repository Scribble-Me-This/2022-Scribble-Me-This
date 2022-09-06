import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="navbar_wrapper">
      <div className="navbar">
        <Link to="/">
          <img
            className="logo"
            src="/assets/logo.svg"
            height="100px"
            width="200px"
          />
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
