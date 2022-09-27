const path = require("path")
const merge = require("webpack-merge")
const webpackConfig = require("./webpack-config")
const HappyPack = require('happypack')
const os = require("os")
const happyThreadPool = HappyPack.threadPool({size: os.cpus().length})
const copyWebpackPlugin = require("copy-webpack-plugin")//拷贝静态资源

//生产环境需要对各类的东西压缩，按需加载，以及切割呀，还有异步加载。    splitChunks
// 并且不需要热更新，不需要
//
module.exports = merge(webpackConfig, {


    plugins: [
        new copyWebpackPlugin(
            [
                {
                    from: path.resolve(__dirname, "../public"),
                    to: path.resolve(__dirname, "../dist/public")
                }]
        ),
        // new HappyPack({
        //
        // })

    ],
    //各类的压缩
    optimization: {

        minimizer: [],
        //代码分割
        splitChunks: {
            chunk: "all"
        }

    },
//在生产环境下，默认开始tree shaking以及js的代码压缩


//    性能的优化，从几个方面着手，通过设置alias 让打包的文件快速定位  include 和exclude 同样的道理
//    对于没有其他依赖的选项 告知webpack不必解析
//    通过设置extension 设置查找的顺序
//    happypack开启多进程的转换
//     使用webpack-parallel-uglify-plugin 增强代码压缩
//    抽离经常不会更换的第三放模块
//    cache-loader  缓存
//     externals
//     Tree-shaking

//     @babel/parser 将源代码解析成 AST
//     @babel/traverse 对AST节点进行递归遍历，生成一个便于操作、转换的path对象
// @babel/generator 将AST解码生成js代码
// @babel/types通过该模块对具体的AST节点进行进行增、删、改、查

//webpack的日志打印
//    webpack的loader  和plugin的手写操作
})