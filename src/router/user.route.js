import { Router } from "express";
import { getUsers, getUser, update, remove } from "../controllers/user.controller.js";

const router = Router();

router.get("/", getUsers);
router.get("/:id", getUser);
router.put("/:id", update);
router.delete("/:id", remove);

export default router;
