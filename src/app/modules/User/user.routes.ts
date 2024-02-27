import { Router } from 'express';
import { UserController } from './user.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';

const router = Router();

router.get(
  '/balance',
  auth(USER_ROLE.USER, USER_ROLE.AGENT, USER_ROLE.ADMIN),
  UserController.getBalance,
); //done
router.get('/all-money', auth(USER_ROLE.ADMIN), UserController.getAllMoney); //done
router.get('/new-agents', auth(USER_ROLE.ADMIN), UserController.viewNewAgents); //done

router.get(
  '/transaction/:mobileNumber',
  auth(USER_ROLE.ADMIN),
  UserController.getAllTransactionsOfUserORAgent,
); //done

router.get('/users', auth(USER_ROLE.ADMIN), UserController.viewAllUsers); //done
router.get(
  '/blocked-users',
  auth(USER_ROLE.ADMIN),
  UserController.viewAllBlockedUsers,
); //done
router.get('/agents', auth(USER_ROLE.ADMIN), UserController.viewAllAgents); //done
router.get(
  '/blocked-agents',
  auth(USER_ROLE.ADMIN),
  UserController.viewAllBlockedAgents,
); //done

router.get(
  '/balance/:mobileNumber',
  auth(USER_ROLE.ADMIN),
  UserController.viewBalanceOfUserORAgent,
); //done

router.get(
  '/details',
  auth(USER_ROLE.USER, USER_ROLE.AGENT),
  UserController.viewUserDetails,
); //done

router.post('/', UserController.createUser); //done

// router.patch('/:id', UserController.approveAgent);
router.patch('/:id/block', auth(USER_ROLE.ADMIN), UserController.blockUser); //done
router.patch('/:id/unblock', auth(USER_ROLE.ADMIN), UserController.unblockUser); //done

export const userRoutes = router;
