const HtmlWebpackPlugin = require("html-webpack-plugin");
const friendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const { template } = require("./paths");
const { env_obj } = require("./env");
const { _time } = require("../utils");
const path = require("path");
const fs = require("fs");
const ejs = require("ejs"); //ejs模版引擎

// 使用ejs生成html模板
function htmlWebpack(appName) {
    // 读取模板
    const content = ejs.compile(
        fs.readFileSync(
            path.resolve(__dirname, template),
            "utf8"
        )
    );

    // 设置构建时间以及html的title
    const templateContent = content({
        title: appName,
        buildTime: `构建时间：${_time(new Date(), "yyyy-mm-dd hh:ii:ss")}`,
    })

    const htmlConfig = {
        title: appName,
        templateContent,
        filename: "index.html",
        collapseWhitespace: true, // 压缩空白
        removeAttributeQuotes: true,
    };

    return new HtmlWebpackPlugin(htmlConfig);
}

function friendlyErrorsWebpack(DEV) {
    return new friendlyErrorsWebpackPlugin({
        compilationSuccessInfo: {
            messages: [
                DEV
                    ? `Your application is running here: http://localhost:${env_obj && env_obj.PORT ? env_obj.PORT : 3000
                    }`
                    : "Your build success",
            ],
        },
    });
}

module.exports = { htmlWebpack, friendlyErrorsWebpack };
