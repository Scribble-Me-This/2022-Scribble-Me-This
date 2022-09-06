import React from "react";
import { connect } from "react-redux";
import socket from "../client";
import { getGameState } from "../store/gameState";

class LockedRules extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lobbyName: "",
      username: "",
      gameMode: "",
      maxPlayers: "",
      timeSetting: "",
      totalRounds: "",
    };
    console.log("Rules.js mounted", this.props);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    socket.emit("getRules");
    socket.on("rulesUpdate", (rules) => {
      this.setState(rules);
      console.log("rulesUpdate", this.state);
    });
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
    console.log("this.state", this.state);
  }

  render() {
    return (
      <div className="centerWrapper">
        <input
          name="lobbyName"
          className="homeButtons marOne"
          type="text"
          placeholder="Lobby Name Here!"
          disabled = {true}
          value={this.state.lobbyName}
          onChange={(event) => this.handleChange(event)}
        ></input>
        <input
          name="username"
          className="homeButtons marOne"
          type="text"
          placeholder="Lobby Leader Name Here!"
          disabled = {true}
          value={this.state.username}
          onChange={(event) => this.handleChange(event)}
        ></input>
        <div className="marOne">
          <button className="homeButtons">↓ Game Modes ↓ </button>{" "}
        </div>
        <div>
          <select className="homeButtons">
            <option value="Scribble Me This Classic">
              Scribble Me This Classic
            </option>
            <option value="Scribble Me This Redux">
              Scribble Me This Redux
            </option>
            <option value="Piction-AI-ry">Piction-AI-ry</option>
          </select>
        </div>
        <ul className="homeButtons horPadding">
          Settings
          <li id="left">
            Max Players:
            <input
              type="number"
              placeholder="Ex. 2,3,4"
              min = "1"
              id="input"
              name="maxPlayers"
              disabled = {true}
              value={this.state.maxPlayers}
              onChange={(event) => this.handleChange(event)}
            ></input>
          </li>
          <li id="left">
            Rounds:
            <input
              type="number"
              placeholder="Ex. 5,10,15 rounds"
              min="1"
              id="input"
              name="totalRounds"
              disabled = {true}
              value={this.state.totalRounds}
              onChange={(event) => this.handleChange(event)}
            ></input>
          </li>
          <li id="left">
            Round Time:
            <input
              type="number"
              name="timeSetting"
              min="5"
              placeholder="Ex. 15,30,45 sec (min 5)"
              id="input"
              disabled = {true}
              value={this.state.timeSetting}
              onChange={(event) => this.handleChange(event)}
            ></input>
          </li>
        </ul>
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
  };
};

export default connect(mapState, mapDispatch)(LockedRules);
