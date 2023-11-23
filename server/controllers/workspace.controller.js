// const db = require("../models");

// const Workspace = db.Workspace;

const getWorkspaces = async (req, res) => {
    console.log('[START] GET/getWorkspaces');

    try {
        // Tourist.findOne({ where: { kakao_email: req.body.kakao_email}})
        // .then(user => 
        //     {var userInfo = { 
        //         user_id: user.user_id,
        //         kakao_email: user.kakao_email,
        //         nickname: user.name,
        //         gender: user.gender,
        //         join_date: user.join_date,
        //         category_1: user.category_1,
        //         category_2: user.category_2,
        //         category_3: user.category_3,
        //     };
        //     console.log('[SUCCESS] GET/getUserBy');
        //     return res.status(200).send({res: true, message: "Succeeded to get user information", data: userInfo});
        // });
    } catch(err) {
        console.log('[FAIL] GET/getWorkspaces');
        return res.status(500).send({ res: false, message: `Failed to get workspaces information. The reason why ${err}` });
    }

    console.log("[SUCCESS] Connected Well.");
    res.status(200).send({ res: true, message: "Connected Well."});
}

module.exports = {
    getWorkspaces
}
