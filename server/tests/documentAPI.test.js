// tests/documentAPI.test.js

const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../server"); // ✅ server.js should export `app`
const User = require("../models/userModel");
const Document = require("../models/documentModel");

let mongoServer;
let token;
let documentId;

// -----------------------------
// SETUP - run before all tests
// -----------------------------
beforeAll(async () => {
  jest.setTimeout(20000);

  // in-memory MongoDB
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri); // ✅ removed unsupported options

  // Clear collections
  await User.deleteMany({});
  await Document.deleteMany({});

  // Create test user
  const testEmail = `test_${Date.now()}@example.com`;

  await request(app).post("/api/v1/auth/signup").send({
    userName: "Test User",
    email: testEmail,
    password: "123456",
  });

  const loginRes = await request(app).post("/api/v1/auth/login").send({
    email: testEmail,
    password: "123456",
  });

  token = loginRes.body.accessToken;
});

// -----------------------------
// TEARDOWN - run after all tests
// -----------------------------
afterAll(async () => {
  await mongoose.connection.dropDatabase(); // optional cleanup
  await mongoose.connection.close();
  await mongoServer.stop();
});

// -----------------------------
// TEST SUITE - Document API
// -----------------------------
describe("Document API Integration Tests", () => {

  test("Should create a new document", async () => {
    const res = await request(app)
      .post("/api/v1/documents/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Document",
        content: "Hello world",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty("document");

    documentId = res.body.document._id;
  });

  test("Should get the created document", async () => {
    const res = await request(app)
      .get(`/api/v1/documents/${documentId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.document).toHaveProperty("title", "Test Document");
  });

  test("Should update the document", async () => {
    const res = await request(app)
      .put(`/api/v1/documents/${documentId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        content: "Updated content",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.document).toHaveProperty("content", "Updated content");
  });

  test("Should get all user documents", async () => {
    const res = await request(app)
      .get("/api/v1/documents/getall")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.documents)).toBe(true);
    expect(res.body.documents.length).toBeGreaterThan(0);
  });

});
