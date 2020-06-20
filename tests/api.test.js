const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const request = require("supertest");
const http = require("http");

let app;

// May require additional time for downloading MongoDB binaries
// jest.DEFAULT_TIMEOUT_INTERVAL = 600000;
let server;
let mongoServer;
const opts = { useMongoClient: true }; // remove this option if you use mongoose 5 and above

beforeAll(async (done) => {
  // special patch
  //   process.env.MODELS_DIR = "tests/test_models";

  mongoServer = new MongoMemoryServer();
  const mongoUri = await mongoServer.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });
  app = require("../server");
  server = http.createServer(app);
  server.listen(done);
});

afterAll(async (done) => {
  await mongoose.disconnect();
  await mongoServer.stop();
  server.close(done);
});

describe("TEST /api/post", function () {
  it("not logged in", function (done) {
    request(app).get("/api/user").expect(404, done);
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
    request(app).get("/api/user").set("Authorization", jwt).expect(
      200,
      {
        a: 2,
      },
      done
    );
  });
});
