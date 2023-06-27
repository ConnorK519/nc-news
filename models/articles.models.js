const db = require("../db/connection");

exports.selectArticles = () => {
  return db
    .query(
      `SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, COUNT(comment_id) AS comment_count
    FROM articles 
    LEFT JOIN comments ON comments.article_id = articles.article_id 
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC
    `
    )
    .then(({ rows }) => {
      console.log(rows);

      return rows;
    });
};
