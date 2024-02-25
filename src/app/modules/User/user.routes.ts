import { Router } from 'express';
import { UserController } from './user.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';

const router = Router();

router.get(
  '/balance',
  auth(USER_ROLE.USER, USER_ROLE.AGENT, USER_ROLE.ADMIN),
  UserController.getBalance,
);
router.get('/all-money', auth(USER_ROLE.ADMIN), UserController.getAllMoney);
router.get('/new-agents', auth(USER_ROLE.ADMIN), UserController.viewNewAgents);

router.get(
  '/transaction/:mobileNumber',
  auth(USER_ROLE.ADMIN),
  UserController.getAllTransactionsOfUserORAgent,
);

router.get(
  '/balance/:mobileNumber',
  auth(USER_ROLE.ADMIN),
  UserController.viewBalanceOfUserORAgent,
);

router.post('/', UserController.createUser);

// router.patch('/:id', UserController.approveAgent);
router.patch('/:id/block', auth(USER_ROLE.ADMIN), UserController.blockUser);
router.patch('/:id/unblock', auth(USER_ROLE.ADMIN), UserController.unblockUser);

export const userRoutes = router;
