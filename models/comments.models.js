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
