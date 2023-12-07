const db = require("../models");
const BadRequestError = require('../components/exceptions/exceptions');

const Bookmark = db.Bookmark;
const Tourist = db.Tourist;
const Workspace = db.Workspace;

const createBookmarks = async (req, res) => {
    console.log('[START] POST/createBookmarks');
    console.log(req.body);

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
}

const getBookmarks = async (req, res) => {
    console.log('[START] GET/getBookmarks');
    console.log(req.query);

    try {
        Bookmark.findOne({ where: { user_id: req.query.user_id }})
        .then(bookmark => {
            if (bookmark) {

                console.log("북마크!" + bookmark.tourist_ids);
                Tourist.findAll({
                    where: {
                        tourist_id: bookmark.tourist_ids
                    }
                })
                .then(tourists => {
                    if (tourists) {
                        Workspace.findAll({
                            where: {
                                workspace_id: bookmark.workspace_ids
                            }
                        }).then(workspaces => {
                            if(workspaces) {
                                var bookmarkInfo = {
                                    user_id: bookmark.user_id,
                                    boomark_id: bookmark.bookmark_id,
                                    tourists: tourists,
                                    workspaces: workspaces
                                }
            
                                console.log("[SUCCESS] GET/getBookmarks");
                                return res.status(200).send({ res: true, message: 'Succeeded to get bookmarks', data: bookmarkInfo });
                            } else {
                                console.log('[FAIL] GET/getBookmarks');
                                return res.status(500).send({ res: false, message: "Failed to get bookmarks information." });
                            }
                        });
                    } else {
                        console.log('[FAIL] GET/getBookmarks');
                        return res.status(500).send({ res: false, message: "Failed to get bookmarks information." });
                    }
                });
            }
        });
    } catch(err) {
        console.log('[FAIL] GET/getBookmarks');
        return res.status(500).send({ res: false, message: `Failed to get bookmarks information. The reason why ${err}` });
    }
}

const updateBookmarks = async (req, res) => {
    console.log('[START] PUT/updateBookmarks');

    try {
        Bookmark.findOne({ where: { user_id: req.body.user_id }})
        .then(bookmark => {
            if (bookmark) {
                // list 대조.


            } else {
                console.log('[FAIL PUT/updateBookmarks');
                return res.status(500).send({ res: false, message: "Failed to update bookmarks."});
            }
        })
    } catch(err) {
        console.log('[FAIL PUT/updateBookmarks');
        return res.status(500).send({ res: false, message: `Failed to update bookmarks. The reason why ${err}`});
    }

    console.log("[SUCCESS] Connected Well.");
    res.status(200).send({ res: true, message: "Connected Well."});
}

const deleteBookmarks = async (req, res) => {
    console.log('[START] DELETE/deleteBookmarks');
    const user_id = parseInt(req.params.id);

    try {
        if (user_id === undefined) throw new BadRequestError('You must include id on uri.');

        Bookmark.destroy({
            where: {
                user_id: user_id,
            }
        }).then(result => {
            console.log(result);
        })

        console.log('[SUCCESS] DELETE/deleteBookmarks');
        return res.status(200).send({ res: true, message: "Succeeded to delete bookmark."})
    } catch(err) {
        console.log('[FAIL] DELETE/deleteBookmarks');
        return res.status(500).send({ res: false, message: `Failed to delete bookmark. The reason why ${err}` });
    }
}

module.exports = {
    createBookmarks,
    getBookmarks,
    updateBookmarks,
    deleteBookmarks
}
