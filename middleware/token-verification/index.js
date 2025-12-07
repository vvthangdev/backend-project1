const jwt = require("jsonwebtoken");
const Config = require("../../config");
const { getDbUserData, findOne } = require("../../helpers");

const tokenVerification = async (req, res, next) => {
  const token = req.headers["token"];

  if (!token) {
    return res.status(404).send({
      status: 404,
      message: "No token provided!",
    });
  }

  const SECRET = process.env.TOKEN_SECRET;

  if (!SECRET) {
    return res.status(500).send({
      status: 500,
      message: "Server configuration error: TOKEN_SECRET is missing!",
    });
  }

  jwt.verify(token, SECRET, async (err, decoded) => {
    if (err) {
      return res.status(400).send({
        status: 400,
        message: "Token unauthorized!",
      });
    }

    // decoded đã chứa id + email từ loginUser
    const user = await findOne("user", { email: decoded.email });

    if (!user) {
      return res.status(404).send({
        status: 404,
        message: "User does not exist.",
      });
    }

    // Gắn user id vào request để controller sử dụng
    req.userId = decoded.id;

    next();
  });
};

module.exports = { tokenVerification: tokenVerification };
