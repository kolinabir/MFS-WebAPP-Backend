import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendRespone';
import { UserService } from './user.service';

const createUser = catchAsync(async (req, res) => {
  const result = await UserService.createUserIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User created successfully',
    data: result,
  });
});

const approveAgent = catchAsync(async (req, res) => {
  const result = await UserService.approveAgent(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Agent approved successfully',
    data: result,
  });
});

const viewNewAgents = catchAsync(async (req, res) => {
  const result = await UserService.viewNewAgents();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'New agents',
    data: result,
  });
});

const blockUser = catchAsync(async (req, res) => {
  const result = await UserService.blockUser(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User blocked successfully',
    data: result,
  });
});

const unblockUser = catchAsync(async (req, res) => {
  const result = await UserService.unblockUser(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User unblocked successfully',
    data: result,
  });
});

const getBalance = catchAsync(async (req, res) => {
  const result = await UserService.getBalance(req.user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Balance',
    data: result,
  });
});

const getAllMoney = catchAsync(async (req, res) => {
  const result = await UserService.getAllMoney();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Total money',
    data: result,
  });
});

const viewBalanceOfUserORAgent = catchAsync(async (req, res) => {
  const result = await UserService.viewBalanceOfUserORAgent(
    Number(req.params.mobileNumber),
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Balance',
    data: result,
  });
});

const getAllTransactions = catchAsync(async (req, res) => {
  const result = await UserService.getAllTransactions(req.user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All transactions',
    data: result,
  });
});

const getAllTransactionsOfUserORAgent = catchAsync(async (req, res) => {
  const result = await UserService.getAllTransactionsOfUserORAgent(
    Number(req.params.mobileNumber),
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All transactions',
    data: result,
  });
});

export const UserController = {
  createUser,
  approveAgent,
  viewNewAgents,
  blockUser,
  unblockUser,
  getBalance,
  getAllMoney,
  viewBalanceOfUserORAgent,
  getAllTransactions,
  getAllTransactionsOfUserORAgent,
};
