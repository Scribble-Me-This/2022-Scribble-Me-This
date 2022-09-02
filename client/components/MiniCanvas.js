import { render } from "enzyme";
import React from "react";

class MiniCanvas extends React.Component {
  constructor(props) {
    super(props);
    this.context = null;
    this.miniCanvas = (
      <canvas
        id="miniPic"
        height="42"
        width="42"
        ref={(node) => {
          this.context = node ? node.getContext("2d") : null;
        }}
      />
    );
  }

  componentDidUpdate() {
    console.log("this.props", this.props.drawingData)
    drawImage(this.context, this.props.drawingData);
  }

  render() {
    return this.miniCanvas;
  }
}

function clearCanvas(context) {
  for (let i = 0; i < 28; i++) {
    for (let j = 0; j < 28; j++) {
      drawPixel("white", context, i, j, 1);
    }
  }
}

function drawPixel(color, context, x, y, size) {
  context.fillStyle = color;
  context.fillRect(x, y, size, size);
}

function drawImage(canvas, drawingData) {
  if (!drawingData) return;
  console.log(canvas, drawingData);
  let pixelIndex = 0;
  for (let i = 0; i < 28; i++) {
    for (let j = 0; j < 28; j++) {
      let color = `rgb(${drawingData[pixelIndex]},${drawingData[pixelIndex]},${drawingData[pixelIndex]})`;
      drawPixel(color, canvas, i, j, 1);
      pixelIndex++;
    }
  }
  console.log(drawingData);
  return drawingData;
}
export default MiniCanvas;
