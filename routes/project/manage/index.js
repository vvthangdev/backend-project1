const express = require("express");
const createProject = require("./add-project");
const router = express.Router();

// ROUTES * /api/user/
router.post("/create-project", createProject);

module.exports = router;