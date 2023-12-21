const controller = require("../controllers/tourist.controller")

/**
 * @swagger
 * /category:
 *  put:
 *    tags:
 *      - Category
 *    name: SaveCategory
 *    description: Save user travel category.
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

/**
 * @swagger
 * /recommend-result:
 *  get:
 *    tags:
 *      - Tourists
 *    name: GetRecommendResult
 *    summary: GET recommend result by recommendation.
 *    description: GET recommend result information by recommendation.
 *    produces:
 *      -application/json
 *    consumes:
 *      - application/json
 *    parameters:
 *      - in: body
 *        name: categories
 *        schema:
 *          type: object
 *          properties:
 *            gender:
 *              type: boolean
 *            age_group:
 *              type: int
 *            travel_style1:
 *              type: int
 *            travel_style5:
 *              type: int
 *            travel_style6:
 *              type: int
 *        required:
 *          - gender
 *          - age_group
 *          - travel_style1  
 *          - travel_style5
 *          - travel_style6
 *    responses:
 *      '200':
 *        description: Success to query
 *      '400':
 *        description: Bad Request.
 *      '500':
 *         description: Failed to query by a reason.
 */

module.exports = function(BASE_URI, app) {
    app.put(BASE_URI + "category", controller.saveCategory);
    app.get(BASE_URI + "tourist", controller.getTourists);
    app.get(BASE_URI + "recommend-request", controller.getRecommendRequest);
}
