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
  }).populate({
    path: 'receiver',
    select: 'name mobileNumber',
  });
  const receiveMoney = await TransactionSendMoney.find({
    receiver: user._id,
  }).populate({
    path: 'sender',
    select: 'name mobileNumber',
  });
  let cashIn = [];
  if (user.role === 'AGENT') {
    cashIn = await TransactionCashIn.find({
      agent: user._id,
    }).populate({
      path: 'user',
      select: 'name mobileNumber',
    });
  } else {
    cashIn = await TransactionCashIn.find({
      user: user._id,
    }).populate({
      path: 'agent',
      select: 'name mobileNumber',
    });
  }
  const cashOut = await TransactionCashOut.find({
    user: user._id,
  }).populate({
    path: 'agent',
    select: 'name mobileNumber',
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
  }).populate({
    path: 'receiver',
    select: 'name mobileNumber',
  });
  const receiveMoney = await TransactionSendMoney.find({
    receiver: user._id,
  }).populate({
    path: 'sender',
    select: 'name mobileNumber',
  });
  let cashIn = [];
  if (user.role === 'AGENT') {
    cashIn = await TransactionCashIn.find({
      agent: user._id,
    }).populate({
      path: 'user',
      select: 'name mobileNumber',
    });
  } else {
    cashIn = await TransactionCashIn.find({
      user: user._id,
    }).populate({
      path: 'agent',
      select: 'name mobileNumber',
    });
  }
  let cashOut = [];
  if (user.role === 'USER') {
    cashOut = await TransactionCashOut.find({
      user: user._id,
    }).populate({
      path: 'agent',
      select: 'name mobileNumber',
    });
  } else {
    cashOut = await TransactionCashOut.find({
      agent: user._id,
    }).populate({
      path: 'user',
      select: 'name mobileNumber',
    });
  }

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

const viewAllUsers = async () => {
  const result = await User.find({
    role: 'USER',
    isAccountActive: true,
  });
  return result;
};

const viewAllBlockedUsers = async () => {
  const result = await User.find({
    role: 'USER',
    isAccountActive: false,
  });
  return result;
};

const viewAllAgents = async () => {
  const result = await User.find({
    role: 'AGENT',
    isAccountActive: true,
    isAccountVerified: true,
  });
  return result;
};

const viewAllBlockedAgents = async () => {
  const result = await User.find({
    role: 'AGENT',
    isAccountActive: false,
  });
  return result;
};

const viewUserDetails = async (payload: JwtPayload) => {
  const result = await User.findById(payload.id);
  return result;
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
  viewAllUsers,
  viewAllBlockedUsers,
  viewAllAgents,
  viewAllBlockedAgents,
  viewUserDetails,
};
