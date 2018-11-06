const express = require('express')
const router = express.Router()
const ctrl = require('../controller/index.js')
// 请求首页
router.get('/', ctrl.showIndexPage)
// 把路由对象暴露出去
module.exports = router