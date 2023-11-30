const db = require("../models");

const Bookmark = db.Bookmark;

const createBookmarks = async (req, res) => {
    console.log('[START] POST/createBookmarks');

    try {
        Bookmark.findOne({ attributes: ['bookmark_id'], order: [['bookmark_id', 'DESC']]})
        .then(data => {
            var _id = (data ? data.dataValues.bookmark_id : 0) + 1;
            var today = new Date();
            var create_date = today.getFullYear() + '-' + ( (today.getMonth()+1) < 9 ? "0" + (today.getMonth()+1) : (today.getMonth()+1) ) + '-' + ( (today.getDate()) < 9 ? "0" + (today.getDate()) : (today.getDate()) );

            Bookmark.create({
                bookmark_id: _id,
                user_id: req.body.user_id,
                bookmark_date: create_date,
                tourist_ids: req.body.tourist_ids,
                workspace_ids: req.body.workspace_ids,
            }).then(() => {    
                console.log('[SUCCESS] POST/createBookmarks - succeeded to create bookmark');
                return res.status(201).send({res: true, message: "Succeeded to create bookmark."});
            }).catch(err => {
                console.log('[FAIL] POST/createBookmarks');
                console.log(err);
                return res.status(500).send({ res: false, message: `Failed to create bookmark. The reason why ${err}` });
            })
        });
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
