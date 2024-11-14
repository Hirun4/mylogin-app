import { Router } from "express";

const router= Router();

/*Post methods*/
router.route('/register').post((req,res) => res.json('register route'));
router.route('/registerMail').post();
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