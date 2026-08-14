import { Router } from "express";
import { 
    getInscripciones, 
    create, 
    remove, 
    removeByRelation, 
    getByAlumno, 
    getByMateria 
} from "../controllers/inscripcion.controller.js";
import { authorizeRoles, checkStudentSelfOrStaff } from "../security/role.middleware.js";
import { generalLimiter, writeLimiter } from "../security/rateLimiter.js";
import { sanitizeBody, validateUUIDParam } from "../security/validation.middleware.js";

const router = Router();

router.use(sanitizeBody);

router.get("/", generalLimiter, authorizeRoles("admin", "teacher"), getInscripciones);
router.post("/", writeLimiter, authorizeRoles("admin", "teacher", "student"), create);
router.delete("/:id", writeLimiter, validateUUIDParam("id"), authorizeRoles("admin", "teacher", "student"), remove);
router.delete("/alumno/:alumno_id/materia/:materia_id", writeLimiter, validateUUIDParam("alumno_id", "materia_id"), authorizeRoles("admin", "teacher", "student"), checkStudentSelfOrStaff, removeByRelation);
router.get("/alumno/:alumno_id", generalLimiter, validateUUIDParam("alumno_id"), authorizeRoles("admin", "teacher", "student"), checkStudentSelfOrStaff, getByAlumno);
router.get("/materia/:materia_id", generalLimiter, validateUUIDParam("materia_id"), authorizeRoles("admin", "teacher"), getByMateria);

export default router;
