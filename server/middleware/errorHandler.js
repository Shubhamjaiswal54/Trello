// Express identifies error handlers by their four-argument signature.
const errorHandler = (err, req, res, next) => {
  if (err.name === "CastError") {
    return res.status(400).json({ message: `Invalid ${err.path}` });
  }
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
    return res.status(400).json({ message });
  }
  if (err.code === 11000) {
    return res.status(409).json({ message: "That entry already exists" });
  }
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Malformed JSON body" });
  }

  console.error(err);
  res.status(err.status || 500).json({
    message: err.expose ? err.message : "Something went wrong",
  });
};

export default errorHandler;
