import React from 'react';


const PlayersDisplay = () => {
    return (
        <div>
            <div id="playersDisplay"> 
                <div className="playerInfoBox">
                    <div className="column">
                        <h4 className="playerNameText">Warren</h4>
                        <h4 className="playerInfoText">Drawing: Banana?</h4>
                        <h4 className="playerInfoText">Score: 1230</h4>
                    </div>
                    <img className="miniDrawing" src="https://i.imgur.com/LkWiJ0P.png"/>
                </div>
                <div className="playerInfoBox">
                    <div className="column">
                        <h4 className="playerNameText">David</h4>
                        <h4 className="playerInfoText">Drawing: Cat?</h4>
                        <h4 className="playerInfoText">Score: 1150</h4>
                    </div>
                    <img className="miniDrawing" src="https://i.imgur.com/36KCLV0.png"/>
                </div>
                <div className="playerInfoBoxCorrect">
                    <div className="column">
                        <h4 className="playerNameText">Alex</h4>
                        <h4 className="playerInfoText">Drawing: Penguin!</h4>
                        <h4 className="playerInfoText">Score: 1420</h4>
                    </div>
                    <img className="miniDrawing" src="https://i.imgur.com/mjUzLBr.png"/>
                </div>
                <div className="playerInfoBoxCorrect">
                    <div className="column">
                        <h4 className="playerNameText">Harrison</h4>
                        <h4 className="playerInfoText">Drawing: Penguin!</h4>
                        <h4 className="playerInfoText">Score: 1100</h4>
                    </div>
                    <img className="miniDrawing" src="https://i.imgur.com/mjUzLBr.png"/>
                </div>
                <div className="playerInfoBox">
                    <div className="column">
                        <h4 className="playerNameText">Jimothy</h4>
                        <h4 className="playerInfoText">Drawing: Banana?</h4>
                        <h4 className="playerInfoText">Score: 50</h4>
                    </div>
                    <img className="miniDrawing" src="https://i.imgur.com/LkWiJ0P.png"/>
                </div>
            </div>
        </div>
        

    )
}

export default PlayersDisplay;