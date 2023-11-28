// const db = require("../models");

// const Bookmark = db.Bookmark;

const createBookmarks = async (req, res) => {
    console.log('[START] POST/createBookmarks');

    try {
        //
    } catch(err) {
        console.log('[FAIL] POST/createBookmarks');
        return res.status(500).send({ res: false, message: `Failed to create bookmarks information. The reason why ${err}` });
    }

    console.log("[SUCCESS] Connected Well.");
    res.status(200).send({ res: true, message: "Connected Well."});
}

const getBookmarks = async (req, res) => {
    console.log('[START] GET/getBookmarks');

    try {
        //
    } catch(err) {
        console.log('[FAIL] GET/getBookmarks');
        return res.status(500).send({ res: false, message: `Failed to get bookmarks information. The reason why ${err}` });
    }

    console.log("[SUCCESS] Connected Well.");
    res.status(200).send({ res: true, message: "Connected Well."});
}

const updateBookmarks = async (req, res) => {
    console.log('[START] PUT/updateBookmarks');

    try {
        //
    } catch(err) {
        console.log('[FAIL PUT/updateBookmarks');
        return res.status(500).send({ res: false, message: `Failed to update bookmarks. The reason why ${err}`});
    }

    console.log("[SUCCESS] Connected Well.");
    res.status(200).send({ res: true, message: "Connected Well."});
}

const deleteBookmarks = async (req, res) => {
    console.log('[START] DELETE/deleteBookmarks');

    try {
        //
    } catch(err) {
        console.log('[FAIL] DELETE/deleteBookmarks');
        return res.status(500).send({ res: false, message: `Failed to delete bookmarks. The reason why ${err}`});
    }

    console.log("[SUCCESS] Connected Well.");
    res.status(200).send({ res: true, message: "Connected Well."});
}

module.exports = {
    createBookmarks,
    getBookmarks,
    updateBookmarks,
    deleteBookmarks
}
