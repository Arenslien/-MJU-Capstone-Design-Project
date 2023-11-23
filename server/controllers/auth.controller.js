const db = require("../models");

const User = db.User;

const login = async (req, res) => {
    console.log('[START] POST/login');

    try {
        User.findOne({ where: { kakao_email: req.body.kakao_email}})
        .then(user => {
            if (user) {
                console.log('[SUCCESS] POST/login - User already existed.');
                return res.status(200).send({res: true, message: "User already existed."});
            } else {
                console.log('[SUCCESS] POST/login - User create needed.');
                return res.status(200).send({res: false, message: "User create needed."});
            }
        });
    } catch(err) {
        console.log('[FAIL] POST/login');
        return res.status(500).send({ res: false, message: `Failed to create account. The reason why ${err}` });
    }

}

const signup = async (req, res) => {
    console.log('[START] POST/signup');

    try {
        var id = await User.count() + 1;
        var today = new Date();
        var join_date = today.getFullYear() + '-' + ( (today.getMonth()+1) < 9 ? "0" + (today.getMonth()+1) : (today.getMonth()+1) ) + '-' + ( (today.getDate()) < 9 ? "0" + (today.getDate()) : (today.getDate()) );

        User.create({
            user_id: id,
            kakao_email: req.body.kakao_email,
            name: req.body.nickname,
            join_date: join_date,
            category_1: null,
            category_2: null,
            category_3: null,
            gender: req.body.gender,
        });

        console.log('[SUCCESS] POST/signup - Success to create account');
        return res.status(201).send({res: true, message: "Success to create account."});

    } catch(err) {
        console.log('[FAIL] POST/signup');
        return res.status(500).send({ res: false, message: `Failed to create account. The reason why ${err}` });
    }  
}

module.exports = {
    login,
    signup
}