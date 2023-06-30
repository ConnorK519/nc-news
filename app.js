const express = require("express");

const { getTopics } = require("./controllers/topics.controllers");

const { getApiInfo } = require("./controllers/api.controllers");

const { getUsers } = require("./controllers/users.controllers");

const {
  getArticles,
  getArticleById,
} = require("./controllers/articles.controllers");

const {
  getCommentsByArticleId,
  postCommentByArticleId,
  deleteCommentById,
} = require("./controllers/comments.controllers");

const {
  handlePsqlErrors,
  handleCustomErrors,
  handleServerErrors,
  handleFalseEndpoints,
} = require("./errors/error-handling");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/", getApiInfo);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.get("/api/users", getUsers);

app.get("*", handleFalseEndpoints);

app.use(handlePsqlErrors);

app.use(handleCustomErrors);

app.use(handleServerErrors);

module.exports = app;
