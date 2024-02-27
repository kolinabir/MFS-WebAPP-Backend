import { model } from 'mongoose';
import {
  TTransactionsCashIn,
  TTransactionsCashOut,
  TTransactionsSendMoney,
} from './transaction.interface';
import { Schema } from 'mongoose';

const transactionSendMoneySchema = new Schema<TTransactionsSendMoney>({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  mobileNumber: { type: Number, required: true },
  amount: { type: Number, required: true },
  transactionType: { type: String, enum: ['SEND', 'RECEIVE'], required: true },
  transactionDate: { type: Date, default: Date.now },
  transactionCharge: { type: Number, default: 0 },
});

const transactionCashOutSchema = new Schema<TTransactionsCashOut>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  agent: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  pin: { type: String, required: true },
  amount: { type: Number, required: true },
  transactionType: { type: String, enum: ['CASH_OUT'], required: true },
  transactionDate: { type: Date, default: Date.now },
  transactionCharge: { type: Number, default: 0 },
});

const transactionCashInSchema = new Schema<TTransactionsCashIn>({
  userMobileNumber: { type: Number, required: true },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  agent: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: { type: Number, required: true },
  transactionType: { type: String, enum: ['CASH_IN'], required: true },
  transactionDate: { type: Date, default: Date.now },
});

export const TransactionSendMoney = model<TTransactionsSendMoney>(
  'TransactionSendMoney',
  transactionSendMoneySchema,
);

export const TransactionCashOut = model<TTransactionsCashOut>(
  'TransactionCashOut',
  transactionCashOutSchema,
);

export const TransactionCashIn = model<TTransactionsCashIn>(
  'TransactionCashIn',
  transactionCashInSchema,
);
