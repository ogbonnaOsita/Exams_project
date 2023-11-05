import "dotenv/config";
import type { Knex } from "knex";

// const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env;
const {
  DB_HOST_PROD,
  DB_PORT_PROD,
  DB_USER_PROD,
  DB_PASSWORD_PROD,
  DB_DATABASE_PROD,
} = process.env;

// Update with your config settings.

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "postgresql",
    connection: {
      host: DB_HOST_PROD,
      port: Number(DB_PORT_PROD),
      user: DB_USER_PROD,
      password: DB_PASSWORD_PROD,
      database: DB_DATABASE_PROD,
      ssl: true,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },

  staging: {
    client: "postgresql",
    connection: {
      host: DB_HOST_PROD,
      port: Number(DB_PORT_PROD),
      user: DB_USER_PROD,
      password: DB_PASSWORD_PROD,
      database: DB_DATABASE_PROD,
      ssl: true,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },

  production: {
    client: "postgresql",
    connection: {
      host: DB_HOST_PROD,
      port: Number(DB_PORT_PROD),
      user: DB_USER_PROD,
      password: DB_PASSWORD_PROD,
      database: DB_DATABASE_PROD,
      ssl: true,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};

module.exports = config;
