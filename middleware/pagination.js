exports.pagination = (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1) {
    return Promise.reject({ status: 400, msg: "Bad Request" }).catch(next);
  }
  const offset = (page - 1) * limit;
  req.pagination = { limit, offset };
  next();
};
