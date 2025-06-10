import { HttpException, InternalServerErrorException } from '@nestjs/common';

export const catchError = (error: any) => {
  console.log(error);

  if (error?.response) {
    throw new HttpException(
      error?.response?.message,
      error?.response?.statusCode,
    );
  } else {
    throw new InternalServerErrorException(error.message);
  }
};
