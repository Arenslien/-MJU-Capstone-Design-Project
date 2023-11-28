const controller = require("../controllers/user.controller")

/**
 * @swagger
 * /user:
 *  get:
 *    tags:
 *      - Users
 *    name: GetUserBy
 *    summary: get user By kakao email
 *    description: to retrieves a single user by kakao email.
 *    produces:
 *      - application/json
 *    consumes:
 *      - application/json
 *    parameters:
 *      - in: query
 *        name: kakao_email
 *        schema:
 *          type: string
 *          required: true
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
 * /user:
 *  put:
 *    tags:
 *      - Users
 *    name: UpdateUser
 *    summary: update a user
 *    description: to update a user information(취향 포함) by id.
 *    produces:
 *      - application/json
 *    consumes:
 *      - application/json
 *    parameters:
 *      - in: body
 *        name: body
 *        schema:
 *          $ref: '#/definitions/user'
 *    responses:
 *      '200':
 *        description: Success to update
 *      '400':
 *        description: Bad request
 *      '500':
 *        description: Failed to update by a reason.
 * 
*/


module.exports = function(BASE_URI, app) {
    app.get(BASE_URI + "user", controller.getUserBy);
    app.put(BASE_URI + "user", controller.updateUser);
    app.delete(BASE_URI + "user/:id", controller.deleteUser);
}