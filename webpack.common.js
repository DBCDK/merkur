/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt or at https://opensource.dbc.dk/licenses/gpl-3.0/
 */

const path = require("path");

module.exports = {
    entry: [
        'babel-polyfill',
        path.resolve(__dirname, "src", "main.js")
    ],
    output: {
        path: path.resolve(__dirname, "src", "static", "js"),
        filename: "bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, "src"),
                    // building with UglifyJsPlugin fails if these modules
                    // are not transformed
                    path.resolve(__dirname, "node_modules", "query-string"),
                    path.resolve(__dirname, "node_modules", "strict-uri-encode")
                ],
                use: [
                    { loader: "babel-loader" }
                ]
            }
        ]
    }
};
