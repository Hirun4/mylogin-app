import { Router } from "express";

const router= Router();

/*import all controllers*/
import * as controller from '../controllers/appController.js';


/*Post methods*/
router.route('/register').post(controller.register);
// router.route('/registerMail').post();
router.route('/authenticate').post();
router.route('/login').post();



/*GET methods*/
router.route('/user/:username').get();//user with username
router.route('/generateOTP').get();
router.route('/verifyOTP').get();
router.route('/createResetSession').get();

/*PUT methods*/
router.route('/updateuser').put();
router.route('resetPassword').put();


export default router;