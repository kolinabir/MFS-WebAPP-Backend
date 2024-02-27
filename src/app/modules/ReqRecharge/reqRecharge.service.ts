import mongoose from 'mongoose';
import { User } from '../User/user.model';
import { TReqRecharge } from './reqRecharge.interface';
import reqRechargeModel from './reqRecharge.model';
import { JwtPayload } from 'jsonwebtoken';
import AppError from '../../middlewares/Errors/AppError';
import httpStatus from 'http-status';

const reqRechargeToAdmin = async (payload: TReqRecharge, user: JwtPayload) => {
  //check if the user is an agent
  if (Number(payload.amount) >= 20000) {
    const agent = await User.findOne({
      mobileNumber: user.mobileNumber,
      role: 'AGENT',
    });
    const result = await reqRechargeModel.create({
      ...payload,
      agentId: agent?._id,
    });
    return result;
  } else {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Minimum amount to recharge is 20000',
    );
  }
};

const viewRechargeRequests = async () => {
  const result = await reqRechargeModel
    .find({
      isApproved: false,
    })
    .populate('agentId', 'name email');
  return result;
};

const approveRechargeRequest = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //check if the recharge request exists or not
    const rechargeRequest = await reqRechargeModel
      .findOne({
        agentId: id,
        isApproved: false,
      })
      .session(session);
    if (!rechargeRequest) {
      throw new Error('Recharge request not found');
    }

    const result = await reqRechargeModel.findOneAndUpdate(
      { agentId: id, isApproved: false },
      { isApproved: true },
      { new: true, session },
    );

    if (result) {
      const updateAgentBalance = await User.findOneAndUpdate(
        result.agentId,
        { $inc: { balance: result.amount } },
        { new: true, session },
      );

      const updateAdminBalance = await User.findOneAndUpdate(
        { role: 'ADMIN' },
        { $inc: { balance: -result.amount } },
        { new: true, session },
      );

      if (!updateAgentBalance || !updateAdminBalance) {
        throw new Error('Recharge failed');
      }
    }

    await session.commitTransaction();
    session.endSession();

    return result;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const ReqRechargeService = {
  reqRechargeToAdmin,
  viewRechargeRequests,
  approveRechargeRequest,
};
