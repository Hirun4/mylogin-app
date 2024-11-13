import { Router } from "express";

const router= Router();

/*Post methods*/
router.route('/register').post((req,res) => res.json('register route'));
router.route('/registerMail').post();


/*GET methods*/

/*PUT methods*/


export default router;