import React from 'react';
import ml5 from "ml5";
import axios from 'axios';
import Canvas from './Canvas';
import { supportsGoWithoutReloadUsingHash } from 'history/DOMUtils';

const options = {
    task: "classification",
    debug: false,
};

let testingData = [];

const nn = ml5.neuralNetwork(options);

const modelDetails = {
    model: './model.json',
    metadata: './model_meta.json',
    weights: './model.weights.bin'
}

nn.load(modelDetails, finishLoad());

axios.get("/api/data").then((res) => {
    testingData = res.data.trainingData;
    let dataSlice = testingData.slice(10000, 10010)
    console.log(`adding ${dataSlice.length} drawings to testing data..`)
    dataSlice.forEach((item) => {
        let input = {};
        let output = {};
        for (let i = 0; i < 784; i++) {
            input[i] = item.input[i];
        }
        output.drawing = item.output;
        console.log(output.drawing);
        nn.classify(input, handleResults)
    });
})

function handleResults(error, result) {
    if (error) {
        console.error(error);
        return;
    }
    console.log(result);
}

export const Instance = () => {

    return (
        <div>
            < Canvas guess={guess} />
        </div>
    )
}

function guess(input) {
    nn.classify(input, handleResults)
}

function finishLoad() {
    console.log("finished loading")
}

export default Instance;