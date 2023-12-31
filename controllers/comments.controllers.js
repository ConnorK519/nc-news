const {
  selectCommentsByArticleId,
  insertComment,
  deleteComment,
} = require("../models/comments.models");
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

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { author, body } = req.body;
  return insertComment([article_id, author, body])
    .then((createdComment) => {
      res.status(201).send({ createdComment });
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  return deleteComment(comment_id)
    .then((deletedComment) => {
      res.status(204).send({ msg: "No Content" });
    })
    .catch(next);
};
