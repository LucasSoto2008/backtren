import { getAllUsers, getUserById, updateUser, deleteUser, getUserByEmail } from "../services/user.service.js";

export async function getUsers(req, res) {
    try {
        const users = await getAllUsers();
        return res.status(200).json(users);
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        return res.status(500).json({ error: "Error interno del servidor." });
    }
}

export async function getUser(req, res) {
    try {
        const { id } = req.params;
        const user = await getUserById(id);
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado." });
        }
        return res.status(200).json(user);
    } catch (error) {
        console.error("Error al obtener usuario:", error);
        return res.status(500).json({ error: "Error interno del servidor." });
    }
}

export async function update(req, res) {
    try {
        const { id } = req.params;
        const { email, role, password } = req.body;

        if (!email || !role) {
            return res.status(400).json({ error: "Email y rol son requeridos para actualizar." });
        }

        if (role !== "student" && role !== "teacher") {
            return res.status(400).json({ error: "El rol debe ser 'student' o 'teacher'." });
        }

        const existingUser = await getUserById(id);
        if (!existingUser) {
            return res.status(404).json({ error: "Usuario no encontrado." });
        }

        // Check if new email is already taken by another user
        if (email !== existingUser.email) {
            const emailInUse = await getUserByEmail(email);
            if (emailInUse) {
                return res.status(409).json({ error: "El email ya está en uso por otro usuario." });
            }
        }

        const updatedUser = await updateUser(id, { email, role, password });
        return res.status(200).json({
            message: "Usuario actualizado exitosamente.",
            user: updatedUser
        });
    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        return res.status(500).json({ error: "Error interno del servidor." });
    }
}

export async function remove(req, res) {
    try {
        const { id } = req.params;
        const existingUser = await getUserById(id);
        if (!existingUser) {
            return res.status(404).json({ error: "Usuario no encontrado o ya eliminado." });
        }

        const deletedUser = await deleteUser(id);
        return res.status(200).json({
            message: "Usuario eliminado exitosamente.",
            user: deletedUser
        });
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        return res.status(500).json({ error: "Error interno del servidor." });
    }
}
