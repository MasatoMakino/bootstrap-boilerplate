"use strict";

module.exports = {
  entry: {
    main: "./src/js/main.js",
  },
  output: {
    path: `${__dirname}/dist/js`,
    filename: "[name].js",
  },
  resolve: {
    extensions: [".js", ".webpack.js", ".web.js"],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env"],
        },
      },
    ],
  },
  plugins: [],
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: "initial",
          name: "vendor",
          test: /node_modules/,
          enforce: true,
        },
      },
    },
  },
};
