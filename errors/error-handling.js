exports.handlePsqlErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "Not Found" });
  } else if (err.code === "23502") {
    res.status(400).send({ msg: "Bad Request" });
  } else next(err);
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.handleServerErrors = (err, req, res, next) => {
  console.log(err, "<--- Error from server");
  res.status(500).send({ msg: "Internal server error" });
};

exports.handleFalseEndpoints = (req, res, next) => {
  res.status(404).send({ msg: "Not Found" });
};
