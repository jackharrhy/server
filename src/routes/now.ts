import { marked } from "marked";
import { Hono } from "hono";
import { token } from "~/config";
import type { Now } from "~/db";
import { db } from "~/db";

marked.setOptions({ gfm: true });

const insert = db.prepare(
  "INSERT INTO now (time, content) VALUES ($time, $content)"
);

const insertNowEntry = (content: string) => {
  const time = new Date().toISOString();
  insert.run({ $time: time, $content: content });
};

const latestNowEntry: () => (Now & { html: string }) | undefined = () => {
  const dbNow = db
    .query("SELECT id, time, content FROM now ORDER BY time DESC LIMIT 1")
    .all()[0];
  return { ...dbNow, html: marked.parse(dbNow.content) };
};

export const now = new Hono();

now.get("/", (c) => c.json(latestNowEntry()));

now.post("/", async (c) => {
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

  const latest = latestNowEntry();
  if (latest !== undefined && latest.content === content) {
    return c.text("Same content", 400);
  }

  insertNowEntry(content);
  return c.json(latestNowEntry());
});
