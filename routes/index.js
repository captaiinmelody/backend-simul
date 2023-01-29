import express from "express";
import {getUsers, Login, Register, Logout} from "../controller/User.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controller/RefreshToken.js";
import { createData, getData } from "../controller/AllData.js";

const router = express.Router();



router.get('/users',verifyToken,getUsers);
router.get("/token", refreshToken);
router.get("/links", getData);

router.post('/users', Register);
router.post("/login", Login);
router.post("/links", createData);

router.delete("/logout", Logout);

export default router; 