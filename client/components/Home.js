import React from 'react';
import { connect } from 'react-redux';
import LobbyBrowser from './Lobby/LobbyBrowser';

/**
 * COMPONENT
 */
export const Home = (props) => {
  const { username } = props;
  return (
    <div>
      <div class="centerWrapper">
        <input
          class="smallMargin homeButtons"
          type="text"
          placeholder="Name Here!"
        ></input>
        <button class="join homeButtons hov">View Lobbies</button>
        <div class="flex">
          <button class="homeButtons hov">Create Room</button>
          <div class="smallWrapper">
            <img
              className="flex"
              src="/assets/leftArrow.svg"
              height="50px"
              width="100px"
            />
            <img
              className="flex"
              src="/assets/rightArrow.svg"
              height="50px"
              width="100px"
            />
          </div>
          <input
            class="homeButtons input40"
            type="text"
            placeholder="Code"
          ></input>
          <button class="homeButtons hov">Submit</button>
        </div>
      </div>
      <h3>Welcome, {username}</h3>
      <LobbyBrowser />
    </div>
  );
};

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    username: state.auth.username,
  };
};

export default connect(mapState)(Home);
