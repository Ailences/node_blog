const moment = require('moment')
const conn = require('../db/db.js')

module.exports = {
    handleArticleAddGet(req, res) {
        // 判断用户是否登录 ,处理登录拦截
        // console.log(req.session)
        if (!req.session.isLogin) return res.redirect('/')
        res.render('./articles/add.ejs', {
            user: req.session.user,
            isLogin: req.session.isLogin
        })
    },
    handleArticleAddPost(req, res) {
        if (!req.session.isLogin) return res.status(400).send({
            status: 400,
            msg: '您的登录信息已失效!请保存文章后重新登录!'
        })
        const body = req.body
        body.ctime = moment().format('YYYY-MM-DD HH:mm:ss')
        body.author_id = req.session.user.id
        const insertSql = 'insert into articles set ?'
        conn.query(insertSql, body, (err, result) => {
            // console.log(err)
            // console.log(result)
            if (err) return res.status(500).send({
                status: 500,
                msg: '文章发表失败!请重试!'
            })
            res.send({
                status: 200,
                msg: '文章发布成功',
                articleId: result.insertId
            })
        })
    },
    handleArticleInfoGet(req, res) {
        res.render('./articles/info.ejs', {
            user: req.session.user,
            isLogin: req.session.isLogin
        })
    }
}