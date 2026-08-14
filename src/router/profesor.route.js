import { Router } from "express";
import { getProfesores, getProfesor, create, update, remove } from "../controllers/profesor.controller.js";
import { authorizeRoles } from "../security/role.middleware.js";
import { generalLimiter, writeLimiter } from "../security/rateLimiter.js";
import { sanitizeBody, validateUUIDParam } from "../security/validation.middleware.js";

const router = Router();

router.use(sanitizeBody);

router.get("/", generalLimiter, authorizeRoles("admin", "teacher", "student"), getProfesores);
router.get("/:id", generalLimiter, validateUUIDParam("id"), authorizeRoles("admin", "teacher", "student"), getProfesor);
router.post("/", writeLimiter, authorizeRoles("admin"), create);
router.put("/:id", writeLimiter, validateUUIDParam("id"), authorizeRoles("admin", "teacher"), update);
router.delete("/:id", writeLimiter, validateUUIDParam("id"), authorizeRoles("admin"), remove);

export default router;
