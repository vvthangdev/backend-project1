const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { SECRET } = require("../../../config");
const { getPopulatedData, findOne } = require("../../../helpers");
const Joi = require("joi");

// Validation schema
const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9]{6,30}$"))
    .required(),
});

const loginUser = async (req, res) => {
  try {
    // Validate input
    const validated = await schema.validateAsync(req.body);
    const { email, password } = validated;

    // Find user by email
    const user = await findOne("user", { email: email.toLowerCase() });

    if (!user) {
      return res.status(404).send({
        status: "FAILED",
        message: "User does not exist!",
      });
    }

    // Validate password
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      return res.status(400).send({
        status: "FAILED",
        message: "Invalid Email or Password!",
      });
    }

    // Update last login
    user.last_login = new Date();
    await user.save();

    // Get token secret from .env
    const TOKEN_SECRET = process.env.TOKEN_SECRET;

    if (!TOKEN_SECRET) {
      return res.status(500).send({
        status: "FAILED",
        message: "Server error: TOKEN_SECRET is missing!",
      });
    }

    // Generate token that contains user id + email
    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
      },
      TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    // Response format
    return res.status(200).send({
      status: "SUCCESS",
      message: "Login successful!",
      data: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role?.toUpperCase() || "USER",
        last_login: user.last_login,
        token: token,
      },
    });
  } catch (e) {
    return res.status(400).send({
      status: "FAILED",
      message: e.message,
    });
  }
};

module.exports = loginUser;
