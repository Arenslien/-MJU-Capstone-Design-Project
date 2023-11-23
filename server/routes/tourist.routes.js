const controller = require("../controllers/tourist.controller")

/**
 * @swagger
 * /tourists:
 *  get:
 *    tags:
 *      - Tourists
 *    name: GetTourists
 *    summary: Get tourists by recommendation.
 *    description: Get tourists information by recommendation.
 *    produces:
 *      -application/json
 *    consumes:
 *      - application/json
 *    parameters:
 *      - in: body
 *        name: categories
 *        schema:
 *          type: array
 *        required: true
 *    responses:
 *      '200':
 *        description: Success to query
 *      '400':
 *        description: Bad Request.
 *      '500':
 *         description: Failed to query by a reason.
 */

module.exports = function(BASE_URI, app) {
    app.get(BASE_URI + "tourist", controller.getTourists);
}