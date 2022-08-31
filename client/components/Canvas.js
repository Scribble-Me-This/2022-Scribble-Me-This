import React from "react";
let context;
let stack = [];
let undoing = false;

class Canvas extends React.Component {
  
  render() {
    console.log(this);
    return (
      <div className="column">
        <canvas id="canvas" className="canvas" height="280" width="280" />
        <div className="row">
          <button
            onClick={() => {
              this.clearCanvas(context);
            }}
          >
            clear
          </button>
          <button
            onClick={() => {
              if (!stack.length) return;
              if (!undoing) {
                undoing = true;
                stack.pop();
              }
              context.putImageData(stack.pop(), 0, 0);
            }}
          >
            Undo
          </button>
        </div>
      </div>
    );
  }

  clearCanvas(context) {
    for (let i = 0; i < 280; i++) {
      for (let j = 0; j < 280; j++) {
        this.drawPixel("white", context, i, j, 1);
      }
    }
    stack.push(context.getImageData(0, 0, 280, 280));
  }
  
  drawPixel(color, context, x, y, size) {
    context.fillStyle = color;
    context.fillRect(x, y, size, size);
  }

}

export default Canvas;
