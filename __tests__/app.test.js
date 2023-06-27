const db = require("../db/connection");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const app = require("../app");
const fs = require("fs");

beforeEach(() => {
  return seed(data);
});

afterAll(() => db.end());

describe("GET /api/topics", () => {
  it("200: should respond with a list of all topics and with each having a slug and description property", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
        });
      });
  });
  it("404: should respond with 404 when passed a endpoint that does not exist", () => {
    return request(app).get("/api/PowerWolf").expect(404);
  });
});

describe("GET /api/", () => {
  it("200: should respond with an object of api endpoints with a short description on what they go to", () => {
    const fileContents = JSON.parse(
      fs.readFileSync(`${__dirname}/../endpoints.json`, "utf-8")
    );
    return request(app)
      .get("/api/")
      .expect(200)
      .then(({ body }) => {
        expect(typeof body).toBe("object");
        expect(body).toEqual(fileContents);
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  it("200: should respond with an article with the correct id and all expected properties", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveLength(1);
        expect(body[0]).toHaveProperty("author");
        expect(body[0]).toHaveProperty("title");
        expect(body[0]).toHaveProperty("article_id");
        expect(body[0]).toHaveProperty("body");
        expect(body[0]).toHaveProperty("topic");
        expect(body[0]).toHaveProperty("created_at");
        expect(body[0]).toHaveProperty("votes");
        expect(body[0]).toHaveProperty("article_img_url");
      });
  });
  it("404: should return a error 404 if passed an id that does not exist", () => {
    return request(app)
      .get("/api/articles/14000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
});
