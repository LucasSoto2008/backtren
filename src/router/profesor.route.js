import { Router } from "express";
import { getProfesores, getProfesor, create, update, remove } from "../controllers/profesor.controller.js";

const router = Router();

router.get("/", getProfesores);
router.get("/:id", getProfesor);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", remove);

export default router;
