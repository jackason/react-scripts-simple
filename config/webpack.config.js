const MiniCss = require("mini-css-extract-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const { entry, output, appSrc, node_modules } = require("./paths");
const plugins = require("./plugins");
const path = require("path")

module.exports = function (webpackEnv) {
  const devMode = webpackEnv.WEBPACK_SERVE;

  const mode = devMode ? "development" : "production";
  const target = devMode ? "web" : "browserslist";
  const devtool = webpackEnv.SOURCE_MAP ? "source-map" : "eval-source-map";

  return {
    mode,
    entry,
    output: {
      path: output,
      filename: "js/[name][contenthash:5].js",
    },
    stats: "errors-only",
    resolve: {
      extensions: ["*", ".js", ".jsx", ".ts", ".tsx"],
      alias: {
        '@': path.join(appSrc),
      },
    },
    target,
    module: {
      rules: [
        {
          enforce: "pre",
          exclude: /@babel(?:\/|\\{1,2})runtime/,
          test: /\.(js|mjs|jsx|ts|tsx|css)$/,
          loader: require.resolve("source-map-loader"),
        },
        {
          test: /\.ts|tsx?$/i,
          use: [
            {
              loader: "ts-loader",
              options: {
                compilerOptions: {
                  noEmit: false,
                },
              },
            },
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
                presets: ["@babel/preset-react", "@babel/preset-env"],
                plugins: ["@babel/plugin-transform-runtime"],
                cacheDirectory: true,
              },
            },
          ],
          include: appSrc,
          exclude: node_modules,
        },
        {
          test: /\.css$/i,
          use: [
            devMode ? "style-loader" : MiniCss.loader,
            {
              loader: "css-loader",
              options: {
                modules: {
                  localIdentName: "[local]_[hash:6]"
                }
              }
            },
            "postcss-loader",
          ],
          include: appSrc,
          exclude: node_modules,
        },
        {
          test: /\.less$/i,
          use: [
            devMode ? "style-loader" : MiniCss.loader,
            {
              loader: "css-loader",
              options: {
                modules: {
                  localIdentName: "[local]_module_[hash:6]"
                }
              }
            },
            "postcss-loader",
            "less-loader",
          ],
          include: appSrc,
          exclude: node_modules,
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "[name][contenthash:5].[ext]",
                outputPath: "static/",
              },
            },
          ],
          include: appSrc,
          exclude: node_modules,
        },
      ],
    },
    optimization: {
      minimize: true,
      minimizer: [
        // 配置生产环境的压缩方案：js和css
        new TerserWebpackPlugin({
          // 开启多进程打包
          parallel: true,
        }),
      ],
    },
    devtool,
    plugins: plugins(webpackEnv),
  };
};
