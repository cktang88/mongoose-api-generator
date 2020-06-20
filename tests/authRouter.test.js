const { MongoMemoryServer } = require("mongodb-memory-server");
const request = require("supertest");
const http = require("http");

// May require additional time for downloading MongoDB binaries
// jest.DEFAULT_TIMEOUT_INTERVAL = 600000;
let server;
let app;
let mongoose;
let mongoServer;

beforeAll(async (done) => {
  mongoServer = new MongoMemoryServer();
  const mongoUri = await mongoServer.getUri();
  process.env.MONGODB_URL = mongoUri;
  mongoose = require("../system/generator/db").mongoose;
  app = require("../server");
  server = http.createServer(app);
  server.listen(done);
});

afterAll(async (done) => {
  await mongoose.disconnect();
  await mongoServer.stop();
  server.close(done);
});

describe("POST /auth/signup", function () {
  it("invalid input returns 400", function (done) {
    request(app)
      .post("/auth/signup")
      .send({ name: "john" })
      .set("Accept", "application/json")
      .expect(400, done);
  });

  it("correct input returns 200", function (done) {
    request(app)
      .post("/auth/signup")
      .send({
        username: "john",
        email: "john@gmail.com",
        password: "helloworld",
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(function (res) {
        // patch password
        res.body.password = "pw";
        res.body._id = "id";
        res.body.created = "<date>";
      })
      .expect(
        201,
        {
          _id: "id",
          username: "john",
          email: "john@gmail.com",
          password: "pw",
          created: "<date>",
          __v: 0,
        },
        done
      );
  });
  it("email exists - returns 400", function (done) {
    request(app)
      .post("/auth/signup")
      .send({
        username: "john2",
        email: "john@gmail.com",
        password: "helloworld2",
      })
      .set("Accept", "application/json")
      .expect(400, done);
  });
});

describe("POST /auth/login", function () {
  it("correct returns 200", function (done) {
    request(app)
      .post("/auth/login")
      .send({
        email: "john@gmail.com",
        password: "helloworld",
      })
      .set("Accept", "application/json")
      .expect((res) => {
        if (res.body.token) res.body.token = "Bearer tokenabc";
      })
      .expect(
        200,
        {
          success: true,
          token: "Bearer tokenabc",
        },
        done
      );
  });
  it("incorrect returns 400", function (done) {
    request(app)
      .post("/auth/login")
      .send({
        email: "john@gmail.com",
        password: "wrongpw",
      })
      .set("Accept", "application/json")
      .expect((res) => {
        if (res.body.token) res.body.token = "Bearer tokenabc";
      })
      .expect(400, '"Password is incorrect"', done);
  });
});

describe("GET /auth/profile", function () {
  it("not logged in - 401", function (done) {
    request(app).get("/auth/profile").expect(401, done);
  });
  let jwt;

  // only applies to test below
  beforeEach(function (done) {
    request(app)
      .post("/auth/login")
      .send({
        email: "john@gmail.com",
        password: "helloworld",
      })
      .set("Accept", "application/json")
      .expect((res) => {
        jwt = res.body.token;
      })
      .expect(200, done);
  });
  it("logged in - 200", function (done) {
    request(app)
      .get("/auth/profile")
      .set("Authorization", jwt)
      .expect(function (res) {
        // patch password
        res.body.password = "pw";
        res.body._id = "id";
        res.body.created = "<date>";
      })
      .expect(
        200,
        {
          _id: "id",
          username: "john",
          email: "john@gmail.com",
          password: "pw",
          created: "<date>",
          __v: 0,
        },
        done
      );
  });
});
