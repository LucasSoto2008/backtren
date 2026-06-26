import jwt from "jsonwebtoken";
import { config } from "../config.js";

export function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    // Token can be passed as "Bearer <token>"
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Acceso denegado. Token no proporcionado." });
    }

    try {
        const jwtSecret = config.jwtSecret || "supersecrettokenkey123";
        const verified = jwt.verify(token, jwtSecret);
        req.user = verified;
        next();
    } catch (error) {
        return res.status(403).json({ error: "Token inválido o expirado." });
    }
}
