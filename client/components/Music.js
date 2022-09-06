import React from 'react';
import { Howl } from 'howler';

const myAudio = new Howl({
  src: ['drip.mp3'],
});

function togglePlay() {
  return myAudio.playing() ? myAudio.pause() : myAudio.play();
}

function Tut() {
  return (
    <div>
      <button className='audioToggle' onClick={() => togglePlay()}>
        <i className='fa fa-music fa-3x'></i>
      </button>
    </div>
  );
}

export default Tut;
