const path = require('path');

module.exports = {
  experiments: {
    outputModule: true
  },
  entry: './socketConnection.js', 
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'websockets-connection.bundle.js',
    
    libraryTarget: 'module',
    globalObject: 'this',
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', 
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
  },
};