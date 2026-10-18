import test, { after, before } from "node:test";
import assert from "node:assert/strict";

process.env.NODE_ENV = "test";
const { default: app } = await import("../src/index.js");
let server;
let baseUrl;

before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  if (server) await new Promise((resolve, reject) => server.close((err) => err ? reject(err) : resolve()));
});

test("health route reports API service status", async () => {
  const response = await fetch(`${baseUrl}/api/health`);
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.status, "ok");
  assert.equal(body.service, "fieldwise-crop-api");
});

test("prediction route returns ranked recommendations for valid inputs", async () => {
  const response = await fetch(`${baseUrl}/api/predict`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ soilType: "loam", season: "monsoon", temperature: 28, ph: 6.5, rainfall: 180 })
  });
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.recommendations.length, 4);
  assert.equal(body.input.soilType, "loam");
  assert.ok(body.recommendations.every((item) => Number.isFinite(item.score) && item.score >= 0 && item.score <= 100));
});

test("prediction route rejects invalid fields", async () => {
  const response = await fetch(`${baseUrl}/api/predict`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ soilType: "unknown", season: "monsoon", temperature: 28, ph: 6.5, rainfall: 180 })
  });
  assert.equal(response.status, 400);
  assert.match((await response.json()).error, /Check soil type/);
});
