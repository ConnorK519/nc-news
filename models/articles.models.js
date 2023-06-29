const db = require("../db/connection");
const format = require("pg-format");

exports.selectArticles = (
  topic = null,
  sort_by = "articles.created_at",
  order = "DESC"
) => {
  let query = `SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, COUNT(comment_id) AS comment_count
  FROM articles 
  LEFT JOIN comments ON comments.article_id = articles.article_id 
  `;

  const validQueries = [
    "articles.author",
    "title",
    "articles.article_id",
    "topic",
    "articles.created_at",
    "articles.votes",
    "article_img_url",
    "comment_count",
    "DESC",
    "ASC",
  ];

  if (sort_by === "author") {
    sort_by = validQueries[0];
  } else if (sort_by === "id") {
    sort_by = validQueries[2];
  } else if (sort_by === "date") {
    sort_by = validQueries[4];
  } else if (sort_by === "votes") {
    sort_by = validQueries[5];
  } else if (sort_by === "img_url") {
    sort_by = validQueries[6];
  }

  const validTopics = ["mitch", "cats", "coding", "football", "cooking", null];

  if (!validTopics.includes(topic)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  if (!validQueries.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  if (!validQueries.includes(order)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  if (topic) {
    query += `WHERE articles.topic = '${topic}' `;
  }

  query += `GROUP BY articles.article_id `;

  if (sort_by) {
    query += `ORDER BY ${sort_by} `;
  }

  if (order) {
    query += `${order}`;
  }

  return db.query(query).then(({ rows }) => {
    if (rows.length === 1) {
      return rows[0];
    } else return rows;
  });
};

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

exports.checkArticleExists = (article_id) => {
  return db
    .query(format(`SELECT * FROM articles WHERE article_id = $1`), [article_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
    });
};
