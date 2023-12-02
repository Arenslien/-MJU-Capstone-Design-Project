const db = require("../models");
const { spawnSync } = require("node:child_process");

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

const getRecommendRequest = async (req, res) => {
    console.log('[START] GET/postRecommendResult');

    try {
        //
        const gender = req.query.gender;
        const age_group = req.query.age_group;
        const travel_style1 = req.query.travel_style1;
        const travel_style5 = req.query.travel_style5;
        const travel_style6 = req.query.travel_style6;

        console.log("\n[Query Parameters]")
        const user_information = ["100000", gender, age_group, travel_style1, travel_style5, travel_style6].join(" ");
        console.log(user_information)
        
        // 1. Tour Spot 코드 실행
        const pyFileDirectory1 = "./../model/dropout-net/get_recommend_result.py";
        const result1 = spawnSync("python", [pyFileDirectory1, "--user-information", "100000", gender, age_group, travel_style1, travel_style5, travel_style6]);

        if (result1.status === 0) {
            // Success!
            console.log("Success!");
            console.log(result1.stdout.toString().trim());
        } else {
            // Error!
            console.log("Error!");
            console.log(result1.stderr.toString().trim());
        }

        // 2. Haversine 코드 실행
        const pyFileDirectory2 = "./../model/haversine/get_workspace_result.py";
        const result_json_dir = "./../model/dropout-net/recommend-result/result.json"
        const result2 = spawnSync("python", [pyFileDirectory2, "--dropoutnet-result-dir", result_json_dir]);

        if (result2.status === 0) {
            // Success!
            console.log("Success!");
            console.log(result2.stdout.toString().trim());
        } else {
            // Error!
            console.log("Error!");
            console.log(result2.stderr.toString().trim());
        }

    } catch(err) {
        console.log('[FAIL] GET/postRecommendResult');
        return res.status(500).send({ res: false, message: `Failed to get Recommend Result. The reason why ${err}` });
    }

    console.log("[SUCCESS] Connected Well.");
    res.status(200).send({ res: true, message: "Connected Well."});
}



module.exports = {
    saveCategory,
    getTourists,
    getRecommendRequest
}
