function errorHandler(error, req, res, next) {
  console.log(error);

  if (error.name === "ValidationError") {
    return res.status(400).json({
      status: 102,
      message: Array.isArray(error.msg) ? error.msg.join(", ") : error.msg,
      data: null,
    });
  }

  if (error.code === "23505" && error.constraint === "Users_email_key") {
    return res.status(400).json({
      status: 103,
      message: "Email sudah terdaftar",
      data: null,
    });
  }

  if (error.code && error.name === "DatabaseError") {
    return res.status(400).json({
      status: 108,
      message: "Database error",
      data: null,
    });
  }

  if (error.name === "BadRequest") {
    return res.status(400).json({
      status: 102,
      message: error.message,
      data: null,
    });
  }

  if (error.name === "Unauthorized") {
    return res.status(401).json({
      status: 103,
      message: error.message,
      data: null,
    });
  }

  if (
    error.name === "JsonWebTokenError" ||
    error.name === "TokenExpiredError"
  ) {
    return res.status(401).json({
      status: 104,
      message: "Token tidak valid atau kadaluwarsa",
      data: null,
    });
  }

  res.status(500).json({ message: "Internal Server Error." });
}

module.exports = errorHandler;
