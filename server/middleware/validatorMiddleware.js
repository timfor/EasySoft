const contentTypeValidator = (req, res, next) => {
  if (req.headers["content-type"] !== "application/json") {
    return res.status(415).json({
      error: "Unsupported Media Type, only application/json is allowed",
    });
  }
  next();
};

const requestBodyValidator = (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: "Empty JSON body is not allowed" });
  }
  next();
};

export { contentTypeValidator, requestBodyValidator };
