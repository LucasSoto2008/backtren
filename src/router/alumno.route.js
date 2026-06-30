import { Router } from "express";
import { getAlumnos, getAlumno, create, update, remove } from "../controllers/alumno.controller.js";

const router = Router();

router.get("/", getAlumnos);
router.get("/:id", getAlumno);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", remove);

export default router;
