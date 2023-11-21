const controller = require("../controllers/auth.controller")

/** 
 * @swagger
 * /auth/signup:
 *  post:
 *    tags:
 *      - Auth
 *    name: signup
 *    summary: register new user
 *    description: required kakao_email, user_nickname, and gender. kakao_email and user_nickname must be a String, gender must be a String.
 *    produces:
 *      - application/json
 *    consumes:
 *      - application/json
 *    parameters:
 *      - name: body
 *        in: body
 *        schema:
 *          type: object
 *          properties:
 *            kakao_email:
 *              type: string
 *            name:
 *              type: string
 *            gender:
 *              type: boolean
 *        required:
 *          - kakao_email
 *          - name
 *          - gender
 *    responses:
 *      '200':
 *        description: Success to register new user
 *      '500':
 *        description: Failed to register new user
 * 
*/


module.exports = function(BASE_URI, app) {
    app.post(BASE_URI + "auth/signup", controller.signup)
}