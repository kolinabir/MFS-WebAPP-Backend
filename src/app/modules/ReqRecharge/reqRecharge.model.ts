import { Schema, model } from 'mongoose';
import { TReqRecharge } from './reqRecharge.interface';

const reqRechargeSchema = new Schema<TReqRecharge>({
  amount: { type: Number, required: true },
  agentId: { type: Schema.Types.ObjectId, ref: 'User' },
  isApproved: { type: Boolean, default: false },
});

export default model<TReqRecharge>('ReqRecharge', reqRechargeSchema);
