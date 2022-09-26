const merge=require("webpack-merge")
const baseConfig=require("./webpack-base")
const optimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin")
const webpack=require("webpack")
const HtmlWebpackExternalsPlugin =require("html-webpack-externals-plugin")
const proConfig={
    mode:"production",
    plugins:[
        new optimizeCssAssetsWebpackPlugin({
            assetsNameRegExp: /\.css$/g,
            cssProessor: require("cssnano")
        }),
        new HtmlWebpackExternalsPlugin({
            externals: [
                {
                    module: 'jquery',
                    entry: 'dist/jquery.js',
                    global: 'jQuery',
                },
            ],
        }),
    ],
    devServer:{
        // contentBase:"./dist",
        hot:true
    },
    optimization:{
        splitChunks:{
            miniSize:0,
            cacheGroups:{
                commons:{
                    name:"Commons",
                    chunks:"all",
                    miniChunks:2,
                }
            }
        }
    }
}
module.exports=merge(baseConfig,proConfig)