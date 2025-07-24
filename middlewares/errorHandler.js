function errororHandler(error, req, res, next) {
  console.log(error);

  if (error.name === "ValidationError") {
    return res.status(400).json({
      status: 102,
      message: error.msg,
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

  if (error.code) {
    return res.status(400).json({
      status: 108,
      message: "Database error",
      data: null,
    });
  }

  res.status(500).json({ message: "Internal Server Error." });
}

module.exports = errororHandler;
