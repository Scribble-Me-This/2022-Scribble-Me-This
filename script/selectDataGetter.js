"use strict";
const quickDraw = require("quickdraw.js");

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
//dimensions of the pictures
const dimension = 28;

// edit pictures we want here
async function importer() {
  for (let i = 0; i < selectedCategories.length; i++) {
    await quickDraw.import(
      selectedCategories[i],
      amountOfPicturesTrain + amountOfPicturesTest,
      dimension
    );
    console.log("imported:", selectedCategories[i]);
  }
}
importer();
