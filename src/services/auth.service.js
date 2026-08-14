import bcrypt from "bcrypt";
import { getUserByEmail, createUser, updateUser } from "./user.service.js";
import { createToken, verifyToken } from "../security/jwt.js";

/**
 * Autentica un usuario verificando email y contraseña, y genera un token JWT con su id y rol.
 * @param {Object} credentials - Credenciales del usuario
 * @param {string} credentials.email - Email del usuario
 * @param {string} credentials.password - Contraseña plana
 * @returns {Promise<{token: string, user: Object}>} Token y datos del usuario
 */
export async function loginUser({ email, password }) {
    const user = await getUserByEmail(email);
    if (!user) {
        const error = new Error("Credenciales inválidas.");
        error.statusCode = 401;
        throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        const error = new Error("Credenciales inválidas.");
        error.statusCode = 401;
        throw error;
    }

    // Generar el token con id y role en el payload
    const token = createToken({ id: user.id, role: user.role });

    return {
        token,
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
            created_at: user.created_at
        }
    };
}

/**
 * Registra un nuevo usuario y genera su token JWT.
 * @param {Object} userData - Datos para crear usuario
 * @param {string} userData.email - Email
 * @param {string} userData.password - Contraseña
 * @param {string} userData.role - Rol (admin, student, teacher)
 * @returns {Promise<{token: string, user: Object}>} Token y datos del usuario creado
 */
export async function registerUser({ email, password, role }) {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
        const error = new Error("El email ya está registrado.");
        error.statusCode = 409;
        throw error;
    }

    const newUser = await createUser({ email, password, role });
    const token = createToken({ id: newUser.id, role: newUser.role });

    return {
        token,
        user: {
            id: newUser.id,
            email: newUser.email,
            role: newUser.role,
            created_at: newUser.created_at
        }
    };
}

/**
 * Solicita la recuperación de contraseña generando un token temporal.
 * @param {string} email Email del usuario
 */
export async function forgotPasswordUser(email) {
    const user = await getUserByEmail(email);
    if (!user) {
        // Por seguridad, no revelar si el email existe o no
        return { message: "Si el correo está registrado, se enviarán instrucciones de recuperación." };
    }

    const resetToken = createToken({ id: user.id, type: "password_reset" });
    return {
        message: "Instrucciones de recuperación generadas exitosamente.",
        resetToken // En producción se enviaría por email
    };
}

/**
 * Restablece la contraseña de un usuario mediante token de recuperación.
 * @param {string} token Token de recuperación
 * @param {string} newPassword Nueva contraseña
 */
export async function resetPasswordUser({ token, newPassword }) {
    try {
        const decoded = verifyToken(token);
        if (decoded.type !== "password_reset") {
            const error = new Error("Token de restablecimiento inválido.");
            error.statusCode = 400;
            throw error;
        }

        await updateUser(decoded.id, { password: newPassword });
        return { message: "Contraseña actualizada exitosamente." };
    } catch (err) {
        if (err.statusCode) throw err;
        const error = new Error("Token expirado o inválido.");
        error.statusCode = 400;
        throw error;
    }
}
