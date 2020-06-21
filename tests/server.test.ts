import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import mongoose from "mongoose";
import http from "http";
const app = require("../server");

// May require additional time for downloading MongoDB binaries
// jest.DEFAULT_TIMEOUT_INTERVAL = 600000;
//@ts-ignore
let server;
let mongoServer: MongoMemoryServer;

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
  //@ts-ignore
  server.close(done);
});
describe("starts memory server", () => {
  it("smoke test succeeds", async () => {
    const User = mongoose.model("User", new mongoose.Schema({ name: String }));
    const count = await User.countDocuments();
    expect(count).toEqual(0);
  });
});

describe("starts server", function () {
  it("is not undefined", function () {
    expect(app).toBeDefined();
  });
});
