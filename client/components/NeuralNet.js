import ml5 from "ml5";
import dummyData from "./DummyData";
import axios from "axios";
import { forEach } from "quickdraw.js/src/categories";

let trainingData = [];

const trainingOptions = {
  epochs: 100,
  batchSize: 24,
};

const options = {
  task: "classification",
  debug: true,
};

const nn = ml5.neuralNetwork(options);

axios.get("/api/data").then((res) => {
  trainingData = res.data.trainingData;
  console.log(`adding ${trainingData.length} drawings to training data..`)
  let dataSlice = trainingData.slice(0,10000)
  let dataSlice2 = trainingData.slice(10000,20000)
  dataSlice.forEach((item) => {
    let input = {};
    let output = {};
  
    for (let i = 0; i < 784; i++) {
      input[i] = item.input[i];
    }  
    output.drawing = item.output;
    // console.log("input: ", input, "output: ", output)
    nn.addData(input, output)
  });  
  console.log("training data added!")
  console.log("normalizing data..")
  nn.normalizeData();
  console.log("data normalized!")
  console.log("training..")
  console.log("neural net", nn)
  nn.train(trainingOptions, finishedTraining(nn));

})
function addTrainingData(trainingData) {
trainingData.forEach((item) => {
  let input = {};
  let output = {};

  for (let i = 0; i < 784; i++) {
    input[i] = item.input[i];
  }  
  output.drawing = item.output;
  // console.log("input: ", input, "output: ", output)
  nn.addData(input, output)
});
}

function finishedTraining(nn) {
  console.log("finished training!");
  nn.save();
}

export default nn;

//****************************************************************************************


// import ml5 from "ml5";
// import dummyData from "./DummyData";
// import axios from "axios";
// import { forEach } from "quickdraw.js/src/categories";

// let trainingData = [];

// const trainingOptions = {
//   epochs: 32,
//   batchSize: 12,
// };

// const options = {
//   task: "classification",
//   debug: true,
// };

// const nn = ml5.neuralNetwork(options);

// console.log("Adding dummy data")

// dummyData.forEach((item) => {
//   let copy = item;
//   const output = {
//     drawing: copy.drawing,
//   };
//   delete copy.drawing;
//   //console.log("input: ", copy, "output: ", output)
//   nn.addData(copy, output);
// });

// console.log("dummy data added")
// console.log(nn);
// console.log("normalizing dummy data")
// nn.normalizeData();
// console.log("dummy data normalized")
// console.log("train with dummy data")
// nn.train(trainingOptions, finishedTraining);
// console.log("trained!")

// function finishedTraining() {
//   console.log("finished training!");
// }

// export default nn;