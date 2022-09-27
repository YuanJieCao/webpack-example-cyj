const path = require("path");
const webpack = require("webpack");
module.exports = {
    entry: {
        vendor: ['vue', "element-ui"]
    },
    output: {
        path: path.resolve(__dirname, "../dist/public/js"),
        filename: "[name].dll.js",
        library: "[name]_library"
    },
    plugins: [
        //内置插件，抽离
        new webpack.DllPlugin({
            path: path.resolve(__dirname, '../dist/public/js/[name]-manifest.json'),
            name: "[name]_library",
            context: __dirname
        })
    ]
}