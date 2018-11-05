const express = require('express')
const bodyParser = require('body-parser')
const moment = require('moment')
const mysql = require('mysql')
const conn = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'blog'
})
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

// 新用户注册
app.post('/register', (req, res) => {
    // console.log(req.body)
    // 获取用户注册信息
    const user = req.body
    // 判断用户信息是否合法
    if (user.username.trim().length === 0 ||
        user.password.trim().length === 0 ||
        user.nickname.trim().length === 0) return res.status(400).send({
        status: 400,
        msg: '请填写完整的表单信息'
    })
    // 查寻当前传递过来的用户名是否已存在
    const querySql = 'select count(*) as count from users where username = ?'
    conn.query(querySql, user.username, (err, result) => {
        console.log(err)
        console.log(result)
        if (err) return res.status(500).send({
            status: 500,
            msg: '用户查询失败!请重试!'
        })
        if (result[0].count != 0) return res.status(402).send({
            status: 402,
            msg: '用户名已存在!请重试!'
        })
        // 给用户添加创建时间属性
        user.ctime = moment().format('YYYY-MM-DD HH:mm:ss')
        // 注册用户
        const addSql = "insert into users set ?"
        conn.query(addSql, user, (err, result) => {
            // console.log(result)
            if (err || result.affectedRows != 1) return res.status(500).send({
                status: 500,
                msg: '用户添加失败!请重试!'
            })
            res.send({
                status: 200,
                msg: '用户注册成功'
            })
        })
    })
})

// 用户登录
app.post('/login', (req, res) => {
    // 获取用户登录时提交的信息
    const user = req.body
    // 查询用户是否存在,密码是否正确
    const querySql = 'select * from users where username = ? and password = ?'
    conn.query(querySql, [user.username, user.password], (err, result) => {
        if (err) return res.status(500).send({
            status: 500,
            msg: '登录失败!请重试!'
        })
        if (result.length === 0) return res.status(400).send({
            status: 400,
            msg: '用户名或密码错误!请重试!'
        })
        res.send({
            status: 200,
            msg: '恭喜您!登录成功!'
        })
    })

})

app.listen(80, () => {
    console.log('server running at http://127.0.0.1');
})