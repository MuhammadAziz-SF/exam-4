import { InternalServerErrorException } from "@nestjs/common";


export const generateOTP = (): number => {
    try {
      return Math.floor(100000 + Math.random() * 900000);
    } catch (error) {
      throw new InternalServerErrorException('Error generating OTP');
    }
  }