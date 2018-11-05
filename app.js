const express = require('express')
const bodyParser = require('body-parser')

const app = express()

// 设置采用默认的模板引擎名称
app.set('view engine', 'ejs')
// 设置模板引擎存放的路径
app.set('views', './views')

// 把node_modules文件夹托管为静态资源
app.use('/node_modules', express.static('./node_modules'))



// 注册body-parser中间件
app.use(bodyParser.urlencoded({
    extended: false
}))

//  导入router/indexed.js 路由模块
const indexRouter = require('./router/index.js')
app.use(indexRouter)

// 导入用户功能路由模块
const userRouter = require('./router/user.js')
app.use(userRouter)

app.listen(80, () => {
    console.log('server running at http://127.0.0.1');
})