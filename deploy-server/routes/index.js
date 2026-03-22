const { Router } = require("express");
const healthRouter = require("./health");
const authRouter = require("./auth");
const paymentRouter = require("./payment");
const learnRouter = require("./learn");
const testRouter = require("./test");
const adminRouter = require("./admin");
const contactRouter = require("./contact");

const router = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(paymentRouter);
router.use(learnRouter);
router.use(testRouter);
router.use(adminRouter);
router.use(contactRouter);

module.exports = router;
