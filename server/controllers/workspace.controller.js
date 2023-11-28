// const db = require("../models");

// const Workspace = db.Workspace;

const getWorkspaces = async (req, res) => {
    console.log('[START] GET/getWorkspaces');

    try {
        //
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
