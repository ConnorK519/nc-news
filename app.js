const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const { getApiInfo } = require("./controllers/api.controllers");
const { getArticles } = require("./controllers/articles.controllers");

const app = express();

app.get("/api/topics", getTopics);

app.get("/api/", getApiInfo);

app.get("/api/articles", getArticles);

module.exports = app;
