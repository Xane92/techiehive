import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import paymentRouter from "./payment";
import learnRouter from "./learn";
import testRouter from "./test";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(paymentRouter);
router.use(learnRouter);
router.use(testRouter);

export default router;
