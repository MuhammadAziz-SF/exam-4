import { Response } from 'express';
import config from '../config';

export const writeToCookie = (res: Response, key: string, value: string) => {
  res.cookie(key, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'development',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: 'strict',
  });
};

export const clearCookie = (res: Response, key: string) => {
  res.clearCookie(key, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'development',
    sameSite: 'strict',
  });
};