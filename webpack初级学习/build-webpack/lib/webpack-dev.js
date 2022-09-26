const merge=require("webpack-merge")
const baseConfig=require("./webpack-base")
const webpack=require("webpack")
const devConfig={
    plugins:[
        new webpack.HotModuleReplacementPlugin(),
    ],
    devServer:{
        // contentBase:"./dist",
        hot:true
    }
}
module.exports=merge(baseConfig,devConfig)