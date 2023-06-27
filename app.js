const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const { getApiInfo } = require("./controllers/api.controllers");
const { getArticleById } = require("./controllers/articles.controllers");
const {
  handlePsqlErrors,
  handleCustomErrors,
  handleServerErrors,
} = require("./errors/error-handling");

const app = express();

app.get("/api/topics", getTopics);

app.get("/api/", getApiInfo);

app.get("/api/articles/:article_id", getArticleById);

app.use(handlePsqlErrors);

app.use(handleCustomErrors);

app.use(handleServerErrors);

module.exports = app;
