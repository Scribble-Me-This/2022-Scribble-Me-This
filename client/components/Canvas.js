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
          className='canvas-button'
          onClick={() => {
            props.clearCanvas(props.context, props.stack);
            //            props.clearCanvas(props.context, props.mapPixels(props.context));

            pencilClick();
          }}
        >
          clear
        </button>
        <button
          className='canvas-button'
          onClick={() => {
            if (!props.stack.length) return;
            if (!props.undoing[0]) {
              props.undoing[0] = true;
              props.stack.pop();
            }
            props.context.putImageData(props.stack.pop(), 0, 0);
          }}
        >
          Undo
        </button>
      </div>
    </div>
  );
};

export default Canvas;
