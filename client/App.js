import React from 'react';
import Navbar from './components/Navbar';
import Routes from './Routes';
import ml5 from 'ml5';
// import { Instance } from './components/instance';
import model from './model.json';
import metadata from './model_meta.json';
import weights from './model.weights.bin';


const options = {
  task: "classification",
  debug: false,
};
const nn = ml5.neuralNetwork(options);

// const modelDetails = {
//   model: './model.json',
//   metadata: './model_meta.json',
//   weights: './model.weights.bin'
// }
// console.log("!!!", modelDetails)

const modelDetails = {
  model: model,
  metadata: metadata,
  weights: weights
}
console.log("!!!", modelDetails)

setTimeout(()=>{nn.load(modelDetails, console.log( "loaded Model"))},5000);
console.log(nn);

const App = () => {
  return (
    <div>
      <Navbar />
      {/* <Instance /> */}
      <Routes />
    </div>
  );
};

export default App;
