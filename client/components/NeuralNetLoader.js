import ml5 from "ml5";

const options = {
  task: "classification",
  debug: false,
};
const nn = ml5.neuralNetwork(options);
const modelDetails = {
  model: "./model.json",
  metadata: "./model_meta.json",
  weights: "./model.weights.bin",
};

nn.load(modelDetails, finishLoad());

function finishLoad() {
  console.log("finished loading");
}

export default nn;
