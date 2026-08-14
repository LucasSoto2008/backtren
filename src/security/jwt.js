import jwt from "jsonwebtoken";
import { config } from "../config.js";

/**
 * Genera un token JWT incluyendo en el payload el id y el rol del usuario.
 * @param {Object} payload - Objeto con id y role del usuario
 * @param {string} payload.id - ID del usuario
 * @param {string} payload.role - Rol del usuario (student, teacher, etc.)
 * @returns {string} Token JWT firmado
 */
export function createToken({ id, role }) {
    return jwt.sign(
        { id, role },
        config.jwtSecret,
        { expiresIn: config.jwtExpiresIn }
    );
}

/**
 * Verifica y decodifica un token JWT.
 * @param {string} token - Token JWT a verificar
 * @returns {Object} Payload decodificado
 */
export function verifyToken(token) {
    return jwt.verify(token, config.jwtSecret);
}
