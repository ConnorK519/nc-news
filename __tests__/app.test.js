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

describe("GET /api/articles", () => {
  it("200: should respond with an array of all articles in descending order by date", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("created_at", { descending: true });
        expect(articles).toHaveLength(13);
        articles.forEach((article) => {
          expect(article).not.toHaveProperty("body");
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
          expect(article).toHaveProperty("comment_count");
        });
      });
  });
});
describe("GET /api/articles/:article_id", () => {
  it("200: should respond with an article with the correct id and all expected properties", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body }) => {
        expect(body).toMatchObject({
          article: {
            article_id: 2,
            title: "Sony Vaio; or, The Laptop",
            topic: "mitch",
            author: "icellusedkars",
            body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
            created_at: "2020-10-16T05:03:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          },
        });
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
  it("400: should respond with an error 400 Bad Request when passed a string that is not another endpoint", () => {
    return request(app)
      .get("/api/articles/BANANA")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  it("200: should respond with an array of comment objects that all have a author_id that corresponds to passed parametric endpoint", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toHaveLength(11);
        expect(comments).toBeSortedBy("created_at", { ascending: true });
        comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("body");
          expect(comment).toHaveProperty("article_id");
          expect(comment.article_id).toBe(1);
        });
      });
  });
  it("404: should respond with an error 404 when passed a article id that does not exist", () => {
    return request(app)
      .get("/api/articles/100000/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  it("400: should respond with an error 400 if passed anything other than a number", () => {
    return request(app)
      .get("/api/articles/:article_id/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  it("200: should return an empty array if there are no comments for the passed article", () => {
    return request(app)
      .get("/api/articles/4/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toHaveLength(0);
      });
  });
});

describe("GET /api/users", () => {
  it("200: should respond with an array of users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toHaveProperty("username");
          expect(user).toHaveProperty("name");
          expect(user).toHaveProperty("avatar_url");
        });
      });
  });
});

describe("Testing for the handleFalsePath function", () => {
  it("404: should respond with an error 404 for a variety of endpoints that do not exist", () => {
    return request(app)
      .get("/api/potatoes")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  it("404: should respond with an error 404 for a variety of endpoints that do not exist", () => {
    return request(app)
      .get("/api/articles/4/cabbage")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  it("404: should respond with an error 404 for a variety of endpoints that do not exist", () => {
    return request(app)
      .get("/api/users/tomato")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  it("404: should respond with an error 404 for a variety of endpoints that do not exist", () => {
    return request(app)
      .get("/api/topics/turtles")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  it("404: should respond with an error 404 for a variety of endpoints that do not exist", () => {
    return request(app)
      .get("/api/articles/4/comments/weather")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
});
