const { selectArticleById } = require("../models/articles.models");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  return selectArticleById(article_id).then((data) => {
    if (data.length > 0) {
      res.status(200).send(data);
    } else {
      res.status(404).send({ msg: "Not Found" });
    }
  });
};
