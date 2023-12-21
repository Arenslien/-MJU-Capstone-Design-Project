const db = require("../models");

const User = db.User;

const login = async (req, res) => {
    console.log('[START] POST/login');

    try {
        User.findOne({ where: { kakao_email: req.body.email}})
        .then(user => {
            if (user) {
                var userInfo = { 
                    user_id: user.user_id,
                    kakao_email: user.email,
                    nickname: user.name,
                    gender: user.gender,
                    join_date: user.join_date,
                    category_1: user.category_1,
                    category_2: user.category_2,
                    category_3: user.category_3,
                };
                console.log('[SUCCESS] POST/login - User already existed.');
                return res.status(200).send({res: true, message: "Login succeeded. User already existed.", data: userInfo});
            } else {
                console.log('[SUCCESS] POST/login - User create needed.');
                return res.status(200).send({res: false, message: "Login succeeded. User create needed."});
            }
        });
    } catch(err) {
        console.log('[FAIL] POST/login');
        return res.status(500).send({ res: false, message: `Failed to login. The reason why ${err}` });
    }

}

const signup = async (req, res) => {
    console.log('[START] POST/signup');

    try {
        if(req.body.email == null) {
            return res.status(500).send({ res: false, message: 'Failed to create account. Email required.'})
        }

        User.findOne({ attributes: ['user_id'], order: [['user_id', 'DESC']]})
        .then(data => {
            var _id = (data ? data.dataValues.user_id : 0) + 1;
            var today = new Date();
            var join_date = today.getFullYear() + '-' + ( (today.getMonth()+1) < 9 ? "0" + (today.getMonth()+1) : (today.getMonth()+1) ) + '-' + ( (today.getDate()) < 9 ? "0" + (today.getDate()) : (today.getDate()) );

            User.create({
                user_id: _id,
                kakao_email: req.body.email,
                name: req.body.nickname,
                join_date: join_date,
                category_1: null,
                category_2: null,
                category_3: null,
                gender: req.body.gender,
            }).then(() => {    
                console.log('[SUCCESS] POST/signup - succeeded to create account');
                return res.status(201).send({res: true, message: "succeeded to create account."});
            }).catch(err => {
                console.log('[FAIL] POST/signup');
                console.log(err);
                return res.status(500).send({ res: false, message: `Failed to create account. The reason why ${err}` });
            })
        });
    } catch(err) {
        console.log('[FAIL] POST/signup');
        console.log(err);
        return res.status(500).send({ res: false, message: `Failed to create account. The reason why ${err}` });
    }  
}

module.exports = {
    login,
    signup
}
