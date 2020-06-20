const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const request = require("supertest");
const http = require("http");

const app = require("../server");

// May require additional time for downloading MongoDB binaries
// jest.DEFAULT_TIMEOUT_INTERVAL = 600000;
let server;
let mongoServer;
const opts = { useMongoClient: true }; // remove this option if you use mongoose 5 and above

beforeAll(async (done) => {
  mongoServer = new MongoMemoryServer();
  const mongoUri = await mongoServer.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });
  server = http.createServer(app);
  server.listen(done);
});

afterAll(async (done) => {
  await mongoose.disconnect();
  await mongoServer.stop();
  server.close(done);
});

describe("...", () => {
  it("...", async () => {
    const User = mongoose.model("User", new mongoose.Schema({ name: String }));
    const count = await User.countDocuments();
    expect(count).toEqual(0);
  });
});

describe("GET /auth/profile", function () {
  it("returns 401", function (done) {
    request(app).get("/auth/profile").expect(401, done);
  });
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
});

describe("POST /auth/login", function () {
  it("returns 200", function (done) {
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
});
