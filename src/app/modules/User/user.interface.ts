/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';
import { USER_ROLE } from './user.constant';

export interface Transaction {
  id: Types.ObjectId;
}

export interface TUser {
  name: string;
  pin: string;
  mobileNumber: number;
  email: string;
  role: 'ADMIN' | 'USER' | 'AGENT';
  nid: number;
  balance: number;
  isAccountActive: boolean;
  isAccountVerified: boolean;
  transaction?: Transaction[];
  devicesLogins?: number;
}
export interface UserModel extends Model<TUser> {
  isUserExistsByUserName: (userId: string) => Promise<TUser>;
  isPinMatch: (
    // eslint-disable-next-line no-unused-vars
    plainTextPin: string,
    hashedPin: string,
  ) => Promise<boolean>;
}

export type TUSER_ROLE = keyof typeof USER_ROLE;
