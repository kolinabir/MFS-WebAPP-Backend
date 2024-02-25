import { Schema, model } from 'mongoose';
import { TUser, UserModel } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../config';

const userSchema = new Schema<TUser, UserModel>({
  name: { type: String, required: true },
  pin: { type: String, required: true, max: 5, select: false },
  mobileNumber: {
    type: Number,
    required: true,
    unique: true,
    min: 11,
  },
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true, enum: ['ADMIN', 'USER', 'AGENT'] },
  nid: { type: Number, required: true, unique: true },
  balance: { type: Number, default: 0 },
  isAccountActive: { type: Boolean, default: true },
  isAccountVerified: { type: Boolean, default: false },
  // transaction: [{ type: Schema.Types.ObjectId, ref: 'Transaction' }],
  devicesLogins: { type: Number, default: 0 },
});

userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this; // doc
  // hashing password and save into DB
  user.pin = await bcrypt.hash(user.pin, Number(config.BCRYPT_SALT_ROUNDS));
  next();
});

userSchema.statics.isPinMatch = async function (
  plainPin: string,
  hashedPin: string,
) {
  return await bcrypt.compare(plainPin, hashedPin);
};
export const User = model<TUser, UserModel>('User', userSchema);
