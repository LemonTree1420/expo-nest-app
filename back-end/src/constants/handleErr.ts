import { BadRequestException } from '@nestjs/common';

export const handleMongooseErr = (err: any) => {
  if (err.name === 'Error' && err.message === "Doesn't exist.") {
    throw new BadRequestException('managerUserId');
  }
  if (err.name === 'MongoServerError' && err.code === 11000) {
    const keys = Object.keys(err.keyPattern);
    throw new BadRequestException(keys[0]);
  }
};
