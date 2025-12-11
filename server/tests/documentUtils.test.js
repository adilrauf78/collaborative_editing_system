const { calculateDiff } = require("../utils/documentUtils");

describe("Document Utils Unit Tests", () => {
  test("calculateDiff returns correct length difference", () => {
    expect(calculateDiff("Hello", "Hello World")).toBe(6);
    expect(calculateDiff("abc", "ab")).toBe(-1);
  });
});
