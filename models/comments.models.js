const db = require("../db/connection");
const format = require("pg-format");

exports.selectCommentsByArticleId = (article_id) => {
  return db
    .query(
      format(
        `SELECT * 
        FROM comments 
        WHERE article_id = $1 
        ORDER BY created_at ASC`
      ),
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.insertComment = (comment) => {
  return db
    .query(
      format(`INSERT INTO comments (article_id, author, body)
  VALUES ($1, $2, $3) RETURNING *`),
      comment
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.deleteComment = (comment_id) => {
  return db
    .query(format(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`), [
      comment_id,
    ])
    .then(({ rows }) => {
      if (rows.length !== 1) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
    });
};
