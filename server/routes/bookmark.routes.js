const controller = require("../controllers/bookmark.controller")


/**
 * @swagger
 * /bookmark?user_id={user_id}:
 *  get:
 *    tags:
 *      - Bookmarks
 *    name: GetBookmarks
 *    summary: Get bookmarks by user ID.
 *    description: Get bookmarks by user ID.
 *    produces:
 *      -application/json
 *    consumes:
 *      - application/json
 *    parameters:
 *      - in: query
 *        name: user_id
 *        schema:
 *          type: integer
 *        required: true
 *    responses:
 *      '200':
 *        description: Success to query
 *      '400':
 *        description: Bad Request.
 *      '500':
 *        description: Failed to query by a reason.
 */

/**
 * @swagger
 * /bookmark:
 *  post:
 *    tags:
 *      - Bookmarks
 *    name: CreateBookmarks
 *    summary: Create bookmarks by user ID.
 *    description: Update bookmarks by user ID.
 *    produces:
 *      -application/json
 *    consumes:
 *      - application/json
 *    parameters:
 *      - in: body
 *        name: body
 *        schema:
 *          type: object
 *          properties:
 *            user_id:
 *              type: integer
 *            tourist_ids:
 *              type: array
 *              items:
 *                type: integer
 *            workspace_ids:
 *              type: array
 *              items:
 *                type: integer
 *        required: 
 *          - user_id
 *          - tourist_ids
 *          - workspace_ids
 *    responses:
 *      '200':
 *        description: Success to query
 *      '400':
 *        description: Bad Request.
 *      '500':
 *        description: Failed to query by a reason.
 */

/**
 * @swagger
 * /bookmark/append:
 *  post:
 *    tags:
 *      - Bookmarks
 *    name: appendPlaceToBookmark
 *    summary: Append place to bookmark by user ID.
 *    description: Append place to bookmark by user ID.
 *    produces:
 *      -application/json
 *    consumes:
 *      - application/json
 *    parameters:
 *      - in: body
 *        name: body
 *        schema:
 *          type: object
 *          properties:
 *            user_id:
 *              type: integer
 *            type:
 *              type: string
 *            place_id:
 *              type: integer
 *        required: 
 *          - user_id
 *          - type
 *          - place_id
 *    responses:
 *      '200':
 *        description: Success to query
 *      '400':
 *        description: Bad Request.
 *      '500':
 *        description: Failed to query by a reason.
 */

/**
 * @swagger
 * /bookmark/delete:
 *  post:
 *    tags:
 *      - Bookmarks
 *    name: deletePlaceFromBookmark
 *    summary: Delete place from bookmark by user ID.
 *    description: Delete place from bookmark by user ID.
 *    produces:
 *      -application/json
 *    consumes:
 *      - application/json
 *    parameters:
 *      - in: body
 *        name: body
 *        schema:
 *          type: object
 *          properties:
 *            user_id:
 *              type: integer
 *            type:
 *              type: string
 *            place_id:
 *              type: integer
 *        required: 
 *          - user_id
 *          - type
 *          - place_id
 *    responses:
 *      '200':
 *        description: Success to query
 *      '400':
 *        description: Bad Request.
 *      '500':
 *        description: Failed to query by a reason.
 */

/**
 * @swagger
 * /bookmarks:
 *  delete:
 *    tags:
 *      - Bookmarks
 *    name: DeleteBookmarks
 *    summary: Delete bookmarks by user ID.
 *    description: Delete bookmarks by user ID.
 *    produces:
 *      -application/json
 *    consumes:
 *      - application/json
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *    responses:
 *      '200':
 *        description: Success to query
 *      '400':
 *        description: Bad Request.
 *      '500':
 *        description: Failed to query by a reason.
 */

module.exports = function(BASE_URI, app) {
    app.post(BASE_URI + "bookmark", controller.createBookmarks);
    app.get(BASE_URI + "bookmark", controller.getBookmarks);
    app.post(BASE_URI + "bookmark/append", controller.appendPlaceToBookmarks);
    app.post(BASE_URI + "bookmark/delete", controller.deletePlaceFromBookmark);
    app.delete(BASE_URI + "bookmark/:id", controller.deleteBookmarks);
}