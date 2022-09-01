import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import socket from "../client.js";

/**
 * COMPONENT
 */
class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      lobbies: data,
    };
  }
  // const dispatch = useDispatch();
  // const clientGameState = useSelector((state) => state.clientGameState);

  // socket.on("newLobby", (instanceState) => {
  //   console.log("newLobby", instanceState);

  // });

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

/**
 * CONTAINER
 */
const mapState = (state) => {
  console.log("state", state);
  return {
    clientGameState: state.clientGameState,
  };
};

export default Home;
