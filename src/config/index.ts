import { config } from 'dotenv';
config();

export default {
  PORT: Number(process.env.PORT),
  PG_HOST: String(process.env.PG_HOST),
  PG_PORT: Number(process.env.PG_PORT),
  PG_USER: String(process.env.PG_USER),
  PG_PASS: String(process.env.PG_PASS),
  PG_DB: String(process.env.PG_DB),
  JWT_ACCESS_K: String(process.env.JWT_ACCESS_SECRET_KEY),
  JWT_ACCESS_T: String(process.env.JWT_ACCESS_SECRET_TIME),
  JWT_REFRESH_K: String(process.env.JWT_REFRESH_SECRET_KEY),
  JWT_TIME_T: String(process.env.JWT_REFRESH_SECRET_TIME),
  MAIL_HOST: String(process.env.SMTP_HOST),
  MAIL_PORT: Number(process.env.SMTP_PORT),
  MAIL_USER: String(process.env.SMTP_USER),
  MAIL_PASS: String(process.env.SMTP_PASS),
  MAIL_FROM: String(process.env.SMTP_FROM),
  ADMIN_FULL_NAME: String(process.env.ADMIN_FULL_NAME),
  ADMIN_EMAIL: String(process.env.ADMIN_EMAIL),
  ADMIN_PHONE: String(process.env.ADMIN_PHONE),
  ADMIN_PASSWORD: String(process.env.ADMIN_PASSWORD),
};
