if(typeof window=="undefined)"){
    global.window={}
}else if (typeof  self==="undefined"){
    global.self={}
}
//引入express
const express = require("express")
const {renderToString} = require('react-dom/server')
const SSR = require("../dist/search-server")
const server = (port) => {
    const app = express()
    //创建一个目录
    app.use(express.static("./dist"))
    //创建一个路由
    app.get("/search", (req, res) => {
        //将包裹成字符串的html返回
        const html=renderstring(renderToString(SSR))
        res.status(200).send(
            html
        )
    })
    app.listen(port, () => {
        console.log("3000端口已开")
        console.log(renderstring(renderToString(SSR)))
    })
}
server( 3000)
const renderstring = (str) => {
    console.log(str)
    return `<!doctype html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
            <meta name="viewport"
                  content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
                <meta http-equiv="X-UA-Compatible" content="ie=edge">
                    <title>Document</title>
                   <div id="root"><h1>1111</h1></div> 
    </head>
    <body>
    </body>
    </html>`
}