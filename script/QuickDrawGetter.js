// dataset includes 345 categories with ~100k drawings each
// Our dataset will use x categories with 10k drawings each
/*
.set function returns this:
{
  set: [
    { input: [0, 0, 0, 0.418, 0...], output: [1, 0, 0]},
    { input: [0.156, 0, 0, 0.163, // one object for every sample
  ],
  output: 3, // amount of categories
  input: 784 // dimension of samples (28 x 28)
}
Category list here: https://github.com/googlecreativelab/quickdraw-dataset/blob/master/categories.txt

we need this:
{
0: 0, //greyscale value for pixel
1: 255,
2: 135,
... // every number between
782: 195,
783: 0,
"drawing": "penguin"
}
*/
//Import data caller
const quickDraw = require("quickdraw.js");

function QuickDrawGetter() {
  //edit pictures we want here
  const selectedCategories = [
    "airplane",
    "banana",
    "candle",
    "cat",
    "dog",
    "fish",
    "flower",
    "guitar",
    "house",
    "penguin",
  ];
  //edit amount of pictures we want to train with here
  const amountOfPicturesTrain = 10000;
  //edit amount of pictures we want to test with here
  const amountOfPicturesTest = 1000;

  //eventual outputs
  //trainingData should be an array of objects containing 10000 drawings 
  //testingData should be an array of 1000 drawings not present in trainingData
  const trainingData = [];
  const testingData = [];
  // hello

  //Get the data (this will take a while) .set(10000 training + 1000 testing * categories, ['things', we', 'want', 'to', 'draw'])
  const rawData = quickDraw.set(((amountOfPicturesTest + amountOfPicturesTrain) * selectedCategories.length), selectedCategories);

  //Extract the data for inputs
  //set references for separating training and testing data
  const counterArr = counterMaker(selectedCategories);

  rawData.set.forEach((singlePicData) => {
    //get the category of the picture
    const category = singlePicData.output.indexOf(1);
    if (counterArr[category] < 10000) {
      trainingData.push(singlePicData);
      counterArr[category]++;
    } else {
      testingData.push(singlePicData);
    }
  });

  function counterMaker(selectedCategories) {
    let counterArr = [];
    for (let i = 0; i < selectedCategories.length; i++) {
      counterArr.push(0);
    }
    return counterArr;
  }
  
  //shuffle data for later input into ML algos
  function shuffle(array) {
    var m = array.length,
      t,
      i;
    while (m) {
      i = Math.floor(Math.random() * m--);
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }
    console.log('a shuffling has occured');
    return array;
  }
  shuffle(trainingData);
  shuffle(testingData);
  
  //validate data
  function runValidate (trainingData, testingData) {
    for (let i = 0; i < counterArr.length; i++) {
      if (counterArr[i] !== 10000) {
        console.log('error: not enough data for category ' + selectedCategories[i]);
        return;
      }
    }
    if (trainingData.length !== amountOfPicturesTrain*selectedCategories.length) {
      console.err("Error: trainingData is not enough");
    }
    if (testingData.length !== amountOfPicturesTest*selectedCategories.length) {
      console.err("Error: testingData is not enough");
    }
    return {trainingData, testingData};
  }

  return runValidate(trainingData, testingData);
}

export default QuickDrawGetter;
