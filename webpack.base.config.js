const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { EnvironmentPlugin } = require('webpack');

require('dotenv').config({
  path: path.resolve(
    __dirname,
    process.env.NODE_ENV === 'development' ? '.env.dev' : '.env.prod',
  ),
});

module.exports = {
  entry: {
    popup: path.resolve(__dirname, 'src/popup/index.jsx'),
    background: path.resolve(__dirname, 'src/background/index.js'),
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      assets: path.resolve(__dirname, 'assets'),
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
        ],
      },
      {
        test: /\.(ttf|woff|woff2|otf|eot|fnt)$/,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
      {
        test: /\.(png|jpe?g|svg|gif)$/,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
      {
        test: /\.(mp4|webm)$/,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
      {
        test: /\.(wav|mp3|ogg|m4a)$/,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlPlugin({
      filename: 'popup.html',
      template: path.resolve(__dirname, 'src/popup/index.ejs'),
      chunks: ['popup'],
    }),
    new CopyPlugin({
      patterns: [path.resolve(__dirname, 'src/manifest.json')],
    }),
    new EnvironmentPlugin(['ORIGIN']),
  ],
};
