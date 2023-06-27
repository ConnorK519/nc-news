const db = require("../db/connection");
const format = require("pg-format");

exports.selectArticleById = (article_id) => {
  return db
    .query(format(`SELECT * FROM articles WHERE article_id = $1`), [article_id])
    .then(({ rows }) => {
      return rows;
    });
};
