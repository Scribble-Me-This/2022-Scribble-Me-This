class Player {
    constructor(name, points, drawingData, topGuess, correctStatus, confidence, canvasLoaded) {
      this.name = name;
      this.points = points;
      this.drawingData = drawingData;
      this.topGuess = topGuess;
      this.correctStatus = correctStatus;
      this.confidence = confidence;
      this.canvasLoaded = canvasLoaded;
    }
  }

export default Player;