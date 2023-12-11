const controller = require("../controllers/workspace.controller")


module.exports = function(BASE_URI, app) {
    app.get(BASE_URI + "workspace", controller.getWorkspaces);
}
