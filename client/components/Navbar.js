import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ handleClick }) => {
  return (
    <header className='navbar'>
      <div className='navbar_wrapper'>
        <Link to='/'>
          <img
            className='logo'
            src='/assets/logo.svg'
            height='100px'
            width='200px'
          />
        </Link>
      </div>
    </header>
  );
};


export default Navbar;
