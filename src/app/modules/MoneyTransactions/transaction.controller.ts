import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendRespone';
import { TransactionServices } from './transaction.service';

const sendMoney = catchAsync(async (req, res) => {
  const result = await TransactionServices.sendMoneyToUser(req.body, req.user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Money sent successfully',
    data: result,
  });
});

const cashOut = catchAsync(async (req, res) => {
  const result = await TransactionServices.cashOut(req.body, req.user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cash out successfully',
    data: result,
  });
});

const cashIn = catchAsync(async (req, res) => {
  const result = await TransactionServices.cashIn(req.body, req.user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cash in successfully',
    data: result,
  });
});

export const TransactionController = {
  sendMoney,
  cashOut,
  cashIn,
};
