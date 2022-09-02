import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import socket from "../client.js";
import { getGameState } from "../store/gameState";

/**
 * COMPONENT
 */
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
    };
    this.socket = socket;
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({username: event.target.value});
    console.log(this.state.username)
  }

  componentDidMount() {
  }

  render() {
    return (
      <div>
        <div className="centerWrapper">
          <input
            className="smallMargin homeButtons"
            type="text"
            placeholder="Name Here!"
            value={this.state.username}
            onChange={(event) => this.handleChange(event)}
          ></input>
          <Link to="/lobbybrowser">
            <button
              className="join homeButtons hov"
              onClick={() => {
                console.log("lobbybrowser");
              }}
            >
              View Lobbies
            </button>
          </Link>
          <div className="flex">
            <Link to="/lobby">
              <button
                className="homeButtons hov"
                onClick={() => {
                  console.log("create room");
                  socket.emit("newLobby");
                }}
              >
                Create Room
              </button>
            </Link>
            <div className="smallWrapper">
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
              className="homeButtons input40"
              type="text"
              placeholder="Code"
            ></input>
            <button className="homeButtons hov">Submit</button>
          </div>
        </div>
      </div>
    );
  }
}

const mapState = (state) => {
  return {
    gameState: state.gameState,
  };
};

const mapDispatch = (dispatch) => {
  return {
    // explicitly forwarding arguments
    updateGameState: (lobbyState) => dispatch(getGameState(lobbyState)),
    updateClientState: (clientState) => dispatch(getClientState(clientState)),
  }
}

export default connect(mapState, mapDispatch)(Home);
