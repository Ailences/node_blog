const express = require('express')
const router = express.Router()

// 请求首页
router.get('/', (req, res) => {
    res.render('index.ejs', {})
})
// 把路由对象暴露出去
module.exports = router