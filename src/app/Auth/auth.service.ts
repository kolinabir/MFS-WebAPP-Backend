/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from 'http-status';
import { User } from '../modules/User/user.model';
import { TLoginUser } from './auth.interface';
import jwt, { JwtPayload } from 'jsonwebtoken';

import bcrypt from 'bcrypt';
import config from '../config';
import AppError from '../middlewares/Errors/AppError';

const loginUser = async (payload: TLoginUser) => {
  let userExists;
  // if email is provided
  if (payload?.email) {
    userExists = await User.findOne({
      email: payload?.email,
    }).select('+pin');
    if (!userExists) {
      throw new AppError(httpStatus.NOT_FOUND, 'This User not found');
    }
  }
  // if mobileNumber is provided
  if (payload?.mobileNumber) {
    userExists = await User.findOne({
      mobileNumber: payload?.mobileNumber,
    }).select('+pin');
    if (!userExists) {
      throw new AppError(httpStatus.NOT_FOUND, 'This User not found');
    }
  }

  if (!userExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'This User not found');
  }

  if (!(await User.isPinMatch(String(payload?.pin), userExists?.pin))) {
    throw new AppError(httpStatus.FORBIDDEN, 'PIN is not correct');
  }
  if (!userExists.isAccountActive) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'This account is blocked by admin',
    );
  }

  if (userExists.role === 'AGENT' || userExists.role === 'USER') {
    // check if only one device is logged in
    if (userExists.devicesLogins ?? 0 > 0) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        'You are already logged in from another device',
      );
    }
    // check if account is active
    if (!userExists.isAccountActive) {
      throw new AppError(httpStatus.FORBIDDEN, 'Account is not active');
    }
  }

  const token = jwt.sign(
    {
      mobileNumber: userExists.mobileNumber,
      email: userExists.email,
      role: userExists.role,
      id: userExists._id,
    },
    config.JWT_SECRET as string,
    {
      expiresIn: '7d',
    },
  );

  const updateDevicesLogins = await User.findOneAndUpdate(
    {
      mobileNumber: userExists.mobileNumber,
    },
    {
      $inc: { devicesLogins: 1 },
    },
    {
      new: true,
    },
  );

  const { pin, isAccountActive, isAccountVerified, balance, ...user } =
    userExists.toObject();
  return {
    user: user,
    token,
  };
};

// const changePasswordToServer = async (
//   user: JwtPayload,
//   passwordData: { oldPassword: string; newPassword: string },
// ) => {
//   const userExists = await User.findOne({ userId: user.userId }).select(
//     '+password',
//   );
//   console.log(userExists, 'userExists');
//   if (!userExists) {
//     throw new AppError(httpStatus.NOT_FOUND, 'This User not found');
//   }
//   if (!(await User.isPinMatch(passwordData.oldPassword, userExists?.pin))) {
//     throw new AppError(httpStatus.FORBIDDEN, 'Password does not match');
//   }
//   const newHashedPassword = await bcrypt.hash(
//     passwordData.newPassword,
//     Number(config.BCRYPT_SALT_ROUNDS),
//   );

//   const result = await User.findOneAndUpdate(
//     {
//       userId: user.userId,
//       role: user.role,
//     },
//     {
//       password: newHashedPassword,
//     },
//     {
//       new: true,
//     },
//   );

//   const userRes = await User.findOne({
//     userId: user.userId,
//   }).select('-__v');
//   return userRes;
// };

const checkAuthentication = async (user: JwtPayload) => {
  const userExists = await User.findOne({
    mobileNumber: user.mobileNumber,
  });
  if (!userExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'This User not found');
  }
  return userExists;
};

const logoutUser = async (user: JwtPayload) => {
  const userExist = await User.findOneAndUpdate(
    {
      mobileNumber: user.mobileNumber,
    },
    {
      $inc: { devicesLogins: -1 },
    },
    {
      new: true,
    },
  );
  return user;
};

export const AuthServices = {
  loginUser,
  // changePasswordToServer,
  checkAuthentication,
  logoutUser,
};
