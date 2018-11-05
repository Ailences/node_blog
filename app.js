const express = require('express')
const app = express()

// 设置采用默认的模板引擎名称
app.set('view engine', 'ejs')
// 设置模板引擎存放的路径
app.set('views', './views')

// 把node_modules文件夹托管为静态资源
app.use('/node_modules', express.static('./node_modules'))


// 请求首页
app.get('/', (req, res) => {
    res.render('index.ejs', {})
})
// 请求注册页面
app.get('/register', (req, res) => {
    res.render('./user/register.ejs', {})
})

// 请求登录页面
app.get('/login', (req, res) => {
    res.render('./user/login.ejs', {})

})
app.listen(80, () => {
    console.log('server running at http://127.0.0.1');
})