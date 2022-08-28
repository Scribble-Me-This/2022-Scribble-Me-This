import React from "react";
let guess;
let context;
let stack = [];
let undoing = false;

const Canvas = (props) => {
  const height = 280;
  const width = 280;
  guess = props.guess;

  window.addEventListener("load", () => {
    const canvas = document.querySelector("#canvas");
    context = canvas.getContext("2d");
    canvas.height = height;
    canvas.width = width;
    let drawing = false;
    const rect = canvas.getBoundingClientRect();
    clearCanvas(context);
    stack.push(context.getImageData(0, 0, height, width));

    function startDraw(e) {
      drawing = true;
      if (undoing) {
        stack.push(context.getImageData(0, 0, height, width));
        undoing = false;
      }
      draw(e);
    }
    function stopDraw() {
      drawing = false;
      context.beginPath();
      stack.push(context.getImageData(0, 0, height, width));
    }

    function draw(e) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (!drawing) return;
      context.lineWidth = 10;
      context.lineCap = "round";
      context.lineTo(x, y);
      context.stroke();
      context.beginPath();
      context.moveTo(x, y);
      mapPixels(context);
    }

    canvas.addEventListener("mousedown", startDraw);
    canvas.addEventListener("mouseup", stopDraw);
    canvas.addEventListener("mousemove", draw);
  });

  return (
    <div className="column">
      <canvas id="canvas" className="canvas" height="280" width="280" />
      <div className="row">
        <button
          onClick={() => {
            clearCanvas(context);
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
};

function clearCanvas(context) {
  console.log("cleared");
  for (let i = 0; i < 280; i++) {
    for (let j = 0; j < 280; j++) {
      drawPixel("white", context, i, j, 1);
    }
  }
}

function drawPixel(color, context, x, y, size) {
  context.fillStyle = color;
  context.fillRect(x, y, size, size);
}

function mapPixels(canvas) {
  let pixelSums = [];
  let drawingData = [];
  for (let i = 0; i < 28; i++) {
    for (let j = 0; j < 28; j++) {
      let pixelSum = 0;
      let pixelData = canvas.getImageData(j * 10, i * 10, 10, 10);
      for (let m = 0; m < pixelData.data.length; m++) {
        pixelSum += pixelData.data[m];
      }
      pixelSum -= 25500;
      pixelSums.push(pixelSum);
      let val = 255 - pixelSum / 300;
      drawingData.push(val / 255);
    }
  }
  guess(drawingData);
  return drawingData;
}

export default Canvas;
