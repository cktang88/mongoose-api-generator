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
  await server.listen(done);
});

afterAll(async (done) => {
  await mongoose.disconnect();
  await mongoServer.stop();
  await server.close(done);
});

describe("...", () => {
  it("...", async () => {
    const User = mongoose.model("User", new mongoose.Schema({ name: String }));
    const count = await User.countDocuments();
    expect(count).toEqual(0);
  });
});

describe("GET /auth/profile", function () {
  it("responds with json", function (done) {
    request(app).get("/auth/profile").expect(401, done);
  });
});
