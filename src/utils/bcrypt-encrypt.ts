import { hash, compare } from 'bcryptjs';

export const encrypt = async (data: string) => {
  return hash(data, 7);
};

export const decrypt = async (data: string, encryptData: string) => {
  return compare(data, encryptData);
};