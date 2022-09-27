const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const {VueLoaderPlugin} = require("vue-loader")
const miniCssExtractPlugin = require("mini-css-extract-plugin")
const webpack = require("webpack")
const {CleanWebpackPlugin} = require("clean-webpack-plugin")
//打包展示为方便交互的直观树状图
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
console.log(path.join(__dirname, '../public'))
//判断生产还是开发环境 true 就是开发环境，false是生产环境
const devMode = process.argv.indexOf('--mode=production') === -1;
const config = {
    //对于bundle的控制
    stats: 'errors-only',
    devtool: "eval-cheap-source-map",
    devServer: {
        proxy: {
            "/api": {
                target: 'http://localhost:3000',
                pathRewrite: {'^/api': ''},
                secure: false,

            }
        },
        host: '127.0.0.1',
        port: 3000,
        //添加响应头
        // headers: {
        //     'X-Custom-Foo': 'bar',
        // },
        hot: true,
        // static: {
        //     directory: path.join(__dirname, 'dist'),
        // },
        static: {
            directory: path.join(__dirname, '../public')
        },
        //当出现问题全屏显示
        client: {
            overlay: {
                //细化
                errors: true,
                warnings: false
            },
            progress: true
        },
        // stats:"errors-only"
    },

    //这里可以配置多页面打包
    entry: {
        app: "./src/main.js"
        // vendors:"./src/vendors.js"
    },
    output: {
        path: path.resolve(__dirname, "../dist"),
        filename: "js/[name][hash:5].js",
        chunkFilename: "js/[name][hash:5].js",
        // clean: true
    },
    resolve: {
        //设置一些我们想要的别名
        alias: {
            '@': path.resolve(__dirname, "src/"),
            //.vue结尾的文件
            '.vue$': path.resolve(__dirname, "src/")
        },
        //指定顺序进行解析
        // extensions: ['*', ".js", ".json", ".vue"]
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    // miniCssExtractPlugin.loader,
                    {
                        loader: devMode ? 'vue-style-loader' : miniCssExtractPlugin.loader,
                        options: {
                            publicPath: path.resolve(__dirname, "dist/css/"),
                            //这句话的意思不太懂
                            hmr: devMode
                        }
                    },

                    // "style-loader",

                    "css-loader",
                    //为css添加浏览器前缀
                    {
                        loader: 'postcss-loader', options:
                            {
                                postcssOptions: {
                                    ident: "postcss",
                                    plugins: [require("autoprefixer")()]
                                }
                            }
                    },
                    "sass-loader"]
            }
            ,
            //解析vue文件 需要的loader vue-loader vue-template-complier vue-style-loader
            //vue-loader 还有着挺多的配置
            {
                test: /\.vue$/,
                use: ['cache-loader', 'thread-loader', {
                    loader: "vue-loader",
                    //选项
                    options: {preserveWhitespace: false}
                }]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    //babel的preset 是编译成commom.js tree-shaking 是对于es模块
                    {
                        loader: "babel-loader",
                        // options: {
                        //     //只会转义es6,es7,8 对于更高的api不会转义，需要新的配置 使用polyfill 在入口文件中使用
                        //     presets: ["@babel/preset-env"]
                        // }
                    }
                ]
            }
            ,
            {
                //打包图片等的静态资源
                test: /.(jpe?g|png|gif)$/i,
                use: [{
                    //此loader 通过limit的配置将图片转换为base64
                    loader: "url-loader",
                    options: {
                        limit: 10240,
                        fallback: {
                            loader: "file-loader",
                            options: {
                                name: 'img/[name].[hash:8].[ext]'
                            }
                        }
                    }
                }]
            },
            {
                test: /.(mp4|webm|ogg|mp3|wav|flac|aac)$/, //媒体文件
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10240,
                        fallback: {
                            loader: 'file-loader',
                            options: {
                                name: 'media/[name].[hash:8].[ext]'
                            }
                        }
                    }
                }]
            }, {
                // test: /.(woff2?|eot|ttf|otf)(?.*)?$/i, // 错误？
                test: /.(woff2?|eot|ttf|otf)$/i, // 字体
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10240,
                        fallback: {
                            loader: 'file-loader',
                            options: {
                                name: 'fonts/[name].[hash:8].[ext]'
                            }
                        }
                    }
                }]
            },
        ]
    },
    plugins: [
        //多入口打包
        new HtmlWebpackPlugin({
            template: "./index.html",
            filename: "index.html"
        }),
        //是将所有的css样式合并为一个css文件
        new miniCssExtractPlugin({
            filename: "[name].[hash].css",
            chunkFilename: "[id].css"
        }),
        new VueLoaderPlugin(),
        // new CleanWebpackPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        //    在这里添加一个连接到打包完的vendor中
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require("../vendor-manifest.json")
        }),
        // new BundleAnalyzerPlugin({
        //     analyzerHost: "127.0.0.1",
        //     analyzerPort: 8889
        // }),
        new FriendlyErrorsWebpackPlugin()
    ],
    mode: "development",
}
module.exports = config