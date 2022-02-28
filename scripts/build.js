const webpack = require("webpack");
const webpackConfig = require("../config/webpack.config.js");

process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';
process.env.__DEV__ = false;

const appName = process.env.npm_package_name
const compiler = webpack(webpackConfig({ WEBPACK_SERVE: false, appName }))

compiler.run()