describe("GET /user", function () {
  it("responds with json", function (done) {
    request(app)
      .get("/user")
      .auth("username", "password")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, done);
  });
});
