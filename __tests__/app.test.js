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
  it("200: should respond with an array of articles in descending order by date as default", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("created_at", { descending: true });
        expect(articles).toHaveLength(10);
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
  it("200: should respond with an array of articles that fit the criteria of the passed queries", () => {
    return request(app)
      .get("/api/articles?sort_by=author&order=ASC")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(10);
        expect(articles).toBeSortedBy("author", { ascending: true });
      });
  });
  it("200: should respond with an array of articles on the passed topic", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(10);
        articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });
  it("400: should respond with a 400 Bad Request error If passed a bad query that is not in the green list", () => {
    return request(app)
      .get("/api/articles?topic=paintDrying")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  it("400: should respond with a 400 Bad Request error If passed a bad query that is not in the green list", () => {
    return request(app)
      .get("/api/articles?sort_by=length")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  it("400: should respond with a 400 Bad Request error If passed a bad query that is not in the green list", () => {
    return request(app)
      .get("/api/articles?order=age")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  it("200: should respond with an empty array, and a status 200 if passed a valid topic that hasn't got an article", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(0);
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
  it("200: should respond with a article that has a comment_count key with a number of comments for that article", () => {
    return request(app)
      .get("/api/articles/5")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toHaveProperty("comment_count");
        expect(article.comment_count).toBe("2");
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
        expect(comments).toBeSortedBy("created_at", { descending: true });
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
});

describe("POST /api/articles/:article_id/comments", () => {
  it("201: should successfully post a comment then respond with the comment and a status 201", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({
        author: "butter_bridge",
        body: "I've gotta be honest I'm clueless about how to test this.",
      })
      .expect(201)
      .then(({ body }) => {
        const { createdComment } = body;
        expect(createdComment.author).toBe("butter_bridge");
        expect(createdComment.body).toBe(
          "I've gotta be honest I'm clueless about how to test this."
        );
        expect(createdComment.article_id).toBe(2);
        expect(Object.keys(createdComment).length).toBe(6);
      });
  });
  it("404: responds with a 404 if the user does not exist", () => {
    return request(app)
      .post("/api/articles/5/comments")
      .send({
        author: "None_existent_user",
        body: "Wow I actually managed to get the request right!",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  it("400: should respond with an Bad Request error when passed an incomplete request", () => {
    return request(app)
      .post("/api/articles/5/comments")
      .send({
        author: "butter_bridge",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  it("404: should respond with a error 404 when passed an id that doesn't exist", () => {
    return request(app)
      .post("/api/articles/2754474/comments")
      .send({
        author: "butter_bridge",
        body: "I've gotta be honest I'm clueless about how to test this.",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  it("400: should respond with a error 400 bad request when passed an invalid id type", () => {
    return request(app)
      .post("/api/articles/notAnId/comments")
      .send({
        author: "butter_bridge",
        body: "I've gotta be honest I'm clueless about how to test this.",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  it("201: creates the comment only using the relevant data from the post", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({
        author: "butter_bridge",
        body: "I've gotta be honest I'm clueless about how to test this.",
        votes: 28,
      })
      .expect(201)
      .then(({ body }) => {
        const { createdComment } = body;
        expect(createdComment.votes).not.toBe(28);
        expect(createdComment.author).toBe("butter_bridge");
        expect(createdComment.body).toBe(
          "I've gotta be honest I'm clueless about how to test this."
        );
        expect(createdComment.article_id).toBe(2);
        expect(Object.keys(createdComment).length).toBe(6);
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  it("204: should respond with a code 204 and a message of no content and the deleted comment", () => {
    return request(app).delete("/api/comments/2").expect(204);
  });
  it("404: should respond with an error 404 if the comment id is not found", () => {
    return request(app).delete("/api/comments/459868").expect(404);
  });
  it("400: should respond with an error 400 if passed a value that isn't a number", () => {
    return request(app).delete("/api/comments/thisIsNaN").expect(400);
  });
});

describe("PATCH /api/articles/:article_id", () => {
  it("200: should respond with the updated row when passed a regular number", () => {
    return request(app)
      .patch("/api/articles/6")
      .send({ votes: 3 })
      .expect(200)
      .then(({ body }) => {
        const { updatedArticle } = body;
        expect(updatedArticle).toMatchObject({
          article_id: 6,
          title: "A",
          topic: "mitch",
          author: "icellusedkars",
          body: "Delicious tin of cat food",
          created_at: "2020-10-18T01:00:00.000Z",
          votes: 3,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  it("200: should respond with the updated row when passed a negative number ", () => {
    return request(app)
      .patch("/api/articles/6")
      .send({ votes: -3 })
      .expect(200)
      .then(({ body }) => {
        const { updatedArticle } = body;
        expect(updatedArticle).toMatchObject({
          article_id: 6,
          title: "A",
          topic: "mitch",
          author: "icellusedkars",
          body: "Delicious tin of cat food",
          created_at: "2020-10-18T01:00:00.000Z",
          votes: -3,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  it("400: should respond with an error 400 when passed an invalid vote value", () => {
    return request(app)
      .patch("/api/articles/6")
      .send({ votes: "hello" })
      .expect(400);
  });
  it("404: should respond with an error 404 when passed an article id that doesn't exist", () => {
    return request(app)
      .patch("/api/articles/3948689")
      .send({ votes: 4 })
      .expect(404);
  });
  it("400: should respond with an error 400 when passed an invalid article id", () => {
    return request(app)
      .patch("/api/articles/giveMOREvotes")
      .send({ votes: 4 })
      .expect(400);
  });
});
