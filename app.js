const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const { getApiInfo } = require("./controllers/api.controllers");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/", getApiInfo);

module.exports = app;
