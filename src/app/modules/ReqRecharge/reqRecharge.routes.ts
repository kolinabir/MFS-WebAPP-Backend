import { Router } from 'express';
import auth from '../../middlewares/auth';
import { ReqRechargeController } from './reqRecharge.controller';
import { USER_ROLE } from '../User/user.constant';

const router = Router();

router.get(
  '/',
  auth(USER_ROLE.ADMIN, USER_ROLE.AGENT, USER_ROLE.USER),
  ReqRechargeController.viewRechargeRequests,
);
router.post(
  '/',
  auth(USER_ROLE.AGENT),
  ReqRechargeController.reqRechargeToAdmin,
);

router.patch(
  '/:id/approve',
  auth(USER_ROLE.ADMIN),
  ReqRechargeController.approveRechargeRequest,
);

export const rechargeRoutes = router;
