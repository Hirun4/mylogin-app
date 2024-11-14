import { Router } from "express";

const router= Router();

/*import all controllers*/
import * as controller from '../controllers/appController.js';


/*Post methods*/
router.route('/register').post(controller.register);
// router.route('/registerMail').post();
router.route('/authenticate').post((req,res) => res.end());
router.route('/login').post(controller.login);



/*GET methods*/
router.route('/user/:username').get(controller.getUser);//user with username
router.route('/generateOTP').get(controller.generateOTP);
router.route('/verifyOTP').get(controller.verifyOTP);
router.route('/createResetSession').get();

/*PUT methods*/
router.route('/updateuser').put();
router.route('resetPassword').put();


export default router;