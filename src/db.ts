import { Database } from "bun:sqlite";
import { dbLocation } from "./config";

export type Now = {
  id: number;
  time: string;
  content: string;
};

export const db = new Database(dbLocation);

db.run(
  `
CREATE TABLE IF NOT EXISTS now (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    time TEXT,
    content TEXT
)
`.trim()
);
