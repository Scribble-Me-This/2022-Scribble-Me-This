import React from "react";

const Confidence = (props) => {
  let { confidence, wordToDraw } = props;

  return (
    <div className="confidence">
      {confidence[0] ? (
        <div>
          <h2
            className={
              confidence[0].label === wordToDraw ? "wordToDraw" : "oneGuess"
            }
          >
            1. {confidence[0].label}{" "}
            {(confidence[0].confidence * 100).toFixed(2)}%
          </h2>
          <h2
            className={
              confidence[1].label === wordToDraw ? "wordToDraw" : "oneGuess"
            }
          >
            2. {confidence[1].label}{" "}
            {(confidence[1].confidence * 100).toFixed(2)}%
          </h2>
          <h2
            className={
              confidence[2].label === wordToDraw ? "wordToDraw" : "oneGuess"
            }
          >
            3. {confidence[2].label}{" "}
            {(confidence[2].confidence * 100).toFixed(2)}%
          </h2>
          <h2
            className={
              confidence[3].label === wordToDraw ? "wordToDraw" : "oneGuess"
            }
          >
            4. {confidence[3].label}{" "}
            {(confidence[3].confidence * 100).toFixed(2)}%
          </h2>
          <h2
            className={
              confidence[4].label === wordToDraw ? "wordToDraw" : "oneGuess"
            }
          >
            5. {confidence[4].label}{" "}
            {(confidence[4].confidence * 100).toFixed(2)}%
          </h2>
          <h2
            className={
              confidence[5].label === wordToDraw ? "wordToDraw" : "oneGuess"
            }
          >
            6. {confidence[5].label}{" "}
            {(confidence[5].confidence * 100).toFixed(2)}%
          </h2>
          <h2
            className={
              confidence[6].label === wordToDraw ? "wordToDraw" : "oneGuess"
            }
          >
            7. {confidence[6].label}{" "}
            {(confidence[6].confidence * 100).toFixed(2)}%
          </h2>
          <h2
            className={
              confidence[7].label === wordToDraw ? "wordToDraw" : "oneGuess"
            }
          >
            8. {confidence[7].label}{" "}
            {(confidence[7].confidence * 100).toFixed(2)}%
          </h2>
          <h2
            className={
              confidence[8].label === wordToDraw ? "wordToDraw" : "oneGuess"
            }
          >
            9. {confidence[8].label}{" "}
            {(confidence[8].confidence * 100).toFixed(2)}%
          </h2>
          <h2
            className={
              confidence[9].label === wordToDraw ? "wordToDraw" : "oneGuess"
            }
          >
            10. {confidence[9].label}{" "}
            {(confidence[9].confidence * 100).toFixed(2)}%
          </h2>
          <h2
            className={
              confidence[10].label === wordToDraw ? "wordToDraw" : "oneGuess"
            }
          >
            11. {confidence[10].label}{" "}
            {(confidence[10].confidence * 100).toFixed(2)}%
          </h2>
          <h2
            className={
              confidence[11].label === wordToDraw ? "wordToDraw" : "oneGuess"
            }
          >
            12. {confidence[11].label}{" "}
            {(confidence[11].confidence * 100).toFixed(2)}%
          </h2>
          <h2
            className={
              confidence[12].label === wordToDraw ? "wordToDraw" : "oneGuess"
            }
          >
            13. {confidence[12].label}{" "}
            {(confidence[12].confidence * 100).toFixed(2)}%
          </h2>
          <h2
            className={
              confidence[13].label === wordToDraw ? "wordToDraw" : "oneGuess"
            }
          >
            14. {confidence[13].label}{" "}
            {(confidence[13].confidence * 100).toFixed(2)}%
          </h2>
          <h2
            className={
              confidence[14].label === wordToDraw ? "wordToDraw" : "oneGuess"
            }
          >
            15. {confidence[14].label}{" "}
            {(confidence[14].confidence * 100).toFixed(2)}%
          </h2>
          {confidence.map((element, index) => {
            if (element.label === wordToDraw && index > 14) {
              return (
                <h2 className="wordToDraw">
                  {index + 1}. {confidence[index].label}{" "}
                  {(confidence[9].confidence * 100).toFixed(2)}%
                </h2>
              );
            }
          })}
        </div>
      ) : (
        "Start drawing!"
      )}
    </div>
  );
};

export default Confidence;
