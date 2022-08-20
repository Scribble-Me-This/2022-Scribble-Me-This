// import data from './dataLocation';
import ml5 from "ml5";
import dummyData from "./DummyData";
import axios from "axios";

let trainingData = [];

axios.get("/api/data").then((res) => {
    trainingData = res.data.trainingData;
    console.log(trainingData);
});

const options = {
  task: "classification",
  debug: true,
};

const nn = ml5.neuralNetwork(options);

trainingData.forEach((item) => {
  let copy = item;
  const output = {
    drawing: copy.drawing,
  };
  delete copy.drawing;
  //console.log("input:", copy, "output", output)
  nn.addData(copy, output);
});

nn.normalizeData();

const trainingOptions = {
  epochs: 32,
  batchSize: 12,
};
nn.train(trainingOptions, finishedTraining);

function finishedTraining() {
  console.log("finished training!");
}

export default nn;
