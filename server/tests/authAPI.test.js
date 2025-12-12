const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../server"); 

let mongoServer;
let refreshToken = "";
let accessToken = "";


// SETUP - Run before all tests

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create(); 
  const uri = mongoServer.getUri();
  await mongoose.connect(uri); 
});


// TEARDOWN - Run after all tests

afterAll(async () => {
  await mongoose.connection.dropDatabase(); // optional but clean
  await mongoose.connection.close();
  await mongoServer.stop();
});


// SIGNUP TEST

describe("POST /api/v1/auth/signup", () => {
  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/v1/auth/signup")
      .send({
        userName: "Test User",
        email: "testuser@example.com",
        password: "123456",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });
});


// LOGIN TEST

describe("POST /api/v1/auth/login", () => {
  it("should login user and return tokens", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: "testuser@example.com",
        password: "123456",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);

    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;
  });
});


// REFRESH TOKEN TEST

describe("POST /api/v1/auth/refresh-token", () => {
  it("should return a new access token", async () => {
    const res = await request(app)
      .post("/api/v1/auth/refresh-token")
      .send({
        refreshToken: refreshToken,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
