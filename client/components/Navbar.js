import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../store';

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
      <a href='#' onClick={handleClick}>
        <button className='logout'>Logout</button>
      </a>
    </header>
  );
};

const mapState = (state) => {
  return {
    isLoggedIn: !!state.auth.id,
  };
};

const mapDispatch = (dispatch) => {
  return {
    handleClick() {
      dispatch(logout());
    },
  };
};

export default connect(mapState, mapDispatch)(Navbar);
