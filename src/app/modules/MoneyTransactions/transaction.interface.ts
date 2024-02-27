import { Types } from 'mongoose';

export interface TTransactionsSendMoney {
  transactionId?: string;
  sender?: Types.ObjectId;
  mobileNumber: number;
  receiver?: Types.ObjectId;
  amount: number;
  transactionType?: 'SEND' | 'RECEIVE';
  transactionDate?: Date;
  transactionCharge?: number;
}

export interface TTransactionsCashOut {
  transactionId?: string;
  user?: Types.ObjectId;
  pin?: string;
  agent?: Types.ObjectId;
  mobileNumber: number;
  amount: number;
  transactionType?: 'CASH_OUT';
  transactionDate?: Date;
  transactionCharge?: number;
}

export interface TTransactionsCashIn {
  user?: Types.ObjectId;
  agent?: Types.ObjectId;
  amount: number;
  pin?: string;
  mobileNumber: number;
  transactionType?: 'CASH_IN';
  transactionDate?: Date;
  transactionCharge?: number;
}
