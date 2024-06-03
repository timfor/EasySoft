const contentTypeValidator = (req, res, next) => {
  if (
    req.headers["content-type"] != "application/json" &&
    !req.headers["content-type"].startsWith("multipart/form-data")
  ) {
    return res.status(415).json({
      error:
        "Unsupported Media Type, application/json or multipart/form-data are allowed",
    });
  }
  next();
};

const requestBodyValidator = (req, res, next) => {
  if (
    req.is("application/json") &&
    (!req.body || Object.keys(req.body).length === 0)
  ) {
    return res.status(400).json({ error: "Empty JSON body is not allowed" });
  }

  if (req.is("multipart/form-data")) {
    const bodyIsEmpty = !req.body || Object.keys(req.body).length === 0;
    const filesAreEmpty = !req.files || Object.keys(req.files).length === 0;
    if (bodyIsEmpty && filesAreEmpty) {
      return res.status(400).json({
        error: "Empty request body is not allowed for multipart/form-data",
      });
    }
  }

  next();
};

export { contentTypeValidator, requestBodyValidator };
