const { test, expect } = require('@jest/globals');
const axios = require('axios');
const app = "http://localhost:3000";

test("UCR Validity", async () => {
  const response = await axios.post(`${app}/`, {

  });
  expect(result).toBe(2);
});

