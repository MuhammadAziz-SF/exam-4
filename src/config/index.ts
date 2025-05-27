import { config } from 'dotenv';
config();

export default {
  PORT: Number(process.env.PORT),
  PG_HOST: process.env.PG_HOST,
  PG_PORT: Number(process.env.PG_PORT),
  PG_USER: process.env.PG_USER,
  PG_PASS: String(process.env.PG_PASS),
  PG_DB: process.env.PG_DB,
  JWT_ACCESS_K: process.env.JWT_ACCESS_SECRET_KEY,
  JWT_ACCESS_T: process.env.JWT_ACCESS_SECRET_TIME,
  JWT_REFRESH_K: process.env.JWT_REFRESH_SECRET_KEY,
  JWT_TIME_T: process.env.JWT_REFRESH_SECRET_TIME,
};