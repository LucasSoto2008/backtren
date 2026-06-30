import { 
    getAllProfesores, 
    getProfesorById, 
    getProfesorByEmail, 
    createProfesor, 
    updateProfesor, 
    deleteProfesor 
} from "../services/profesor.service.js";

export async function getProfesores(req, res) {
    try {
        const profesores = await getAllProfesores();
        return res.status(200).json(profesores);
    } catch (error) {
        console.error("Error al obtener profesores:", error);
        return res.status(500).json({ error: "Error interno del servidor." });
    }
}

export async function getProfesor(req, res) {
    try {
        const { id } = req.params;
        const profesor = await getProfesorById(id);
        if (!profesor) {
            return res.status(404).json({ error: "Profesor no encontrado." });
        }
        return res.status(200).json(profesor);
    } catch (error) {
        console.error("Error al obtener profesor:", error);
        return res.status(500).json({ error: "Error interno del servidor." });
    }
}

export async function create(req, res) {
    try {
        const { nombre, email, especialidad } = req.body;

        if (!nombre || !email) {
            return res.status(400).json({ error: "Nombre y email son requeridos." });
        }

        // Check if email already registered
        const existingProfesor = await getProfesorByEmail(email);
        if (existingProfesor) {
            return res.status(409).json({ error: "El email ya está registrado." });
        }

        const newProfesor = await createProfesor({ nombre, email, especialidad });
        return res.status(201).json({
            message: "Profesor creado exitosamente.",
            profesor: newProfesor
        });
    } catch (error) {
        console.error("Error al crear profesor:", error);
        return res.status(500).json({ error: "Error interno del servidor." });
    }
}

export async function update(req, res) {
    try {
        const { id } = req.params;
        const { nombre, email, especialidad } = req.body;

        if (!nombre || !email) {
            return res.status(400).json({ error: "Nombre y email son requeridos." });
        }

        const existingProfesor = await getProfesorById(id);
        if (!existingProfesor) {
            return res.status(404).json({ error: "Profesor no encontrado." });
        }

        // Check if email is in use by another professor
        if (email !== existingProfesor.email) {
            const emailInUse = await getProfesorByEmail(email);
            if (emailInUse) {
                return res.status(409).json({ error: "El email ya está en uso por otro profesor." });
            }
        }

        const updated = await updateProfesor(id, { nombre, email, especialidad });
        return res.status(200).json({
            message: "Profesor actualizado exitosamente.",
            profesor: updated
        });
    } catch (error) {
        console.error("Error al actualizar profesor:", error);
        return res.status(500).json({ error: "Error interno del servidor." });
    }
}

export async function remove(req, res) {
    try {
        const { id } = req.params;
        const existingProfesor = await getProfesorById(id);
        if (!existingProfesor) {
            return res.status(404).json({ error: "Profesor no encontrado o ya eliminado." });
        }

        const deleted = await deleteProfesor(id);
        return res.status(200).json({
            message: "Profesor eliminado exitosamente.",
            profesor: deleted
        });
    } catch (error) {
        console.error("Error al eliminar profesor:", error);
        return res.status(500).json({ error: "Error interno del servidor." });
    }
}
