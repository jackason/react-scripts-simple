const webpackDevServer = require('webpack-dev-server');
const webpack = require("webpack");
const webpackConfig = require("../config/webpack.config.js");
const { output } = require("../config/paths");
const serverProxy = require("../config/proxy")
require('../config/env');

process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';
process.env.__DEV__ = true;

const PORT = process.env.PORT || 3000;
const HOST = process.env.host || 'localhost';
const HTTPS = process.env.HTTPS || false;
const proxy = serverProxy()
const appName = process.env.npm_package_name

console.log()

console.log()
console.log(proxy)
console.log()

const compiler = webpack(webpackConfig({ WEBPACK_SERVE: true, appName }));
const serverConfig = {
    static: { directory: output },
    port: PORT,
    host: HOST,
    client: {
        webSocketTransport: 'ws',
        logging: 'error',
        reconnect: 5
    },
    webSocketServer: 'ws',
    hot: true,
    compress: true,
    https: HTTPS,
    proxy
}

const server = new webpackDevServer(serverConfig, compiler)
server.start();


process.stdin.on('end', function () {
    console.log(12)
    // devServer.close();
    // process.exit();
});