const db = require("../db/connection");
const format = require("pg-format");

exports.selectArticleById = (article_id) => {
  return db
    .query(format(`SELECT * FROM articles WHERE article_id = $1`), [article_id])
    .then(({ rows }) => {
      if (rows.length > 0) {
        return rows[0];
      } else {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
    });
};
