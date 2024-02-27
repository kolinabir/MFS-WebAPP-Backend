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
  amount: { type: Number, required: true },
  transactionType: {
    type: String,
    enum: ['CASH_OUT'],
    required: true,
    default: 'CASH_OUT',
  },
  transactionDate: { type: Date, default: Date.now },
  transactionCharge: { type: Number, default: 0 },
});
export const TransactionCashInSchema = new Schema<TTransactionsCashIn>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  agent: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  amount: { type: Number, required: true },
  transactionType: {
    type: String,
    enum: ['CASH_IN'],
    required: true,
    default: 'CASH_IN',
  },
  transactionDate: { type: Date, default: Date.now },
  transactionCharge: { type: Number, default: 0 },
});

export const TransactionCashIn = model<TTransactionsCashIn>(
  'TransactionCashIn',
  TransactionCashInSchema,
);

export const TransactionSendMoney = model<TTransactionsSendMoney>(
  'TransactionSendMoney',
  transactionSendMoneySchema,
);

export const TransactionCashOut = model<TTransactionsCashOut>(
  'TransactionCashOut',
  transactionCashOutSchema,
);
