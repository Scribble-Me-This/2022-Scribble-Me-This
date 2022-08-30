# Scribble Me This

## What It Is

A Pictionary-style game where players draw pictures from a prompt, and the 'scribble' with the highest AI confidence rating wins.

## How the Machine Learning Works

- A 28x28 picture is taken as input; specifically, the pixel data from 0-255 RBG and opacity values.
- these 784 pixel values are placed into an array, which we will refer to as the raw data.
- the raw data is compared to the AI brain, and the AI guesses via percentage confidence rates

-when you want to train up neural net, checkout branch neural-net

**NeuralNet.js**
-when it starts up, it imports ML5, creates a neural network (line 18) using lines 13-16
-task: 'classification' means it will be a convoluted neural net (good for image guessing)
-line 20 runs get request which pulls the data downloaded from api data (all the drawings from quickdraw)
-line 23 takes 10,000 items from the dataset at random (there are ~110,000 items in the full dataset)
-each slice of data is 784 pixels and a label
-lines 25-34 splits that into input and output
-input would be an array from 0-783 with the pixel values between 0-1 (white, black)
-output is the label (picture of banana = 784 pixels, banana) -> gets added to the data
-this is done for every single piece of data
-this is loaded into the neural net
-line 41 - run neural net.train - trains the neural net with all data loaded into it using the training options defined on lines 8-11

- epochs are the # of generations it trains (i.e. it will train with every drawing 128 times)
  -batchsize = how many pieces of data it's training with at a given time
  -line 41 - callback function finishedTraining console logs 'finished training' and then runs nn.save(nn = neural net)
  (many ML5 functions require callback functions)
  -line 46 - nn.save() saves the trained neural net and its data
  -when you run the program and inspect the browser console, you can see ML5 start running
  -after about 30 seconds you will see training data messages in the console
  -once it starts you will get a graph in the browser that will show the training data as it trains (will do this on its own)
  -for every generation/epoch that it trains you will see new 'loss' value (the lower the loss, the more accurate)
  -when the training is finished, 3 files will be generated:
  • model.json & model_meta.json -> info about the structure of the neural net (this is how many layers, type, etc)
  • model.weights.bin -> actual values that train the neural net (values/weights that are changing for each training generation)
  -once we have those files, checkout main branch

**Instance.js**

- instance is everything that loads for an individual user
- contains a local neural net that runs on each browser so each player is operating it locally
  -line 14 - instance creates a new, empty neural net that we will load our data into
  -line 22 - nn.load loads in modelDetails object (lines 16-20) which references the 3 files we saved earlier (which should now be in the public folder)
  -when nn.load runs, it looks for those 3 files, loads them in and sets the neural net (line 22) to equal the one we trained
  -neural net is now loaded and we have it in our new program
  -line 24 - get request to load in data that we can use for testing
  line 36 - nn.classify - what we use to test the neural net (we use it as our input)
  -handleResults gives us our result (whatever the neural net has guessed that the input is)
  -e.g. if our line 36 input was a drawing of a banana (784 pixels), then handleResults will (hopefully) put out result banana

### Heroku

1.  Set up the [Heroku command line tools][heroku-cli]
2.  `heroku login`
3.  Add a git remote for heroku:

[heroku-cli]: https://devcenter.heroku.com/articles/heroku-cli

- **If you are creating a new app...**

  1.  `heroku create` or `heroku create your-app-name` if you have a
      name in mind.
  2.  `heroku config:set JWT=<your secret here!>` to set a secret for JWT signing

Database Setup

3.  `heroku addons:create heroku-postgresql:hobby-dev` to add
    ("provision") a postgres database to your heroku dyno (This creates your production database)

4.  `heroku config:set SEED=true` to get heroku to sync and seed your database

5.  note everytime your app restarts, the database tables will be dropped and re-created. To avoid this you can `config:unset SEED`

- **If you already have a Heroku app...**

  1.  `heroku git:remote your-app-name` You'll need to be a
      collaborator on the app.

Now, you should be deployed!
