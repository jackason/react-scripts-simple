const path = require("path")
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCss = require("mini-css-extract-plugin");
const friendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin")

const { entry, output, template } = require("./path");
const serverProxy = require("./proxy")
const env = require('./env')


// 是否开发者模式
const devMode = process.env.NODE_ENV !== 'production'

module.exports = {
    mode: process.env.NODE_ENV,
    entry,
    output: {
        path: output,
        filename: 'js/[name].bundle[fullhash:5].js',
    },
    stats: 'errors-only',
    devServer: {
        static: { directory: output },
        host: '0.0.0.0',
        client: {
            progress: true,
            webSocketTransport: 'ws',
        },
        webSocketServer: 'ws',
        hot: true,
        compress: true,
        port: env.PORT || 3000,
        proxy: serverProxy()
    },
    plugins: [
        new HtmlWebpackPlugin({
            template,
            filename: "index.html",
            collapseWhitespace: true, // 压缩空白
            removeAttributeQuotes: true
        }),
        new CleanWebpackPlugin(),
        new friendlyErrorsWebpackPlugin({
            compilationSuccessInfo: {
                messages: ['Your application is running here: http://localhost:' + env.PORT || 3000]
            }
        }),
        new MiniCss({
            filename: 'css/[name].app.[fullhash:5].css'
        }),
    ]
}