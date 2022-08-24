import React, { useState } from 'react';
import data from './mock-lobby-data.json';

function Lobby() {
  const [lobbies, setLobbies] = useState(data);

  let players = lobbies[0].players;

  return (
    <div className='lobby-container'>
      <table>
        <tbody>
          {players.map((player, index) => {
            return (
              <tr key={index}>
                <td>{player}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <ul className='lobby-buttons-wrapper'>
        <li className='boxa'>RULES:</li>
        <button className='boxb'>Ready Up</button>
        <button className='boxc'>Join Code</button>
      </ul>
    </div>
  );
}

export default Lobby;
