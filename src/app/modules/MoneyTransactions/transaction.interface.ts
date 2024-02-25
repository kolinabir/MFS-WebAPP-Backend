import { Types } from 'mongoose';

export interface TTransactionsSendMoney {
  transactionId?: string;
  sender?: Types.ObjectId;
  receiver: Types.ObjectId;
  amount: number;
  transactionType?: 'SEND' | 'RECEIVE';
  transactionDate?: Date;
  transactionCharge?: number;
}

export interface TTransactionsCashOut {
  transactionId?: string;
  user?: Types.ObjectId;
  pin: string;
  agent: Types.ObjectId;
  amount: number;
  transactionType?: 'CASH_OUT';
  transactionDate?: Date;
  transactionCharge?: number;
}

export interface TTransactionsCashIn {
  transactionId?: string;
  userMobileNumber: number;
  user?: Types.ObjectId;
  amount: number;
  agent?: Types.ObjectId;
  pin: string;
  transactionType?: 'CASH_IN';
  transactionDate?: Date;
}
