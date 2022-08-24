// const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
// const path = require("path");
module.exports = {
  entry: ["./client/index.js"],
  output: {
    path: __dirname,
    filename: "./public/bundle.js",
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: [
          /node_modules/,
        ],
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-react"],
        },
      },
      {
        test: /\.bin$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'url-loader',
             options: {
               encoding: false,
               mimetype: false,
               generator: (content) => {
                 return content;
               }
             },
           },
         ],
      }
    ],
  },
  // plugins: [new NodePolyfillPlugin()],
  // resolve: {
  //   fallback: {
  // path.resolve(__dirname, 'script/allDataGetter.js'),
  // path.resolve(__dirname, 'script/QuickDrawGetter.js'),
  // path.resolve(__dirname, 'script/selectDataGetter.js'),
  //     fs: false,
  //   },
  // },

};
