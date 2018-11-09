const conn = require('../db/db.js')
module.exports = {
    handleIndexGet(req, res) {
        // console.log(req.session)
        let pageSize = 3

        let currentPage = parseInt(req.query.page) || 1

        const querySql = `select a.id, a.title, a.ctime, u.nickname, u.username from articles as a
        left join users as u
        on a.author_id = u.id
        order by a.id desc
        limit ${(currentPage - 1) * pageSize} , ${pageSize};
        select count(*) as count from articles;`

        conn.query(querySql, (err, result) => {
            // console.log(result)
            if (!result) result = [
                []
            ]

            let totalCount = result[1][0].count
            let totalPage = Math.ceil(totalCount / pageSize)
            // console.log(currentPage)
            // console.log(totalPage);
            
            res.render('./index.ejs', {
                user: req.session.user,
                isLogin: req.session.isLogin,
                articles: result[0],
                totalPage: totalPage,
                currentPage: currentPage
            })
        })

    }
}