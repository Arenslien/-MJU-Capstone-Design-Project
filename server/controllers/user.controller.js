const db = require("../models");
const BadRequestError = require('../components/exceptions/exceptions');

const User = db.User;

const getUserBy = async (req, res) => {
    console.log('[START] GET/getUserBy');

    try {
        User.findOne({ where: { kakao_email: req.query.email}})
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
            console.log('[SUCCESS] GET/getUserBy');
            return res.status(200).send({res: true, message: "Succeeded to get user information", data: userInfo});
        });
    } catch(err) {
        console.log('[FAIL] GET/getUserBy');
        console.log(err);
        return res.status(500).send({ res: false, message: `Failed to get user information. The reason why ${err}` });
    }

}

const updateUser = async (req, res) => {
    console.log('[START] PUT/updateUser');

    try {
        User.findOne({ 
            where: { 
                kakao_email: req.body.email
            }
        }).then((user) => {
            if(user) {
                user.update({
                    gender: req.body.gender,
                    name: req.body.nickname,
                },
                {
                    where: { 
                        kakao_email: req.body.email
                    }
                });
                
                console.log('[SUCCESS] PUT/updateUser');
                return res.status(200).send({ res: true, message: "Succeeded to update user."});
            } else {
                console.log('[FAIL] PUT/updateUser');
                return res.status(500).send({ res: false, message: `User doesn't exist.` });
            }
        });
    } catch(err) {
        console.log('[FAIL] PUT/updateUser');
        return res.status(500).send({ res: false, message: `Failed to update user. The reason why ${err}` });
    }
}

const deleteUser = async (req, res) => {
    console.log('[START] DELETE/deleteUser');
    const user_id = parseInt(req.params.id);

    try {
        if (user_id === undefined) throw new BadRequestError('You must include id on uri.');

        User.destroy({
            where: {
                user_id: user_id,
            }
        }).then(result => {
            console.log(result);
        })

        console.log('[SUCCESS] DELETE/deleteUser');
        return res.status(200).send({ res: true, message: "Succeeded to delete user."})
    } catch(err) {
        console.log('[FAIL] DELETE/deleteUser');
        return res.status(500).send({ res: false, message: `Failed to delete user. The reason why ${err}` });
    }
}

module.exports = {
    getUserBy,
    updateUser,
    deleteUser,
}
