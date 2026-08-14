import { verifyToken } from "./jwt.js";

/**
 * Middleware para verificar la validez del token JWT en las peticiones.
 * Extrae el token de la cabecera Authorization ('Bearer <token>') o x-access-token.
 */
export function verifyAuthToken(req, res, next) {
    const authHeader = req.headers["authorization"] || req.headers["x-access-token"];

    if (!authHeader) {
        return res.status(401).json({
            error: "Acceso denegado. No se proporcionó un token de autenticación."
        });
    }

    let token = authHeader;
    if (authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7).trim();
    }

    try {
        const decoded = verifyToken(token);
        // Adjuntamos los datos del payload (id, role, iat, exp) al objeto req.user
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                error: "El token ha expirado. Por favor, inicia sesión nuevamente."
            });
        }
        return res.status(401).json({
            error: "Token inválido o alterado."
        });
    }
}
