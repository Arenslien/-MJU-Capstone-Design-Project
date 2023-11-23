const db = require("../models");

const User = db.User;

const signup = async (req, res) => {
    console.log('[START] POST/signup');

    try {
        var id = await User.count() + 1;
        var today = new Date();
        var join_date = today.setHours(today.getHours() + 9);
        join_date.toISOString().replace('T', ' ').substring(0, 19);

        User.findOne({ where: { kakao_email: req.kakao_email}})
        .then(user => {
            if (user) { 
                /* empty */ 
            } else {
                User.create({
                    user_id: id,
                    kakao_email: req.body.kakao_email,
                    name: req.body.name,
                    join_date: Date.parse(),
                    category_1: null,
                    category_2: null,
                    category_3: null,
                    gender: req.body.gender,
                }).then()
            }
        })
    } catch(err) {
        return res.status(500).send({ res: false, message: `Failed to create account. The reason why ${err}` })
    }  

    
    console.log('[SUCCESS] POST/signup');
}

module.exports = {
    signup
}