const db = require("../models");

// const Tourist = db.Tourist;
const User = db.User;

const saveCategory = async (req, res) => {
    console.log('[START] PUT/saveCategory');

    console.log(req.body);

    try {
        User.findOne({ 
            where: { 
                user_id: req.body.user_id
            }
        }).then((user) => {
            if(user) {
                user.update({
                    category_1: req.body.category_1,
                    category_2: req.body.category_2,
                    category_3: req.body.category_3,
                },
                {
                    where: { 
                        user_id: req.body.user_id
                    }
                });
                
                console.log('[SUCCESS] PUT/saveCategory');
                return res.status(200).send({ res: true, message: "Succeeded to save category information."});
            } else {
                console.log('[FAIL] PUT/saveCategory');
                return res.status(500).send({ res: false, message: `User doesn't exist.` });
            }
        });
    } catch(err) {
        console.log('[FAIL] PUT/saveCategory');
        console.log(err);
        return res.status(500).send({ res: false, message: `Failed to save category information. The reason why ${err}` });
    }
}

const getTourists = async (req, res) => {
    console.log('[START] GET/getTourists');

    try {
        //
    } catch(err) {
        console.log('[FAIL] GET/getTourists');
        return res.status(500).send({ res: false, message: `Failed to get tourists information. The reason why ${err}` });
    }

    console.log("[SUCCESS] Connected Well.");
    res.status(200).send({ res: true, message: "Connected Well."});
}

module.exports = {
    saveCategory,
    getTourists
}
