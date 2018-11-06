const express = require('express')
const router = express.Router()

const ctrl = require('../controller/user.js')


// 分发路由

// 请求注册页面
router.get('/register', ctrl.handleRegisterGet)

// 请求登录页面
router.get('/login', ctrl.handleLoginGet)

// 新用户注册
router.post('/register', ctrl.handleRegisterPost)

// 用户登录
router.post('/login', ctrl.handleLoginPost)

// 用户退出
router.get('/logout', ctrl.handleLogoutGet)

module.exports = router