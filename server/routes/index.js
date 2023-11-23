const router = require("express").Router();
const user = require("./user.routes");
const auth = require("./auth.routes");
const tourist = require("./tourist.routes");
const workspace = require("./workspace.routes");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication Processing 
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Users CRUD
 */

/**
 * @swagger
 * tags:
 *   name: Tourists
 *   description: Tourists CRUD
 */

/**
 * @swagger
 * tags:
 *   name: Workspaces
 *   description: Workspaces CRUD
 */

/**
 * @swagger
 * tags:
 *   name: Bookmarks
 *   description: Bookmarks CRUD
 */

/**
 * @swagger
 * tags:
 *   name: Models
 *   description: Models CRUD
 */

router.use("/user", user);
router.use("/auth", auth);
router.use("/tourist", tourist);
router.use("/workspace", workspace);

module.exports = router;
