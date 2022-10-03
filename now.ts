import { Hono } from "hono";
import { prettyJSON } from "hono/pretty-json";
import { logger } from "hono/logger";
import { Database } from "bun:sqlite";

const token = process.env.NOW_TOKEN || "nowtoken";
const dbLocation = process.env.NOW_DB_LOCATION || "now.db";

const db = new Database(dbLocation);

db.run(
  "CREATE TABLE IF NOT EXISTS now (id INTEGER PRIMARY KEY AUTOINCREMENT, time TEXT, content TEXT)"
);

const insert = db.prepare(
  "INSERT INTO now (time, content) VALUES ($time, $content)"
);

const insertNowEntry = (content: string) => {
  const time = new Date().toISOString();
  insert.run({ $time: time, $content: content });
};

const latestNowEntry = () =>
  db.query("SELECT * FROM now ORDER BY time DESC LIMIT 1").all()[0];

const app = new Hono();

app.use("*", logger());
app.use("*", prettyJSON());
app.get("/", (c) => c.json(latestNowEntry()));

app.post("/", async (c) => {
  // TODO figure out why we can't use basicAuth here
  // it seems to consume the body, therefore req.text()
  // resolves to an empty string
  const headerToken = c.req.headers.get("Authorization");
  if (headerToken !== `Bearer ${token}`) {
    return c.text("Incorrect header", 403);
  }

  const content = await c.req.text();
  if (content.length === 0) {
    return c.text("Empty content", 400);
  }

  insertNowEntry(content);
  return c.json(latestNowEntry());
});

export default app;
