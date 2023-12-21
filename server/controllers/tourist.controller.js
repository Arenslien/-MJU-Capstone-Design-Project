const db = require("../models");
const { spawnSync } = require("node:child_process");
const fs = require('fs');

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
        // json 파일 읽어오기
        const filePath = './../model/recommended-result/tour-spot-result.json';
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const jsonData = JSON.parse(fileContents);

        // json 파일 전달하기
        console.log("[SUCCESS] Connected Well.");
        res.status(200).json(jsonData)
    } catch(err) {
        console.log('[FAIL] GET/getTourists');
        return res.status(500).send({ res: false, message: `Failed to get tourists information. The reason why ${err}` });
    }
}

const getRecommendRequest = async (req, res) => {
    console.log('[START] GET/getRecommendResult');

    try {
        //
        const gender = req.query.gender;
        const age_group = req.query.age_group;
        const travel_style1 = req.query.travel_style1;
        const travel_style5 = req.query.travel_style5;
        const travel_style6 = req.query.travel_style6;
        const period = req.query.period;
        console.log(period);

        console.log("\n[Query Parameters]")
        const user_information = ["100000", gender, age_group, travel_style1, travel_style5, travel_style6, period].join(" ");
        console.log(user_information)
        
        // 1. Tour Spot 코드 실행
        const pyFileDirectory1 = "/home/ubuntu/MJU-CapstoneDesign-Project/model/dropout-net/get_recommend_result.py";
        const result1 = spawnSync("python3", [pyFileDirectory1, "--user-information", "100000", gender, age_group, travel_style1, travel_style5, travel_style6, "--period", period]);

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
        const pyFileDirectory2 = "/home/ubuntu/MJU-CapstoneDesign-Project/model/haversine/get_workspace_result.py";
        const result_json_dir = "/home/ubuntu/MJU-CapstoneDesign-Project/model/recommended-result/tour-spot-result.json"
        const result2 = spawnSync("python3", [pyFileDirectory2, "--tour-spot-result-dir", result_json_dir, "--period", period]);

        if (result2.status === 0) {
            // Success!
            console.log("Success!");
            console.log(result2.stdout.toString().trim());

            console.log("[SUCCESS] GET/getRecommendResult.");
            res.status(200).send({ res: true, message: "Succeed to create recommended result."});
        } else {
            // Error!
            console.log("Error!");
            console.log(result2.stderr.toString().trim());

            console.log('[FAIL] GET/getRecommendResult');
            return res.status(500).send({ res: false, message: "Failed to create recommended result." });
        }

    } catch(err) {
        console.log('[FAIL] GET/getRecommendResult');
        return res.status(500).send({ res: false, message: `Failed to get Recommend Result. The reason why ${err}` });
    }
}





module.exports = {
    saveCategory,
    getTourists,
    getRecommendRequest
}
