import { Router } from 'express';
import { AuthController } from './auth.controller';
import { UserController } from '../modules/User/user.controller';
import { USER_ROLE } from '../modules/User/user.constant';
import validateRequest from '../middlewares/validateRequest';
import { AuthValidation } from './auth.validations';
import auth from '../middlewares/auth';
import { UserValidationSchema } from '../modules/User/user.validation';

const router = Router();

router.post(
  '/login',
  validateRequest(AuthValidation.loginValidationSchema),
  AuthController.loginUser,
);
// router.post(
//   '/change-password',
//   auth(
//     USER_ROLE.teacher,
//     USER_ROLE.admin,
//     USER_ROLE.official,
//     USER_ROLE.student,
//   ),
//   AuthController.changePassword,
// );

router.post(
  '/register',
  validateRequest(UserValidationSchema.createUserValidationSchema),
  UserController.createUser,
);

router.get(
  '/check-auth',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER, USER_ROLE.AGENT),
  AuthController.checkAuthentication,
);

router.get(
  '/logout',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER, USER_ROLE.AGENT),
  AuthController.logout,
);

router.patch('/:id', auth(USER_ROLE.ADMIN), UserController.approveAgent);

export const AuthRoute = router;
