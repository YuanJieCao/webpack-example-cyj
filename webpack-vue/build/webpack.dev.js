//开发环境的配置
const webpackConfig = require('./webpack.config.js')
const webpack = require("webpack")
const merge = require("webpack-merge")
const path = require("path")
module.exports = merge(webpackConfig, {

    mode: "development",
    //source map
    devtool: "cheap-module-eval-source-map",
    devServer: {
        port: 3000,
        static: {
            directory: path.join(__dirname, 'dist'),
        },

        hot: true
    },
    plugins: [new webpack.HotModuleReplacementPlugin()]


})