import { render } from "enzyme";
import React from "react";

class MiniCanvas extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    let context = null;
    let canvas = null;
  }

  componentDidMount() {
    this.canvas = this.canvasRef.current;
    this.context = this.canvas.getContext('2d');
    clearCanvas(this.context)
  }

  componentDidUpdate() {
    this.canvas = this.canvasRef.current;
    this.context = this.canvas.getContext('2d');
    drawImage(this.context,this.props.drawingData);
    // drawImage(this.context, this.props.drawingData);
  }

  render() {
    return <canvas className="miniPic" height="28" width="28" ref={this.canvasRef} />;
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
  let pixelIndex = 0;
  for (let i = 0; i < 28; i++) {
    for (let j = 0; j < 28; j++) {
      let pixel = 255 - Math.floor(255*drawingData[pixelIndex])
      let color = `rgb(${pixel},${pixel},${pixel})`;
      drawPixel(color, canvas, j, i, 1);
      pixelIndex++;
    }
  }
}
export default MiniCanvas;
