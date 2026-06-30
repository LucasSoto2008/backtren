import { Router } from "express";
import { 
    getInscripciones, 
    create, 
    remove, 
    removeByRelation, 
    getByAlumno, 
    getByMateria 
} from "../controllers/inscripcion.controller.js";

const router = Router();

router.get("/", getInscripciones);
router.post("/", create);
router.delete("/:id", remove);
router.delete("/alumno/:alumno_id/materia/:materia_id", removeByRelation);
router.get("/alumno/:alumno_id", getByAlumno);
router.get("/materia/:materia_id", getByMateria);

export default router;
