const moment = require('moment')
const conn = require('../db/db.js')
const marked = require('marked')

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
        // 获取传过来的文章id
        const id = req.params.id
        const querySql = 'select * from articles where id = ' + id
        conn.query(querySql, (err, result) => {
            // console.log(result)
            const renderObj = {
                user: req.session.user,
                isLogin: req.session.isLogin
            }
            if (err || result.length !== 1) return res.render('./404.ejs', renderObj)
            result[0].content = marked(result[0].content)
            renderObj.article = result[0]
            res.render('./articles/info.ejs', renderObj)
            // console.log(renderObj)
        })
    },
    handleArticleEditGet(req, res) {
        if (!req.session.isLogin) return res.redirect('/')
        const id = req.params.id
        const querySql = 'select * from articles where id = ' + id
        conn.query(querySql, (err, result) => {
            if (err || result.length !== 1) return res.status(500).send({
                status: 500,
                msg: '文章获取失败!请重试!',
                data: null
            })
            // console.log(result)
            res.render('./articles/edit.ejs', {
                user: req.session.user,
                isLogin: req.session.isLogin,
                article: result[0]
            })
        })
    },
    handleArticleEditPost(req, res) {
        const article = req.body
        article.ctime = moment().format('YYYY-MM-DD HH:mm:ss')
        const updateSql = 'update articles set ? where id = ?'
        // console.log(article)
        conn.query(updateSql, [article, article.id], (err, result) => {
            // console.log(err)
            // console.log(result)
            if (err || result.affectedRows !== 1) return res.status(400).send({
                status: 400,
                msg: '修改文章失败, 请重试!',
                data: null
            })
            // 修改成功, 像客户端响应结果
            res.send({
                status: 200,
                articleId: article.id
            })
        })
    }
}