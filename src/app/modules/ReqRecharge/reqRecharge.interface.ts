import { Types } from 'mongoose';

export interface TReqRecharge {
  amount: number;
  agentId?: Types.ObjectId;
  isApproved: boolean;
}
