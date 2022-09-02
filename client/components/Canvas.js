import React from 'react';

const pencilClick = () => {
  let audio = new Audio('/pencil.mp3');
  audio.play();
};

const Canvas = (props) => {
  return (
    <div className='column'>
      <canvas id='canvas' className='canvas' height='280' width='280' />
      <div className='row'>
        <button
          onClick={() => {
            props.clearCanvas(props.context);
            pencilClick();
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
    context.lineCap = 'round';
    context.lineTo(x, y);
    context.stroke();
    context.beginPath();
    context.moveTo(x, y);
    mapPixels(context);
  }
};

export default Canvas;
