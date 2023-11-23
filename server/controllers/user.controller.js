const db = require("../models");

const User = db.User;

const getUserBy = async (req, res) => {
    console.log('[START] GET/getUserBy');

    try {
        User.findOne({ where: { kakao_email: req.body.kakao_email}})
        .then(user => 
            {var userInfo = { 
                user_id: user.user_id,
                kakao_email: user.kakao_email,
                nickname: user.name,
                gender: user.gender,
                join_date: user.join_date,
                category_1: user.category_1,
                category_2: user.category_2,
                category_3: user.category_3,
            };
            console.log('[SUCCESS] POST/getUserBy');
            return res.status(200).send({res: true, message: "Succeeded to get user information", data: userInfo});
        });
    } catch(err) {
        console.log('[FAIL] POST/login');
        return res.status(500).send({ res: false, message: `Failed to get user information. The reason why ${err}` });
    }

}

const updateUser = async (res) => {
    console.log('[START] PUT/updateUser');

    console.log('[END] PUT/updateUser');
    return res.status(200).send({ res: true, message: "Connection Succeed."})
}

const deleteUser = async (res) => {
    console.log('[START] DELETE/deleteUser');

    console.log('[END] DELETE/deleteUser');
    return res.status(200).send({ res: true, message: "Connection Succeed."})
}

module.exports = {
    getUserBy,
    updateUser,
    deleteUser,
}
