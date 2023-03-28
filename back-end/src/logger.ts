import { Logger } from '@nestjs/common';

export enum Process {
  CONTROLLER = 'Controller',
  SERVICE = 'Service',
}

export const logging = (
  userId: string,
  process: string,
  functionName: string,
) => {
  const logger = new Logger(process);
  logger.verbose(`Payload: ${userId}, Called: ${process}-${functionName}`);
};
