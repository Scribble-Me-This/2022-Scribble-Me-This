import { render } from "enzyme";
import React from "react";

class MiniCanvas extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log("minicanvas props", this.props);
    const canvas = document.querySelector("#miniPic");
    let context = canvas.getContext("2d");
    canvas.height = 28;
    canvas.width = 28;
    drawImage(context, this.props.drawingData)
  }

  render() {
    return <canvas id="miniPic" height="42" width="42" />;
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

function drawImage(canvas, imageData) {
  if (!imageData || !canvas) return;
  console.log(imageData);
  let pixelIndex = 0;
  for (let i = 0; i < 28; i++) {
    for (let j = 0; j < 28; j++) {
      color = `rgb(${imageData[pixelIndex]},${imageData[pixelIndex]},${imageData[pixelIndex]})`;
      drawPixel(color, canvas, i, j, 1);
      pixelIndex++;
    }
  }
  console.log(drawingData);
  return drawingData;
}
export default MiniCanvas;
