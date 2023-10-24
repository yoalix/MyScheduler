import Database from "better-sqlite3";

const db = Database("./mydb.db", { verbose: console.log });
db.exec(
  `create table if not exists refresh_token (
    token TEXT PRIMARY KEY
);`
);

export const getRefreshToken = () => {
  return db.prepare("select token from refresh_token limit 1;").get();
};

export const createOrUpdateRefreshToken = (token: string) => {
  const query = db
    .prepare("insert or replace into refresh_token (token) values (?);")
    .run(token);
  return getRefreshToken();
};
