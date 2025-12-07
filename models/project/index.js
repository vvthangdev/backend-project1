const mongoose = require("mongoose");
const projectSchema = require("./project-schema");

const project = mongoose.model("projects", projectSchema);

module.exports = project;
