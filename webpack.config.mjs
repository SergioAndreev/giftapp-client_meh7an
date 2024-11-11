import Webpack from "webpack";
import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import * as sass from "sass";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { fileURLToPath } from "url";
import { dirname } from "path";
import loaderUtils from "loader-utils";
// import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import ESLintWebpackPlugin from "eslint-webpack-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default (env = {}, argv = {}) => {
  const isDevelopment = argv.mode === "development";

  const getLocalIdent = (context, localIdentName, localName, options) => {
    const relativePath = context.resourcePath
      .replace(`${context.rootContext}/`, "")
      .replace(/\.[^/.]+$/, "");

    const dirs = relativePath.split("/");
    dirs.pop();
    const pathPrefix = dirs.join(".");

    if (isDevelopment) {
      const hash = loaderUtils.getHashDigest(
        Buffer.from(context.resourcePath + localName),
        "md5",
        "base64",
        5
      );
      return `[${localName}]:${pathPrefix}_${hash}`.replace(/\./g, "_");
    }

    return loaderUtils.getHashDigest(
      Buffer.from(context.resourcePath + localName),
      "md5",
      "base64",
      8
    );
  };

  return {
    performance: {
      // ignore
      hints: false,
      maxAssetSize: 1024 * 1024,
      maxEntrypointSize: 1024 * 1024,
    },
    entry: "./index.tsx",
    output: {
      path: path.resolve(__dirname, "./dist"),
      filename: "bundle.js",
      clean: true,
      publicPath: "/",
    },
    module: {
      rules: [
        {
          test: /animations\/.*\.json$/,
          type: "asset/resource",
          generator: {
            filename: "animations/[hash][ext]",
          },
        },
        {
          test: /locales\/.*\.json$/,
          type: "json",
          parser: {
            parse: JSON.parse,
          },
        },
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: "ts-loader",
              options: {
                configFile: "tsconfig.json",
                transpileOnly: true,
              },
            },
          ],
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                modules: {
                  getLocalIdent,
                  exportLocalsConvention: "camelCase",
                },
              },
            },
          ],
        },
        {
          test: /\.module\.s(a|c)ss$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                modules: {
                  getLocalIdent,
                  namedExport: false,
                  exportLocalsConvention: "camelCase",
                },
                importLoaders: 1,
                sourceMap: true,
              },
            },
            {
              loader: "sass-loader",
              options: {
                implementation: sass,
                sourceMap: true,
              },
            },
          ],
        },
        {
          test: /\.s(a|c)ss$/,
          exclude: /\.module\.s(a|c)ss$/,
          use: [
            MiniCssExtractPlugin.loader,
            "css-loader",
            {
              loader: "sass-loader",
              options: {
                implementation: sass,
              },
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
      alias: {
        "@": path.resolve(__dirname, "./"),
      },
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./index.html",
      }),
      new Webpack.ProvidePlugin({
        React: "react",
      }),
      new MiniCssExtractPlugin({
        filename: "style.css",
      }),
      // new BundleAnalyzerPlugin(),
      new CleanWebpackPlugin(),
      new ESLintWebpackPlugin({
        extensions: ["js", "jsx", "ts", "tsx"],
      }),
    ],
    devServer: {
      static: {
        directory: path.join(__dirname, "../dist"),
      },
      port: 4609,
      hot: true,
      allowedHosts: "all", // Allow all hosts
      host: "0.0.0.0", // Listen on all network interfaces
      historyApiFallback: {
        // Change this from just 'true' to an object
        disableDotRule: true,
        index: "/",
      },
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
          "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers":
          "X-Requested-With, content-type, Authorization",
      },
      client: {
        webSocketURL: "auto://0.0.0.0:0/ws",
        reconnect: 5, // Try to reconnect 5 times
      },
      webSocketServer: {
        options: {
          path: "/ws",
        },
      },
      watchFiles: {
        options: {
          usePolling: true,
        },
      },
    },
  };
};
