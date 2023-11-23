const controller = require("../controllers/bookmark.controller")


/**
 * @swagger
 * /bookmarks/{id}:
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
 *        name: userId
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
 * /bookmarks:
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
 * /bookmarks:
 *  put:
 *    tags:
 *      - Bookmarks
 *    name: UpdateBookmarks
 *    summary: Update bookmarks by user ID.
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
    app.get(BASE_URI + "bookmark", controller.getBookmarks);
}