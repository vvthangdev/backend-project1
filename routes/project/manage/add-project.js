const { insertNewDocument, findOne } = require("../../../helpers");
const Joi = require("joi");
const mongoose = require("mongoose");

// Joi validation schema
const schema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow(""),
  title: Joi.string().allow(""),
  description_detail: Joi.string().allow(""),
  due_date: Joi.date().optional(),
  progress: Joi.string().default("0"),
  status: Joi.string()
    .valid("todo", "in_progress", "review", "done", "archived")
    .default("todo"),
  document: Joi.string().allow("")
});

const createProject = async (req, res) => {
  try {
    // Validate body
    const validated = await schema.validateAsync(req.body);

    // Owner from token middleware
    const ownerId = req.userId;

    // Generate project_id (Mongo ObjectId)
    const generatedProjectId = new mongoose.Types.ObjectId();

    // Build new project object
    const newProject = {
      project_id: generatedProjectId,
      owner_id: ownerId,

      ...validated,

      members: [
        {
          user_id: ownerId,
          role: "admin",
          joined_at: new Date()
        }
      ]
    };

    // Save to DB
    const savedProject = await insertNewDocument("project", newProject);

    return res.status(200).send({
      status: "SUCCESS",
      message: "Project created successfully!",
      data: savedProject
    });

  } catch (err) {
    return res.status(400).send({
      status: "FAILED",
      message: err.message
    });
  }
};

module.exports = createProject;
