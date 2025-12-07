const express = require("express");
const { tokenVerification } = require("../middleware");
const auth = require("./auth");
const user = require("./user-type");
const project = require("./project/manage")
const router = express.Router();

// AUTH Routes * /api/auth/*
router.use("/auth", auth);
router.use("/user", user);
router.use("/project",tokenVerification, project)

module.exports = router;
