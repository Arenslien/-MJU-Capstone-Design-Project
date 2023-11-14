const controller = require("../controllers/user.controller")

/** 
 * @swagger
 * /api/users:
 *  get:
 *    tags:
 *      - Users
 *    name: GetUsers
 *    summary: Get All Users
 *    description: 
 *    produces:
 *      - application/json
 *    consumes:
 *      - application/json
 *    parameters:
 *    responses:
 *      '200':
 *        description: Success to get all users
 *      '500':
 *        description: Failed to get all users by some reason
 * 
*/


module.exports = function(BASE_URI, app) {
    app.get(BASE_URI + "users", controller.getUsers)
}