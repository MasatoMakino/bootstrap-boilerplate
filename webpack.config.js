"use strict";
const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: {
    main: "./src/js/main.js"
  },
  output: {
    path: `${__dirname}/dist/js`,
    filename: "[name].js"
  },
  resolve: {
    extensions: [".js", ".webpack.js", ".web.js"]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env"]
        }
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery",
      Popper: ["popper.js", "default"],
      // In case you imported plugins individually, you must also require them here:
      Util: "exports-loader?Util!bootstrap/js/dist/util",
      Dropdown: "exports-loader?Dropdown!bootstrap/js/dist/dropdown"
    })
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: "initial",
          name: "vendor",
          test: /node_modules/,
          enforce: true
        }
      }
    }
  }
};
