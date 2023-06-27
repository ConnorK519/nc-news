const { readApiInfo } = require("../models/api.models");

exports.getApiInfo = (req, res, next) => {
  return readApiInfo()
    .then((info) => {
      res.status(200).send(JSON.parse(info));
    })
    .catch(next);
};
