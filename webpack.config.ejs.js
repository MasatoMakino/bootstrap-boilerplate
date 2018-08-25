"use strict";

const glob = require("glob");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const getEntriesList = () => {
    const entriesList = {};
    const cwd = `${__dirname}/src/ejs`;

    const filesMatched = glob.sync(`**/*.ejs`, {
        cwd: cwd,
        ignore: `**/_*.ejs`,
    });

    for (const srcName of filesMatched) {
        const targetName = srcName.replace(new RegExp(`.ejs$`, "i"), `.html`);
        entriesList[targetName] = cwd + `/${srcName}`;
    }

    return entriesList;
};

const entryList = getEntriesList();

const app = {
    entry: entryList,
    output: {
        filename: "[name]",
        path: `${__dirname}/dist`,
    },
    module: {
        rules: [
            {
                test: /\.ejs$/,
                use: ["html-loader", "ejs-html-loader"],
            },
        ],
    },
    plugins: [],
};

for (const [targetName, srcName] of Object.entries(entryList)) {
    app.plugins.push(
        new HtmlWebpackPlugin({
            filename: targetName,
            template: srcName,
        })
    );
}

module.exports = app;
