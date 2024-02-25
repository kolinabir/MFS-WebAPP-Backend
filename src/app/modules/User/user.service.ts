/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { JwtPayload } from 'jsonwebtoken';
import { TUser } from './user.interface';
import { User } from './user.model';
import {
  TransactionCashIn,
  TransactionCashOut,
  TransactionSendMoney,
} from '../MoneyTransactions/transaction.model';

const createUserIntoDB = async (payload: TUser) => {
  let balance = 0;
  if (payload.role === 'USER') {
    balance = 40;
  }
  const result = await User.create({
    ...payload,
    balance,
  });
  const { pin, ...user } = result.toObject();
  return user;
};

const approveAgent = async (payload: string) => {
  //check if already approved
  const user = await User.findById(payload);
  if (user?.role !== 'AGENT') {
    throw new Error('User is not an agent');
  }
  if (user.isAccountVerified) {
    throw new Error('User is already approved');
  }
  const result = await User.findByIdAndUpdate(
    payload,
    { isAccountVerified: true, balance: 100000 },
    { new: true },
  );
  return result;
};

const viewNewAgents = async () => {
  const result = await User.find({
    role: 'AGENT',
    isAccountVerified: false,
  });
  const numberOfAgents = result.length;
  return { result, numberOfAgents };
};

const blockUser = async (payload: string) => {
  const result = await User.findByIdAndUpdate(
    payload,
    { isAccountActive: false },
    { new: true },
  );
  return result;
};

const unblockUser = async (payload: string) => {
  const result = await User.findByIdAndUpdate(
    payload,
    { isAccountActive: true },
    { new: true },
  );
  return result;
};

const getBalance = async (user: JwtPayload) => {
  const result = await User.find({
    mobileNumber: user.mobileNumber,
  }).select('balance');
  return result;
};

const getAllMoney = async () => {
  const result = await User.find({}).select('balance');
  let total = 0;
  for (const user of result) {
    total += user.balance;
  }
  return total;
};

const viewBalanceOfUserORAgent = async (mobileNumber: number) => {
  const result = await User.findOne({
    mobileNumber: mobileNumber,
  }).select('balance role name email mobileNumber nid');
  return result;
};

const getAllTransactions = async (userN: JwtPayload) => {
  const user = await User.findOne({
    mobileNumber: userN.mobileNumber,
  });
  if (!user) {
    throw new Error('User not found');
  }

  const sendMoney = await TransactionSendMoney.find({
    sender: user._id,
  });
  const receiveMoney = await TransactionSendMoney.find({
    receiver: user._id,
  });
  const cashIn = await TransactionCashIn.find({
    user: user._id,
  });
  const cashOut = await TransactionCashOut.find({
    user: user._id,
  });

  const allTransactions = [
    ...sendMoney,
    ...receiveMoney,
    ...cashIn,
    ...cashOut,
  ].sort((a, b) => {
    const dateA =
      a.transactionDate instanceof Date
        ? a.transactionDate.getTime()
        : undefined;
    const dateB =
      b.transactionDate instanceof Date
        ? b.transactionDate.getTime()
        : undefined;
    if (dateA !== undefined && dateB !== undefined) {
      return dateB - dateA;
    }
    return 0;
  });
  //show only 100 transactions
  if (allTransactions.length > 100) {
    return allTransactions.slice(0, 100);
  }
  return allTransactions;
};

const getAllTransactionsOfUserORAgent = async (mobileNumber: number) => {
  const user = await User.findOne({
    mobileNumber: mobileNumber,
  });
  if (!user) {
    throw new Error('User not found');
  }
  const sendMoney = await TransactionSendMoney.find({
    sender: user._id,
  });
  const receiveMoney = await TransactionSendMoney.find({
    receiver: user._id,
  });
  const cashIn = await TransactionCashIn.find({
    user: user._id,
  });
  const cashOut = await TransactionCashOut.find({
    user: user._id,
  });

  const allTransactions = [
    ...sendMoney,
    ...receiveMoney,
    ...cashIn,
    ...cashOut,
  ].sort((a, b) => {
    const dateA =
      a.transactionDate instanceof Date
        ? a.transactionDate.getTime()
        : undefined;
    const dateB =
      b.transactionDate instanceof Date
        ? b.transactionDate.getTime()
        : undefined;
    if (dateA !== undefined && dateB !== undefined) {
      return dateB - dateA;
    }
    return 0;
  });
  return allTransactions;
};

export const UserService = {
  createUserIntoDB,
  approveAgent,
  viewNewAgents,
  blockUser,
  unblockUser,
  getBalance,
  getAllMoney,
  viewBalanceOfUserORAgent,
  getAllTransactions,
  getAllTransactionsOfUserORAgent,
};
