const fs = require('fs');
// const db = require("../models");
// const Workspace = db.Workspace;

const getWorkspaces = async (req, res) => {
    console.log('[START] GET/getWorkspaces');

    try {
        // json 파일 읽어오기
        const filePath = './../model/recommended-result/work-space-result.json';
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const jsonData = JSON.parse(fileContents);
        console.log(fileContents)
        console.log(jsonData)

        // json 파일 전달하기
        console.log("[SUCCESS] Connected Well.");
        res.status(200).json(jsonData)
    } catch (err) {
        console.log('[FAIL] GET/getWorkspaces');
        return res.status(500).send({ res: false, message: `Failed to get workspaces information. The reason why ${err}` });
    }
}

module.exports = {
    getWorkspaces
}
