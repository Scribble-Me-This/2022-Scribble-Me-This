import React from "react";
import ml5 from "ml5";
import axios from "axios";
import Canvas from "./Canvas";
import { supportsGoWithoutReloadUsingHash } from "history/DOMUtils";
import PlayersDisplay from "./PlayersDisplay";

const options = {
  task: "classification",
  debug: false,
};

// let testingData = [];

const nn = ml5.neuralNetwork(options);

const modelDetails = {
  model: "./model.json",
  metadata: "./model_meta.json",
  weights: "./model.weights.bin",
};

nn.load(modelDetails, finishLoad());

// loads test data, will feed into percent accuracy checker
// axios.get("/api/data").then((res) => {
//     testingData = res.data.trainingData;
//     let dataSlice = testingData.slice(10000, 10010)
//     console.log(`adding ${dataSlice.length} drawings to testing data..`)
//     dataSlice.forEach((item) => {
//         let input = {};
//         let output = {};
//         for (let i = 0; i < 784; i++) {
//             input[i] = item.input[i];
//         }
//         output.drawing = item.output;
//         console.log(output.drawing);
//         nn.classify(input, handleResults)
//     });
// })

class Instance extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confidence: null,
    };
  }

  render() {
    const confidence = this.state.confidence;
    return (
      <div className="column">
        <div className="instanceStats">
          <h3> Time: 30 seconds </h3>
          <h3> Drawing: Penguin </h3>
        </div>
        <div className="canvasEtc">
          <div className="confidence">
            {confidence ? (
                <div>
              <h2 className="oneGuess">
                1. {confidence[0].label} {(confidence[0].confidence*100).toFixed(2)}%
              </h2>
              <h2 className="oneGuess">
                2. {confidence[1].label} {(confidence[1].confidence*100).toFixed(2)}%
              </h2>
              <h2 className="oneGuess">
                3. {confidence[2].label} {(confidence[2].confidence*100).toFixed(2)}%
              </h2>
              <h2 className="oneGuess">
                4. {confidence[3].label} {(confidence[3].confidence*100).toFixed(2)}%
              </h2>
              <h2 className="oneGuess">
                5. {confidence[4].label} {(confidence[4].confidence*100).toFixed(2)}%
              </h2>
              <h2 className="oneGuess">
                6. {confidence[5].label} {(confidence[5].confidence*100).toFixed(2)}%
              </h2>
              <h2 className="oneGuess">
                7. {confidence[6].label} {(confidence[6].confidence*100).toFixed(2)}%
              </h2>
              <h2 className="oneGuess">
                8. {confidence[7].label} {(confidence[7].confidence*100).toFixed(2)}%
              </h2>
              <h2 className="oneGuess">
                9. {confidence[8].label} {(confidence[8].confidence*100).toFixed(2)}%
              </h2>
              <h2 className="oneGuess">
                10. {confidence[9].label} {(confidence[9].confidence*100).toFixed(2)}%
              </h2>
              </div>
              
            ) : (
              "Start drawing!"
            )}
          </div>
          <Canvas guess={this.guess} />
          <PlayersDisplay />
        </div>
      </div>
    );
  }
  handleResults = (error, result) => {
    if (error) {
      console.error(error);
      return;
    }
    this.setState({
      confidence: result,
    });
  }

  guess = (input) => {
    nn.classify(input, this.handleResults);
  }
}

function finishLoad() {
  console.log("finished loading");
}

export default Instance;
