module.exports = {
    showIndexPage(req, res) {
        console.log(req.session)
        res.render('index.ejs', {
            user: req.session.user,
            isLogin: req.session.isLogin
        })
    }
}