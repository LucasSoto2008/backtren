import { loginUser, registerUser, forgotPasswordUser, resetPasswordUser } from "../services/auth.service.js";

export async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        const data = await loginUser({ email, password });
        return res.status(200).json({
            message: "Inicio de sesión exitoso.",
            ...data
        });
    } catch (error) {
        next(error);
    }
}

export async function register(req, res, next) {
    try {
        const { email, password, role } = req.body;
        const data = await registerUser({ email, password, role });
        return res.status(201).json({
            message: "Usuario registrado exitosamente.",
            ...data
        });
    } catch (error) {
        next(error);
    }
}

export async function forgotPassword(req, res, next) {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: "El email es requerido." });
        }
        const data = await forgotPasswordUser(email);
        return res.status(200).json(data);
    } catch (error) {
        next(error);
    }
}

export async function resetPassword(req, res, next) {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) {
            return res.status(400).json({ error: "El token y la nueva contraseña son requeridos." });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ error: "La nueva contraseña debe tener al menos 6 caracteres." });
        }
        const data = await resetPasswordUser({ token, newPassword });
        return res.status(200).json(data);
    } catch (error) {
        next(error);
    }
}
