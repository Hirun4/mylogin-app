import { Router } from "express";
const router= Router();

/*import all controllers*/
import * as controller from '../controllers/appController.js';
import { registerMail } from "../controllers/mailer.js";
import Auth, { localVariables } from "../middleware/auth.js";



/*Post methods*/
router.route('/register').post(controller.register);
router.route('/registerMail').post(registerMail);
router.route('/authenticate').post(controller.verifyUser, (req,res) => res.end());
router.route('/login').post(controller.verifyUser,controller.login);



/*GET methods*/
router.route('/user/:username').get(controller.getUser);//user with username
router.route('/generateOTP').get(controller.verifyUser,localVariables, controller.generateOTP);
router.route('/verifyOTP').get(controller.verifyUser, controller.verifyOTP);
router.route('/createResetSession').get(controller.createResetSession);

/*PUT methods*/
router.route('/updateuser').put(Auth,controller.updateUser);
router.route('/resetPassword').put(controller.verifyUser,controller.resetPassword);


export default router;