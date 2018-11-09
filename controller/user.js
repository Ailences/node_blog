const moment = require('moment')
const conn = require('../db/db.js')
const bcrypt = require('bcrypt')
const saltRounds = 10

module.exports = {
    handleRegisterGet(req, res) {
        res.render('./user/register.ejs', {})
    },
    handleLoginGet(req, res) {
        res.render('./user/login.ejs', {})
    },
    handleRegisterPost(req, res) {
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
            // console.log(err)
            // console.log(result)
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
            bcrypt.hash(user.password, saltRounds, function (err, hash) {
                // 给用户密码加密
                // user.password = hash
                console.log(hash)
                // 当用户名不存在时执行sql语句添加用户
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
    },
    handleLoginPost(req, res) {
        // 获取用户登录时提交的信息
        const user = req.body
        // 查询用户是否存在,密码是否正确
        const querySql = 'select * from users where username = ? '
        conn.query(querySql, user.username, (err, result) => {
            if (err) return res.status(500).send({
                status: 500,
                msg: '登录失败!请重试!'
            })
            if (result.length === 0) return res.status(400).send({
                status: 400,
                msg: '用户名或密码错误!请重试!'
            })
            // 用 bcrypt.compare() 对用户输入密码进行比较
            bcrypt.compare(user.password, result[0].password, (err, compareResult) => {
                if (err || !compareResult) return res.status(400).send({
                    status: 400,
                    msg: '用户名或密码错误!请重试!'
                })
                // 登录成功存储用户信息到session中
                // console.log(result)
                req.session.user = result[0]
                req.session.isLogin = true
                // 设置cookie过期时间
                let hour = 1000 * 60 * 60 * 24 * 30
                req.session.cookie.expires = new Date(Date.now() + hour)
                res.send({
                    status: 200,
                    msg: '恭喜您!登录成功!'
                })
            })
        })

    },
    handleLogoutGet(req, res) {
        req.session.destroy((err => {
            res.redirect('/')
        }))

    }
}