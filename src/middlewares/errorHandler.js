const errorHandler = (err, req, res, next) => {
  // Handle invalid JSON
  if (err instanceof SyntaxError && "body" in err) {
    console.log("Invalid JSON received");
    return res.status(400).json({ error: "Invalid JSON format" });
  }

  // Handle invalid CSRF tokens
  if (err.code === "EBADCSRFTOKEN") {
    return res.status(403).json({ error: "Invalid CSRF token" });
  }

  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    error: err.message || "Internal Server Error",
  });
};

export default errorHandler;
