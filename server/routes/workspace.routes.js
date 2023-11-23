const controller = require("../controllers/workspace.controller")

/**
 * @swagger
 * /workspaces:
 *  get:
 *    tags:
 *      - Workspaces
 *    name: GetWorkspaces
 *    summary: Get workspaces by recommendation.
 *    description: Get workspaces information by recommendation.
 *    produces:
 *      -application/json
 *    consumes:
 *      - application/json
 *    parameters:
 *      - in: 
 *        name: 
 *        schema:
 *          type: 
 *        required: 
 *    responses:
 *      '200':
 *        description: Success to query
 *      '400':
 *        description: Bad Request.
 *      '500':
 *        description: Failed to query by a reason.
 */


module.exports = function(BASE_URI, app) {
    app.get(BASE_URI + "workspace", controller.getWorkspaces);
}
