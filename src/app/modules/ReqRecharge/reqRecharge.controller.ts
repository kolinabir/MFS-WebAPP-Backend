import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendRespone';
import { ReqRechargeService } from './reqRecharge.service';

const reqRechargeToAdmin = catchAsync(async (req, res) => {
  const result = await ReqRechargeService.reqRechargeToAdmin(
    req.body,
    req.user,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Recharge request sent to admin successfully',
    data: result,
  });
});

const viewRechargeRequests = catchAsync(async (req, res) => {
  const result = await ReqRechargeService.viewRechargeRequests();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Recharge requests',
    data: result,
  });
});

const approveRechargeRequest = catchAsync(async (req, res) => {
  const result = await ReqRechargeService.approveRechargeRequest(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Recharge request approved successfully',
    data: result,
  });
});

export const ReqRechargeController = {
  reqRechargeToAdmin,
  viewRechargeRequests,
  approveRechargeRequest,
};
