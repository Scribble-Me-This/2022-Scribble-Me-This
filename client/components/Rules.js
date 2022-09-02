import React from 'react';

class Rules extends React.Component {
  render() {
    return (
      <div className="centerWrapper">
        <input
          className="homeButtons marOne"
          type="text"
          placeholder="Lobby Name Here!"
        ></input>
        <input
          className="homeButtons marOne"
          type="text"
          placeholder="Host Name Here!"
        ></input>
        <div className="marOne">
          <button className="homeButtons">↓ Game Modes ↓ </button>{' '}
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
            <input type="text" placeholder="Ex. 2,3,4" id="input"></input>
          </li>
          <li id="left">
            AI Guess Time:
            <input
              type="text"
              placeholder="Ex. 15,30,45 sec"
              id="input"
            ></input>
          </li>
          <li id="left">
            Input Locked Pass:
            <input
              type="text"
              placeholder="Ex. True or False"
              width="1rem"
              id="input"
            ></input>
          </li>
        </ul>
        <button className="homeButtons hov startGame">Start Game</button>
      </div>
    );
  }
}

export default Rules;
