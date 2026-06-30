import { 
    getAllMaterias, 
    getMateriaById, 
    createMateria, 
    updateMateria, 
    deleteMateria 
} from "../services/materia.service.js";
import { getProfesorById } from "../services/profesor.service.js";

export async function getMaterias(req, res) {
    try {
        const materias = await getAllMaterias();
        return res.status(200).json(materias);
    } catch (error) {
        console.error("Error al obtener materias:", error);
        return res.status(500).json({ error: "Error interno del servidor." });
    }
}

export async function getMateria(req, res) {
    try {
        const { id } = req.params;
        const materia = await getMateriaById(id);
        if (!materia) {
            return res.status(404).json({ error: "Materia no encontrada." });
        }
        return res.status(200).json(materia);
    } catch (error) {
        console.error("Error al obtener materia:", error);
        return res.status(500).json({ error: "Error interno del servidor." });
    }
}

export async function create(req, res) {
    try {
        const { nombre, profesor_id } = req.body;

        if (!nombre || !profesor_id) {
            return res.status(400).json({ error: "Nombre y profesor_id son requeridos." });
        }

        // Verify professor exists
        const profesor = await getProfesorById(profesor_id);
        if (!profesor) {
            return res.status(400).json({ error: "El profesor especificado no existe." });
        }

        const newMateria = await createMateria({ nombre, profesor_id });
        return res.status(201).json({
            message: "Materia creada exitosamente.",
            materia: newMateria
        });
    } catch (error) {
        console.error("Error al crear materia:", error);
        return res.status(500).json({ error: "Error interno del servidor." });
    }
}

export async function update(req, res) {
    try {
        const { id } = req.params;
        const { nombre, profesor_id } = req.body;

        if (!nombre || !profesor_id) {
            return res.status(400).json({ error: "Nombre y profesor_id son requeridos." });
        }

        const existingMateria = await getMateriaById(id);
        if (!existingMateria) {
            return res.status(404).json({ error: "Materia no encontrada." });
        }

        // Verify professor exists
        const profesor = await getProfesorById(profesor_id);
        if (!profesor) {
            return res.status(400).json({ error: "El profesor especificado no existe." });
        }

        const updated = await updateMateria(id, { nombre, profesor_id });
        return res.status(200).json({
            message: "Materia actualizada exitosamente.",
            materia: updated
        });
    } catch (error) {
        console.error("Error al actualizar materia:", error);
        return res.status(500).json({ error: "Error interno del servidor." });
    }
}

export async function remove(req, res) {
    try {
        const { id } = req.params;
        const existingMateria = await getMateriaById(id);
        if (!existingMateria) {
            return res.status(404).json({ error: "Materia no encontrada o ya eliminada." });
        }

        const deleted = await deleteMateria(id);
        return res.status(200).json({
            message: "Materia eliminada exitosamente.",
            materia: deleted
        });
    } catch (error) {
        console.error("Error al eliminar materia:", error);
        return res.status(500).json({ error: "Error interno del servidor." });
    }
}
