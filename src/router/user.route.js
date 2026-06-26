import { Router } from "express";
import { getUsers, getUser, update, remove } from "../controllers/user.controller.js";
import { authenticateToken } from "../security/auth.middleware.js";

const router = Router();

// Protect user routes with token verification middleware
router.get("/", authenticateToken, getUsers);
router.get("/:id", authenticateToken, getUser);
router.put("/:id", authenticateToken, update);
router.delete("/:id", authenticateToken, remove);

export default router;
