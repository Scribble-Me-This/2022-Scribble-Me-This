import React from "react";

  const Canvas = (props) => {
    return (
      <div className="column">
        <canvas id="canvas" className="canvas" height="280" width="280" />
        <div className="row">
          <button
            onClick={() => {
              props.clearCanvas(props.context, props.mapPixels);
            }}
          >
            clear
          </button>
          <button
            onClick={() => {
              props.undo(props.context, props.stack, props.undoing);
            }}
          >
            Undo
          </button>
        </div>
      </div>
    );
  };

export default Canvas;
