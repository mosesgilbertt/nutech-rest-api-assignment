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
      status: 101,
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
      status: 108,
      message: error.message,
      data: null,
    });
  }

  if (
    error.name === "JsonWebTokenError" ||
    error.name === "TokenExpiredError"
  ) {
    return res.status(401).json({
      status: 108,
      message: error.message,
      data: null,
    });
  }

  if (
    error.name === "Error" &&
    error.message &&
    (error.message.includes("file format") ||
      error.message.includes("not allowed") ||
      error.message.includes("Image file format"))
  ) {
    return res.status(400).json({
      status: 102,
      message: "Format Image tidak sesuai", // ✅ Ubah message jadi custom
      data: null,
    });
  }

  if (error.name === "MulterError" || error.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      status: 102,
      message: error.message,
      data: null,
    });
  }

  if (error.message && error.message.includes(error.message)) {
    return res.status(400).json({
      status: 102,
      message: error.message,
      data: null,
    });
  }

  if (error.name === "NotFound") {
    return res.status(404).json({
      status: 104,
      message: error.message,
      data: null,
    });
  }

  res.status(500).json({
    status: 500,
    message: "Internal Server Error",
    data: null,
  });
}

module.exports = errorHandler;
