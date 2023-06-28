const { selectCommentsByArticleId } = require("../models/comments.models");
const { checkArticleExists } = require("../models/articles.models");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  const promises = [selectCommentsByArticleId(article_id)];

  if (article_id) {
    promises.push(checkArticleExists(article_id));
  }

  Promise.all(promises)
    .then((data) => {
      const comments = data[0];
      res.status(200).send({ comments });
    })
    .catch(next);
};