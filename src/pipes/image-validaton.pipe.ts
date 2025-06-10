import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { extname } from 'path';
import { catchError } from 'src/utils/catch-error';
import {  } from 'src/utils/cookie';

@Injectable()
export class ImageValidationPipe implements PipeTransform {
  private readonly allowedExtensions = [
    '.jpeg',
    '.jpg',
    '.png',
    '.svg',
    '.heic',
    '.webp',
  ];

  transform(value: any, metadata: ArgumentMetadata) {
    try {
      if (value) {
        const files = Array.isArray(value) ? value : [value];
        for (let image of files) {
          const file = image.originalname;
          const ext = extname(file).toLowerCase();
          if (!this.allowedExtensions.includes(ext)) {
            throw new BadRequestException(
              `Only allowed files: ${this.allowedExtensions.join(', ')}`,
            );
          }
        }
      }
      return value;
    } catch (error) {
      return catchError(error);
    }
  }
}
