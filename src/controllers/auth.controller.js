import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { createUser, getUserByEmail } from "../services/user.service.js";
import { config } from "../config.js";

export async function register(req, res) {
    try {
        const { email, password, role } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email y contraseña son obligatorios." });
        }

        const normalizedRole = role || "student";
        if (normalizedRole !== "student" && normalizedRole !== "teacher") {
            return res.status(400).json({ error: "El rol debe ser 'student' o 'teacher'." });
        }

        // Check if user already exists
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ error: "El email ya está registrado." });
        }

        const newUser = await createUser({ email, password, role: normalizedRole });

        return res.status(201).json({
            message: "Usuario creado exitosamente.",
            user: newUser
        });
    } catch (error) {
        console.error("Error en registro:", error);
        return res.status(500).json({ error: "Error interno del servidor." });
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email y contraseña son obligatorios." });
        }

        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ error: "Credenciales inválidas." });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ error: "Credenciales inválidas." });
        }

        // Generate JWT token
        const jwtSecret = config.jwtSecret || "supersecrettokenkey123";
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            jwtSecret,
            { expiresIn: "24h" }
        );

        return res.status(200).json({
            message: "Inicio de sesión exitoso.",
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                created_at: user.created_at
            },
            token
        });
    } catch (error) {
        console.error("Error en inicio de sesión:", error);
        return res.status(500).json({ error: "Error interno del servidor." });
    }
}
