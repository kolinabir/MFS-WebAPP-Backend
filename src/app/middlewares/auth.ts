import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import AppError from './Errors/AppError';
import catchAsync from '../utils/catchAsync';
import { TUSER_ROLE } from '../modules/User/user.interface';

const auth = (...requiredRoles: TUSER_ROLE[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    //check if token exists
    if (!token) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'You are not authorized to access this route',
      );
    }
    //check if the token is valid
    jwt.verify(token, config.JWT_SECRET as string, (err, decoded) => {
      if (err) {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          'You do not have the necessary permissions to access this resource.',
        );
      }
      const roll = (decoded as JwtPayload).role;
      if (requiredRoles && !requiredRoles.includes(roll)) {
        throw new AppError(
          httpStatus.FORBIDDEN,
          'You do not have the necessary permissions to access this resource.',
        );
      }

      req.user = decoded as JwtPayload;
      next();
    });
  });
};

export default auth;
