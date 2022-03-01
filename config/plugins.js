const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const friendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCss = require("mini-css-extract-plugin");

const { getENV, processEnv } = require("./env");
const { template } = require("./paths");
const { _time } = require("../utils");
const path = require("path");
const fs = require("fs");
const ejs = require("ejs"); //ejs模版引擎

// 使用ejs生成html模板
function htmlWebpack() {
    const { appName } = getENV()
    // 读取模板
    const content = ejs.compile(
        fs.readFileSync(path.resolve(__dirname, template), "utf8")
    );

    // 设置构建时间以及html的title
    const templateContent = content({
        title: appName,
        buildTime: `构建时间：${_time(new Date(), "yyyy-mm-dd hh:ii:ss")}`,
    });

    const htmlConfig = {
        templateContent,
        filename: "index.html",
        collapseWhitespace: true, // 压缩空白
        removeComments: true,
    };

    return new HtmlWebpackPlugin(htmlConfig);
}

function friendlyErrorsWebpack() {
    const { PORT, __DEV__ } = getENV()

    return new friendlyErrorsWebpackPlugin({
        compilationSuccessInfo: {
            messages: [
                __DEV__
                    ? `Your application is running here: http://localhost:${PORT ? PORT : 3000
                    }`
                    : "Your build success",
            ],
        },
    });
}

module.exports = function (webpackEnv) {
    const plugins = [
        new webpack.DefinePlugin({
            process: {
                env: processEnv()
            },
        }),
        new MiniCss({ filename: "css/[name][contenthash:5].css" }),
        htmlWebpack(),
        friendlyErrorsWebpack(),
    ];

    // 只有打包时才启用该插件
    if (!webpackEnv.WEBPACK_SERVE) {
        plugins.push(new CleanWebpackPlugin());
    }

    return plugins;
};
