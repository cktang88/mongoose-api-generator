const { MongoMemoryServer } = require("mongodb-memory-server");
const request = require("supertest");

// May require additional time for downloading MongoDB binaries
// jest.DEFAULT_TIMEOUT_INTERVAL = 600000;
let server;
let app;
let mongoose;
let mongoServer;

beforeAll(async (done) => {
  process.env.MODELS_DIR = "tests/test_models";

  // start services
  mongoServer = new MongoMemoryServer();
  const mongoUri = await mongoServer.getUri();
  process.env.MONGODB_URL = mongoUri;
  mongoose = require("../framework/core/db").mongoose;
  app = require("../server");
  server = app.listen(done);
});

afterAll(async (done) => {
  await mongoose.disconnect();
  await mongoServer.stop();
  server.close(done);
});

const randEmail = () => `${Date.now()}@gmail.com`;

describe("TEST /api/post", function () {
  let jwt;
  let owner_id;
  const email = randEmail();
  // only applies to test below
  beforeEach(function (done) {
    // sign up and log in with a user
    request(app)
      .post("/auth/signup")
      .send({
        username: "john",
        email,
        password: "helloworld",
      })
      .expect((res) => {
        owner_id = res.body._id;
      })
      .expect(201)
      .then((res) => {
        request(app)
          .post("/auth/login")
          .send({
            email,
            password: "helloworld",
          })
          .set("Accept", "application/json")
          .expect((res) => {
            jwt = res.body.token;
          })
          .expect(200, done);
      });
  });
  it("not logged in", function (done) {
    request(app).get("/api/user").expect(401, "Unauthorized", done);
  });

  let created_id;
  it("bad create one input fails", function (done) {
    request(app)
      .post("/api/post")
      .send({ content: "some words" })
      .set("Authorization", jwt)
      .expect(
        400,
        '"post validation failed: title: Path `title` is required."',
        done
      );
  });
  it("create one", function (done) {
    request(app)
      .post("/api/post")
      .send({ title: "apost", content: "words" })
      .set("Authorization", jwt)
      .expect((res) => {
        created_id = res.body._id;
        delete res.body._id;
        delete res.body.created;
      })
      .expect(
        201,
        {
          title: "apost",
          content: "words",
          owner_id: owner_id,
          __v: 0,
        },
        done
      );
  });

  it("get one", function (done) {
    request(app)
      .get(`/api/post/${created_id}`)
      .set("Authorization", jwt)
      .expect((res) => {
        res.body.created = "<date>";
      })
      .expect(
        200,
        {
          _id: created_id,
          title: "apost",
          content: "words",
          owner_id: owner_id,
          __v: 0,
        },
        done
      );
  });

  it("update one", function (done) {
    request(app)
      .patch("/api/post")
      .set("Authorization", jwt)
      .expect(200, [], done);
  });

  it("remove one", function (done) {
    request(app)
      .delete("/api/post")
      .set("Authorization", jwt)
      .expect(400, "this endpoint is disabled.", done);
  });
  //   beforeEach((done) => {
  //     // test that permissions are respected by a non-owner user
  //     const email2 = randEmail();
  //     // sign up and log in with a user
  //     request(app)
  //       .post("/auth/signup")
  //       .send({
  //         username: "larry",
  //         email: email2,
  //         password: "helloworld2",
  //       })
  //       .expect((res) => {
  //         owner_id = res.body._id;
  //       })
  //       .expect(201)
  //       .then((res) => {
  //         request(app)
  //           .post("/auth/login")
  //           .send({
  //             email: email2,
  //             password: "helloworld2",
  //           })
  //           .set("Accept", "application/json")
  //           .expect((res) => {
  //             jwt = res.body.token;
  //           })
  //           .expect(200, done);
  //       });
  //   });
});
