import { Router } from "express";
import { login, register, forgotPassword, resetPassword } from "../controllers/auth.controller.js";
import { authLimiter } from "../security/rateLimiter.js";
import { sanitizeBody, validateLoginInput, validateRegisterInput } from "../security/validation.middleware.js";

const router = Router();

// Todas las rutas de autenticación usan el Rate Limiter estricto y sanitización de entrada
router.use(authLimiter);
router.use(sanitizeBody);

router.post("/login", validateLoginInput, login);
router.post("/register", validateRegisterInput, register);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
