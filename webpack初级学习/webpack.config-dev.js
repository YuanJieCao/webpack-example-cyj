const path = require("path")
const webpack = require("webpack")
const glob = require("glob")
const HtmlWebapckPlugin = require("html-webpack-plugin")
const HtmlWebpackExternalsPlugin =require("html-webpack-externals-plugin ")
const friendlyErrorsWebpackPlugin=require("friendly-errors-webpack-plugin")
const pwa = function () {
    const entry = {}
    const htmlwebpackplugin = []
    //
    const filenames = glob.sync(path.join(__dirname, "./src/*/index.js"))
    //获得所有的下标，然后取值
    Object.keys(filenames).map((index) => {
        //将所有的html名字获取到
        const entryfile = filenames[index]
        // /Users/caoyuanjie/WebstormProjects/webpack-all/src/index/index.js
        const pathfile = entryfile.match(/src\/(.*)\/index\.js/)
        // 如果有pathfile就直接赋值，
        const pageName = pathfile && pathfile[1]
        //生成多个entry
        entry[pageName] = entryfile

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
    })
    return {
        entry,
        htmlwebpackplugin
    }
}

const {entry, htmlwebpackplugin} = pwa()
module.exports = {
    mode: "development",
    entry: entry,
    output: {
        path: path.join(__dirname, 'dist'),
        filename: "[name][hash:10].js"
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ["style-loader",
                    "css-loader"]
            },
            {
            test: /\.js$/,
            use: "babel-loader"
            },
            {
                test: /\.scss$/,
                use: [
                    "styles-loader",
                    "css-loader",
                    "scss-loader"
                ]
            },
            {
                test:/\.png|jpg$/,
                use:[
                    {
                        loader:"url-loader",
                        options:{
                            limit:10240
                        }
                    }
                ]
            }


        ]
    }
    ,
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackExternalsPlugin({
            externals: [
                {
                    module: 'jquery',
                    entry: 'dist/jquery.min.js',
                    global: 'jQuery',
                },
            ],
        }),
         new friendlyErrorsWebpackPlugin()
    ].concat(htmlwebpackplugin),
    devServer:{
        // contentBase:"./dist",
        hot:true
    }



}
