const controller = require("../controllers/auth.controller")

/** 
 * @swagger
 * /auth/login:
 *  post:
 *    tags:
 *      - Auth
 *    name: login
 *    summary: login with kakao login and check user existence.
 *    description: required kakao_email must be String.
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
 *        required:
 *          - kakao_email
 *    responses:
 *      '200':
 *        description: Success to create new user
 *      '500':
 *        description: Failed to create new user
 * 
*/

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
 *            nickname:
 *              type: string
 *            gender:
 *              type: boolean
 *        required:
 *          - kakao_email
 *          - name
 *          - gender
 *    responses:
 *      '201':
 *        description: Success to create new user
 *      '500':
 *        description: Failed to create new user
 * 
*/


module.exports = function(BASE_URI, app) {
    app.post(BASE_URI + "auth/login", controller.login);
    app.post(BASE_URI + "auth/signup", controller.signup);
}
