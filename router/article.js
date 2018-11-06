const express = require('express')
const router = express.Router()

const ctrl = require('../controller/article.js')

router.get('/article/add', ctrl.handleArticleAddGet)

router.post('/article/add', ctrl.handleArticleAddPost)

router.get('/article/info/:id', ctrl.handleArticleInfoGet)

module.exports = router