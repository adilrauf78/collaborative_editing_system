const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../server");
const Document = require("../models/documentModel");
const DocumentVersion = require("../models/versionModel");

let mongoServer;
let token;
let document;
const userId = new mongoose.Types.ObjectId(); // fake user id

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Create a test document
  document = await Document.create({
    title: "Test Document",
    content: "Initial content",
    owner: userId,
  });

  // Create JWT token
  token = jwt.sign({ id: userId }, process.env.JWT_SECRET || "SECRET123", {
    expiresIn: "1h",
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("POST /api/v1/version/add", () => {
  it("should create a new version", async () => {
    const res = await request(app)
      .post("/api/v1/version/add")
      .set("Authorization", `Bearer ${token}`)
      .send({
        documentId: document._id,
        content: "This is test content",
        notes: "First version",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.version.versionNumber).toBe(1);
  });
});

describe("GET /api/v1/version/:documentId/versions", () => {
  it("should return a list of versions", async () => {
    const res = await request(app)
      .get(`/api/v1/version/${document._id}/versions`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.versions)).toBe(true);
    expect(res.body.versions.length).toBeGreaterThan(0);
  });
});
