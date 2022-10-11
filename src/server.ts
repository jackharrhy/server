import { Hono } from "hono";
import { prettyJSON } from "hono/pretty-json";
import { logger } from "hono/logger";
import { cors } from 'hono/cors';

import { now } from "./routes/now";

const app = new Hono();

app.use("*", logger());
app.use("*", prettyJSON());
app.use("*", cors());

app.route("/now", now);

export default app;
