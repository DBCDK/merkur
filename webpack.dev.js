/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt or at https://opensource.dbc.dk/licenses/gpl-3.0/
 */

const merge = require("webpack-merge");

const common = require("./webpack.common.js");

module.exports = merge(common, {
	devtool: "inline-source-map"
});
