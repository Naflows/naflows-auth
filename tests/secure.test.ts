

// Basic test just to debug jest

const { test, expect } = require('@jest/globals');

test("1 + 1 = 2", async () => {
  const result = 1 + 1;
  expect(result).toBe(2);
});

