const db = require("../db/connection");
const format = require("pg-format");

exports.selectArticles = (
  topic = null,
  sort_by = "created_at",
  order = "DESC",
  limit,
  offset
) => {
  const validQueries = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "comment_count",
    "DESC",
    "ASC",
  ];

  const validTopics = [
    "mitch",
    "cats",
    "coding",
    "football",
    "cooking",
    "paper",
    null,
  ];

  if (!validTopics.includes(topic)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  if (!validQueries.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  if (!validQueries.includes(order)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  const queryParts = [];

  let pageCountQuery = `SELECT COUNT(*) FROM articles `;

  if (topic) {
    let topicQuery = `WHERE articles.topic = '${topic}' `;
    pageCountQuery += topicQuery;
    queryParts.push(topicQuery);
  }

  let query = `SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, COUNT(comment_id) AS comment_count, CEIL((${pageCountQuery}) / ${limit}) + 1 AS total_pages
  FROM articles 
  LEFT JOIN comments ON comments.article_id = articles.article_id `;

  queryParts.push(`GROUP BY articles.article_id `);

  if (sort_by) {
    if (sort_by == "comment_count") {
      queryParts.push(`ORDER BY ${sort_by} `);
    } else {
      queryParts.push(`ORDER BY articles.${sort_by} `);
    }
  }

  if (order) {
    queryParts.push(`${order} `);
  }

  queryParts.push(`
  LIMIT ${limit}
  OFFSET ${offset} `);

  for (const queryPart of queryParts) {
    query += queryPart;
  }

  return db.query(query).then(({ rows }) => {
    if (rows.length === 1) {
      return rows[0];
    } else return rows;
  });
};

exports.selectArticleById = (article_id) => {
  return db
    .query(
      format(`SELECT articles.*, COUNT(comment_id) AS comment_count
    FROM articles 
    LEFT JOIN comments ON comments.article_id = articles.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id`),
      [article_id]
    )
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

exports.patchArticle = (votes, article_id) => {
  return db
    .query(
      format(`
  UPDATE articles 
  SET votes = votes + $1
  WHERE article_id = $2
  RETURNING *
  `),
      [votes, article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 1) {
        return rows[0];
      } else {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
    });
};
