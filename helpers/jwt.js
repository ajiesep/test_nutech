const jwt = require("jsonwebtoken");

const secretKey = "kepobanget";

const signToken = (payload) => {
  return jwt.sign(payload, secretKey);
};
const verifyToken = (token) => {
  return jwt.verify(token, secretKey);
};

module.exports = { signToken, verifyToken };
