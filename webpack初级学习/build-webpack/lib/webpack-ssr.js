const path = require("path")
const webpack = require("webpack")
const miniCssExtractPlugin = require("mini-css-extract-plugin")
const optimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin")
const HtmlWebapckPlugin = require("html-webpack-plugin")
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackExternalsPlugin =require("html-webpack-externals-plugin")
const friendlyErrorsWebpackPlugin=require("friendly-errors-webpack-plugin")
const glob = require("glob")
const pwa = function () {
    const entry = {}
    const htmlwebpackplugin = []
    const filenames = glob.sync(path.join(__dirname, "./src/*/index-ssr.js"))
    //获得所有的下标，然后取值
    Object.keys(filenames).map((index) => {
        //将所有的html名字获取到
        const entryfile = filenames[index]
        // /Users/caoyuanjie/WebstormProjects/webpack-all/src/index/index.js
        const pathfile = entryfile.match(/src\/(.*)\/index-ssr\.js/)
        // 如果有pathfile就直接赋值，
        const pageName = pathfile && pathfile[1]
        //生成多个entry
        entry[pageName] = entryfile
        if(pageName){
            htmlwebpackplugin.push(new HtmlWebapckPlugin({
                template: path.join(__dirname, `src/${pageName}/index.html`),
                filename: `${pageName}.html`,
                chunks: [pageName],
                inject: true,
                minify: {
                    html5: true,
                    preserveLineBreaks: false,
                    minifyCSS: true,
                    minifyJS: true,
                    collapseWhitespace: true,
                    removeComments: false
                }
            }),)
        }

    })
    return {
        entry,
        htmlwebpackplugin
    }
}
const {entry, htmlwebpackplugin} = pwa()
module.exports = {
    mode: "none",
    entry: entry,
    output: {
        path: path.join(__dirname, 'dist'),
        filename: "[name]-server.js",
        libraryTarget: "umd"
    },
    module: {
        rules: [
            //静态资源的内联头部
            //css内联可以使用style-loader设置options的配置 将其内联进去
            //还可以通过html-inline-css-loader这个插件实现设置
            //js的内联使用可以使用raw-loader 配合babel-loader使用。就是将其转为json字符串引入。
            {
                test: /\.css$/,
                use:"ignore-loader"
            },

        ]
    },
    plugins: [
        // new HtmlWebpackExternalsPlugin({
        //     externals: [
        //         {
        //             module: 'jquery',
        //             entry: 'dist/jquery.js',
        //             global: 'jQuery',
        //         },
        //     ],
        // }),
        new miniCssExtractPlugin({
            filename: "[name][contenthash:8].css"
        }),
        new optimizeCssAssetsWebpackPlugin({
            assetsNameRegExp: /\.css$/g,
            cssProessor: require("cssnano")
        }),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new CleanWebpackPlugin(),
        new friendlyErrorsWebpackPlugin()
    ].concat(htmlwebpackplugin)


}