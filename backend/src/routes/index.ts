import { Router } from "express";
import authRouter from "./auth.routes.js";
import userRouter from "./user.routes.js";
import plansRouter from "./plans/index.js";
import flightRouter from "./flight/index.js";
import flightSearchRouter from "./flight-search/index.js";
import flightBookingRouter from "./flight-booking/index.js";
import ecpayRouter from "./ecpay/ecpay-test-only.js";
import travelCommunityRouter from "./travel-community/index.js";//11/19rosa新增

const router = Router();

// 統一掛在 /api 底下
router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/plans", plansRouter);
router.use("/flight", flightRouter);
router.use("/flight-search", flightSearchRouter);
router.use("/flight-booking", flightBookingRouter);
router.use("/ecpay-test-only", ecpayRouter);
router.use("/travel-community", travelCommunityRouter);

export default router; 
