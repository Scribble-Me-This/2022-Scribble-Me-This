const PORT = process.env.PORT || 8080;
const httpServer = require('./app');

const init = async () => {
  try {
    // start listening (and create a 'server' object representing our server)
    httpServer.listen(PORT, () => console.log(`Mixing it up on port ${PORT}`));
  } catch (ex) {
    console.log(ex);
  }
};

init();
