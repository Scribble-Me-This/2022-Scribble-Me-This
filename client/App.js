import Navbar from './components/Navbar';
import Routes from './Routes';
import React from 'react';
import axios from 'axios';
import ml5 from 'ml5';

const options = {
  task: "classification",
  debug: false,
};

let testingData = [];

const nn = ml5.neuralNetwork(options);
let testingdata;

axios.get("/api/data").then((res) => {
  testingData = res.data.trainingData;
  let dataSlice = testingData.slice(10000,10010)
  console.log(`adding ${dataSlice.length} drawings to testing data..`)
  dataSlice.forEach((item) => {
    let input = {};
    let output = {};
    for (let i = 0; i < 784; i++) {
      input[i] = item.input[i];
    }  
    output.drawing = item.output;
    nn.classify(input, handleResults)
  });  
})

function handleResults(error, result) {
  if(error) {
    console.error(error);
    return;
  }
  console.log(result);
}

const modelDetails = {
  model: './model.json',
  metadata: './model_meta.json',
  weights: './model.weights.bin'
}

const App = () => {
  console.log("!!!", modelDetails)
  nn.load(modelDetails, finishLoad());
  console.log(nn);
  return (
    <div>
      <Navbar />
      <Routes />
    </div>
  );
};

function finishLoad() {
  console.log("finished loading")
}

export default App;
