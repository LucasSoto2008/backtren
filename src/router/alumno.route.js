import { Router } from "express";
import { getAlumnos, getAlumno, create, update, remove } from "../controllers/alumno.controller.js";
import { authorizeRoles, checkStudentSelfOrStaff } from "../security/role.middleware.js";
import { generalLimiter, writeLimiter } from "../security/rateLimiter.js";
import { sanitizeBody, validateUUIDParam } from "../security/validation.middleware.js";

const router = Router();

router.use(sanitizeBody);

router.get("/", generalLimiter, authorizeRoles("admin", "teacher"), getAlumnos);
router.get("/:id", generalLimiter, validateUUIDParam("id"), authorizeRoles("admin", "teacher", "student"), checkStudentSelfOrStaff, getAlumno);
router.post("/", writeLimiter, authorizeRoles("admin"), create);
router.put("/:id", writeLimiter, validateUUIDParam("id"), authorizeRoles("admin"), update);
router.delete("/:id", writeLimiter, validateUUIDParam("id"), authorizeRoles("admin"), remove);

export default router;
