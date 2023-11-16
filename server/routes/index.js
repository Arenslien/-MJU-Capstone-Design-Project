const router = require("express").Router()
const user = require("./user.routes")

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

router.use("/user", user)

module.exports = router