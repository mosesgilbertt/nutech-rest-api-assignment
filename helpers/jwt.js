const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET_KEY;

function signToken(payload) {
  return jwt.sign(payload, secret);
}

function verifyToken(token) {
  return jwt.verify(token, secret);
}

module.exports = {
  signToken,
  verifyToken,
};
