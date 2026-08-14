import { getAllUsers, getUserById, updateUser, deleteUser, getUserByEmail } from "../services/user.service.js";

export async function getUsers(req, res, next) {
    try {
        const users = await getAllUsers();
        return res.status(200).json(users);
    } catch (error) {
        next(error);
    }
}

export async function getUser(req, res, next) {
    try {
        const { id } = req.params;
        const user = await getUserById(id);
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado." });
        }
        return res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}

export async function update(req, res, next) {
    try {
        const { id } = req.params;
        const { email, role, password } = req.body;

        if (!email || !role) {
            return res.status(400).json({ error: "Email y rol son requeridos para actualizar." });
        }

        const validRoles = ["admin", "teacher", "student"];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ error: "El rol debe ser 'admin', 'teacher' o 'student'." });
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
        next(error);
    }
}

export async function remove(req, res, next) {
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
        next(error);
    }
}
