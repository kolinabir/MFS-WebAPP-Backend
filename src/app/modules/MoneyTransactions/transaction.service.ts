import { JwtPayload } from 'jsonwebtoken';
import {
  TTransactionsCashIn,
  TTransactionsCashOut,
  TTransactionsSendMoney,
} from './transaction.interface';
import { User } from '../User/user.model';
import {
  TransactionCashIn,
  TransactionCashOut,
  TransactionSendMoney,
} from './transaction.model';
import httpStatus from 'http-status';
import AppError from '../../middlewares/Errors/AppError';
import mongoose from 'mongoose';

const sendMoneyToUser = async (
  payload: TTransactionsSendMoney,
  user: JwtPayload,
) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    if (payload.amount < 50) {
      throw new Error('Minimum amount to send is 50');
    }

    const sender = await User.findOne({
      mobileNumber: user.mobileNumber,
    }).session(session);
    const receiver = await User.findOne({
      mobileNumber: payload.mobileNumber,
    }).session(session);
    if (!sender || !receiver) {
      throw new Error('User not found');
    }
    if (sender.balance < payload.amount) {
      throw new Error('Insufficient balance');
    }
    if (payload.amount >= 100) {
      payload.transactionCharge = 5;
    } else {
      payload.transactionCharge = 0;
    }

    const updatedSender = await User.findByIdAndUpdate(
      sender._id,
      { $inc: { balance: -payload.amount - (payload.transactionCharge || 0) } },
      { new: true, session },
    );
    const updatedReceiver = await User.findByIdAndUpdate(
      receiver._id,
      { $inc: { balance: payload.amount } },
      { new: true, session },
    );
    const updateAdmin = await User.findOneAndUpdate(
      { role: 'ADMIN' },
      { $inc: { balance: payload.transactionCharge } },
      { new: true, session },
    );

    if (!updatedSender || !updatedReceiver || !updateAdmin) {
      throw new Error('SendMoney failed');
    }
    const result = await TransactionSendMoney.create({
      ...payload,
      sender: sender._id,
      receiver: receiver._id,
      transactionType: 'SEND',
      transactionCharge: payload.transactionCharge || 0,
    });

    await session.commitTransaction();
    session.endSession();

    return result;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const cashOut = async (payload: TTransactionsCashOut, user: JwtPayload) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const userExist = await User.findOne({
      mobileNumber: user.mobileNumber,
    })
      .select('+pin')
      .session(session);
    const agentExist = await User.findOne({
      mobileNumber: payload.mobileNumber,
      role: 'AGENT',
    }).session(session);

    // console.log(agentExist._id, 'agentExist');
    if (!userExist || !agentExist) {
      throw new Error('User Or Agent not found');
    }
    if (userExist.balance < payload.amount) {
      throw new Error('Insufficient balance');
    }
    //   check if pin match
    if (!(await User.isPinMatch(String(payload?.pin), userExist?.pin))) {
      throw new AppError(httpStatus.FORBIDDEN, 'PIN is not correct');
    }
    //1.5% transaction charge
    const transactionCharge = (1.5 / 100) * payload.amount;
    const updatedUser = await User.findByIdAndUpdate(
      userExist._id,
      { $inc: { balance: -payload.amount - transactionCharge } },
      { new: true, session },
    );
    //   agent income 1% of the transaction
    const agentIncome = (1 / 100) * payload.amount;
    const updatedAgent = await User.findByIdAndUpdate(
      agentExist._id,
      { $inc: { balance: agentIncome } },
      { new: true, session },
    );
    //admin income 0.5% of the transaction
    const adminIncome = (0.5 / 100) * payload.amount;
    const updateAdmin = await User.findOneAndUpdate(
      { role: 'ADMIN' },
      { $inc: { balance: adminIncome } },
      { new: true, session },
    );
    if (!updatedUser || !updatedAgent || !updateAdmin) {
      throw new Error('CashOut failed');
    }
    const result = await TransactionCashOut.create({
      ...payload,
      user: userExist._id,
      agent: agentExist._id,
      transactionType: 'CASH_OUT',
      transactionCharge,
    });

    await session.commitTransaction();
    session.endSession();

    return result;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const cashIn = async (payload: TTransactionsCashIn, agent: JwtPayload) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const userExist = await User.findOne({
      mobileNumber: payload.userMobileNumber,
    }).session(session);
    const agentExist = await User.findOne({
      mobileNumber: agent.mobileNumber,
    })
      .select('+pin')
      .session(session);
    if (!userExist || !agentExist) {
      throw new Error('User Or Agent not found');
    }
    if (!(await User.isPinMatch(String(payload?.pin), agentExist?.pin))) {
      throw new AppError(httpStatus.FORBIDDEN, 'PIN is not correct');
    }
    //check if agent balance is enough
    if (agentExist.balance < payload.amount) {
      throw new Error('Agent has insufficient balance');
    }

    const updatedUser = await User.findByIdAndUpdate(
      userExist._id,
      { $inc: { balance: payload.amount } },
      { new: true, session },
    );
    const updatedAgent = await User.findByIdAndUpdate(
      agentExist._id,
      { $inc: { balance: -payload.amount } },
      { new: true, session },
    );
    if (!updatedUser || !updatedAgent) {
      throw new Error('CashIn failed');
    }

    const result = await TransactionCashIn.create({
      ...payload,
      agent: agentExist._id,
      user: userExist._id,
      transactionType: 'CASH_IN',
    });
    await session.commitTransaction();
    session.endSession();

    return result;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const TransactionServices = {
  sendMoneyToUser,
  cashOut,
  cashIn,
};
