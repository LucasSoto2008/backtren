import { Router } from "express";
import { getMaterias, getMateria, create, update, remove } from "../controllers/materia.controller.js";

const router = Router();

router.get("/", getMaterias);
router.get("/:id", getMateria);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", remove);

export default router;
