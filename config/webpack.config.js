const { DefinePlugin } = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCss = require("mini-css-extract-plugin");
const friendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin")

const { entry, output, template, appSrc, node_modules } = require("./paths");
const serverProxy = require("./proxy")
const { env_obj, envStringified } = require('./env')

module.exports = function (webpackEnv) {
    const devMode = webpackEnv.WEBPACK_SERVE

    return {
        mode: devMode ? "development" : "production",
        entry,
        output: {
            path: output,
            filename: 'js/[name][contenthash:5].js',
        },
        stats: 'errors-only',
        devServer: {
            static: { directory: output },
            host: env_obj.host || 'localhost',
            client: {
                webSocketTransport: 'ws',
                logging: 'error'
            },
            webSocketServer: 'ws',
            hot: true,
            compress: true,
            port: env_obj.PORT || 3000,
            proxy: serverProxy()
        },
        resolve: {
            extensions: ['*', '.js', '.jsx', '.ts', '.tsx']
        },
        module: {
            rules: [
                {
                    enforce: 'pre',
                    exclude: /@babel(?:\/|\\{1,2})runtime/,
                    test: /\.(js|mjs|jsx|ts|tsx|css)$/,
                    loader: require.resolve('source-map-loader')
                },
                {
                    test: /\.ts|tsx?$/i,
                    use: [
                        {
                            loader: 'ts-loader',
                            options: {
                                compilerOptions: {
                                    noEmit: false,
                                }
                            }
                        }
                    ],
                    include: appSrc,
                },
                {
                    test: /\.js|jsx?$/i,
                    use: [
                        {
                            loader: "babel-loader",
                            options: {
                                babelrc: true,
                                presets: ['@babel/preset-react', '@babel/preset-env'],
                                plugins: ['@babel/plugin-transform-runtime'],
                                cacheDirectory: true
                            },
                        }
                    ],
                    include: appSrc,
                    exclude: node_modules
                },
                {
                    test: /\.css$/i,
                    use: [
                        devMode ? "style-loader" : MiniCss.loader,
                        "css-loader",
                        "postcss-loader"
                    ],
                    include: appSrc,
                    exclude: node_modules
                },
                {
                    test: /\.less$/i,
                    use: [
                        devMode ? "style-loader" : MiniCss.loader,
                        "css-loader",
                        "postcss-loader",
                        "less-loader"
                    ],
                    include: appSrc,
                    exclude: node_modules
                },
                {
                    test: /\.(png|jpe?g|gif|svg)$/i,
                    use: [{
                        loader: "file-loader",
                        options: {
                            name: "[name][contenthash:5].[ext]",
                            outputPath: "static/"
                        }
                    }],
                    include: appSrc,
                    exclude: node_modules
                },
            ]
        },
        devtool: "source-map",
        plugins: [
            new HtmlWebpackPlugin({
                template,
                filename: "index.html",
                collapseWhitespace: true, // 压缩空白
                removeAttributeQuotes: true
            }),
            new DefinePlugin(envStringified),
            new CleanWebpackPlugin(),
            new friendlyErrorsWebpackPlugin({
                compilationSuccessInfo: {
                    messages: devMode
                        ? [`Your application is running here: http://localhost:${env_obj && env_obj.PORT ? env_obj.PORT : 3000}`]
                        : ['Your build success']
                }
            }),
            new MiniCss({
                filename: 'css/[name][contenthash:5].css'
            }),
        ]
    }
}