import React, { useState } from 'react';
// import '../../../public/style.css';
import data from './mock-lobby-data.json';

function LobbyBrowser() {
  const [lobbies, setLobbies] = useState(data);

  return (
    <div className='lobby-browser-container'>
      <table>
        <thead>
          <tr>
            <th>Lobby Name</th>
            <th>Host Name</th>
            <th>Locked ?</th>
            <th>Players</th>
          </tr>
        </thead>
        <tbody>
          {lobbies.map((lobby, index) => (
            <tr key={index}>
              <td>{lobby.lobbyName}</td>
              <td>{lobby.hostName}</td>
              <td>{lobby.locked ? 'private' : 'public'}</td>
              <td>{lobby.players}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='lobby-browser-footer'>
        <button className='lobby-id-input-btn'>Lobby ID Input Here</button>
        <button className='lobby-join-game-btn'>Join Game</button>
      </div>
    </div>
  );
}

export default LobbyBrowser;
