import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import paymentRouter from "./payment";
import learnRouter from "./learn";
import testRouter from "./test";
import adminRouter from "./admin";
import contactRouter from "./contact";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(paymentRouter);
router.use(learnRouter);
router.use(testRouter);
router.use(adminRouter);
router.use(contactRouter);

export default router;
