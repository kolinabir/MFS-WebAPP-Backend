import { Router } from 'express';
import { AuthRoute } from '../Auth/auth.routes';
import { userRoutes } from '../modules/User/user.routes';
import { transactionRoutes } from '../modules/MoneyTransactions/transaction.routes';
import { rechargeRoutes } from '../modules/ReqRecharge/reqRecharge.routes';
const router = Router();

const modulesRoutes = [
  {
    path: '/auth',
    router: AuthRoute,
  },
  {
    path: '/admin-control-panel',
    router: userRoutes,
  },
  {
    path: '/transaction',
    router: transactionRoutes,
  },
  {
    path: '/recharge',
    router: rechargeRoutes,
  },
];
modulesRoutes.forEach((route) => router.use(route.path, route.router));

export default router;
