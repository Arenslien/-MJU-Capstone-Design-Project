// const db = require("../models");

// const Tourist = db.Tourist;

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
    getTourists
}
