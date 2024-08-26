const express = require("express");
const cors = require("cors");

const { pagination } = require("./middleware/pagination");

const { getTopics } = require("./controllers/topics.controllers");

const { getApiInfo } = require("./controllers/api.controllers");

const { getUsers } = require("./controllers/users.controllers");

const {
  getArticles,
  getArticleById,
  patchArticleById,
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

app.use(cors());

app.use(express.json());

app.get("/api/", getApiInfo);

app.get("/api/users", getUsers);

app.get("/api/topics", getTopics);

app.get("/api/articles", pagination, getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.patch("/api/articles/:article_id", patchArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.get("*", handleFalseEndpoints);

app.use(handlePsqlErrors);

app.use(handleCustomErrors);

app.use(handleServerErrors);

module.exports = app;
