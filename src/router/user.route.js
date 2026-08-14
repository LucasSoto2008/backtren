import { Router } from "express";
import { getUsers, getUser, update, remove } from "../controllers/user.controller.js";
import { authorizeRoles } from "../security/role.middleware.js";
import { generalLimiter, writeLimiter } from "../security/rateLimiter.js";
import { sanitizeBody, validateUUIDParam } from "../security/validation.middleware.js";

const router = Router();

router.use(sanitizeBody);

// Solo administradores pueden gestionar usuarios del sistema
router.get("/", generalLimiter, authorizeRoles("admin"), getUsers);
router.get("/:id", generalLimiter, validateUUIDParam("id"), authorizeRoles("admin", "teacher", "student"), getUser);
router.put("/:id", writeLimiter, validateUUIDParam("id"), authorizeRoles("admin"), update);
router.delete("/:id", writeLimiter, validateUUIDParam("id"), authorizeRoles("admin"), remove);

export default router;
