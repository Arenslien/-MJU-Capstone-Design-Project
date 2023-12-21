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
				const appendPlaceToBookmarks = async (req, res) => {
					console.log('[START] POST/appendPlaceToBookmarks');

					try {
						Bookmark.findOne({ where: { user_id: req.body.user_id }})
							.then(bookmark => {
								if (bookmark) {
									switch(req.body.type) {
										case 'tourist':
											var tourist_ids = Object.values(bookmark.tourist_ids);
											tourist_ids.push(req.body.place_id);

											bookmark.update({
												tourist_ids: tourist_ids,
											},
												{
													where: { 
														user_id: req.body.user_id
													}
												});

											console.log('[SUCCESS] POST/appendPlaceToBookmarks');
											return res.status(200).send({ res: true, message: "Succeeded to append tourist to bookmarks."});
										case 'workspace':
											var workspace_ids = Object.values(bookmark.workspace_ids);
											workspace_ids.push(req.body.place_id)

											bookmark.update({
												workspace_ids: workspace_ids,
											},
												{
													where: { 
														user_id: req.body.user_id
													}
												});

											console.log('[SUCCESS] POST/appendPlaceToBookmarks');
											return res.status(200).send({ res: true, message: "Succeeded to append workspace to bookmarks."});
										default:
											console.log('[FAIL POST/appendPlaceToBookmarks');
											return res.status(500).send({ res: false, message: "Failed to append place to bookmarks."});
									}


								} else {
									Bookmark.findOne({ attributes: ['bookmark_id'], order: [['bookmark_id', 'DESC']]})
										.then(data => {
											var _id = (data ? data.dataValues.bookmark_id : 0) + 1;
											var today = new Date();
											var create_date = today.getFullYear() + '-' + ( (today.getMonth()+1) < 9 ? "0" + (today.getMonth()+1) : (today.getMonth()+1) ) + '-' + ( (today.getDate()) < 9 ? "0" + (today.getDate()) : (today.getDate()) );
											var tourist_ids = [];
											var workspace_ids = []

											switch(req.body.type) {
												case 'tourist':
													tourist_ids.push(req.body.place_id);
													break;
												case 'workspace':
													workspace_ids.push(req.body.place_id);
													break;
											}

											Bookmark.create({
												bookmark_id: _id,
												user_id: req.body.user_id,
												bookmark_date: create_date,
												tourist_ids: tourist_ids,
												workspace_ids: workspace_ids,
											}).then(() => {    
												console.log('[SUCCESS] POST/appendPlaceToBookmarks');
												return res.status(200).send({ res: true, message: "Succeeded to append workspace to bookmarks."});
											}).catch(err => {
												console.log('[FAIL POST/appendPlaceToBookmarks');
												console.log(err);
												return res.status(500).send({ res: false, message: "Failed to append place to bookmarks."});
											})
										});
								}
							});
					} catch(err) {
						console.log('[FAIL POST/appendPlaceToBookmarks');
						return res.status(500).send({ res: false, message: `Failed to append place to bookmarks. The reason why ${err}`});
					}
				}

				const deletePlaceFromBookmark = async (req, res) => {
					console.log('[START] POST/deletePlaceFromBookmark');

					try {Bookmark.findOne({ where: { user_id: req.body.user_id }})
							.then(bookmark => {
								if (bookmark) {
									switch(req.body.type) {
										case 'tourist':
											var tourist_ids = Object.values(bookmark.tourist_ids);
											if (typeof(req.body.place_id) == 'object') {
												for (var t_id of req.body.place_id) {
													tourist_ids.splice(tourist_ids.findIndex(id => id === t_id), 1);
													console.log(tourist_ids)

													bookmark.update({
														tourist_ids: tourist_ids,
													},
														{
															where: { 
																user_id: req.body.user_id
															}
														});
												}
											} else {
												tourist_ids.splice(tourist_ids.findIndex(id => id === req.body.place_id), 1);

												bookmark.update({
													tourist_ids: tourist_ids,
												},
													{
														where: { 
															user_id: req.body.user_id
														}
													});
											}


											console.log('[SUCCESS] POST/deletePlaceFromBookmark');
											return res.status(200).send({ res: true, message: "Succeeded to delete tourist to bookmarks."});
										case 'workspace':
											var workspace_ids = Object.values(bookmark.workspace_ids);
											if (typeof(req.body.place_id) == 'object') {
												for (var w_id of req.body.place_id) {
													workspace_ids.splice(workspace_ids.findIndex(id => id === w_id), 1);

													bookmark.update({
														workspace_ids: workspace_ids,
													},
														{
															where: { 
																user_id: req.body.user_id
															}
														});
												}
											} else {
												workspace_ids.splice(workspace_ids.findIndex(id => id === req.body.place_id), 1);

												bookmark.update({
													workspace_ids: workspace_ids,
												},
													{
														where: { 
															user_id: req.body.user_id
														}
													});
											}

											console.log('[SUCCESS] POST/deletePlaceFromBookmark');
											return res.status(200).send({ res: true, message: "Succeeded to delete workspace to bookmarks."});
										default:
											console.log('[FAIL POST/deletePlaceFromBookmark');
											return res.status(500).send({ res: false, message: "Failed to delete place to bookmarks."});
									}


								} else {
									console.log('[FAIL POST/deletePlaceFromBookmark');
									return res.status(500).send({ res: false, message: "Failed to delete place to bookmarks."});
								}
							});
					} catch(err) {
						console.log('[FAIL POST/deletePlaceFromBookmark');
						return res.status(500).send({ res: false, message: `Failed to delete place from bookmark. The reason why ${err}`});
					}
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
					appendPlaceToBookmarks,
					deletePlaceFromBookmark,
					deleteBookmarks
				}
