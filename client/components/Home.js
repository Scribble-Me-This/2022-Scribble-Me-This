import React from "react";
import { Link } from "react-router-dom";
import socket from "../client.js";

/**
 * COMPONENT
 */
class Home extends React.Component {
  constructor(props) {
    super(props);

    this.socket = socket;

  }

  componentDidMount() {
    console.log("props", this.props)
    this.socket.on("connect", () => {
      console.log("Client connected: Home.js", this.socket);
    })
    this.socket.on("newLobby", (lobbyState) => {
      console.log("newLobby GOT", lobbyState);
      this.props.lobbyInstanceUpdater(lobbyState)
    })
  }




  render() {
    return (
      <div>
        <div className="centerWrapper">
          <input
            className="smallMargin homeButtons"
            type="text"
            placeholder="Name Here!"
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


export default Home;
