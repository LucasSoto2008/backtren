import { 
    createInscripcion, 
    deleteInscripcion, 
    deleteInscripcionByRelation, 
    getAllInscripciones, 
    getInscripcionesByAlumno, 
    getInscripcionesByMateria 
} from "../services/inscripcion.service.js";
import { getAlumnoById } from "../services/alumno.service.js";
import { getMateriaById } from "../services/materia.service.js";

export async function getInscripciones(req, res) {
    try {
        const inscripciones = await getAllInscripciones();
        return res.status(200).json(inscripciones);
    } catch (error) {
        console.error("Error al obtener inscripciones:", error);
        return res.status(500).json({ error: "Error interno del servidor." });
    }
}

export async function create(req, res) {
    try {
        const { alumno_id, materia_id } = req.body;

        if (!alumno_id || !materia_id) {
            return res.status(400).json({ error: "alumno_id y materia_id son requeridos." });
        }

        // Verify alumno exists
        const alumno = await getAlumnoById(alumno_id);
        if (!alumno) {
            return res.status(400).json({ error: "El alumno especificado no existe." });
        }

        // Verify materia exists
        const materia = await getMateriaById(materia_id);
        if (!materia) {
            return res.status(400).json({ error: "La materia especificada no existe." });
        }

        const newInscripcion = await createInscripcion({ alumno_id, materia_id });
        return res.status(201).json({
            message: "Inscripción creada exitosamente.",
            inscripcion: newInscripcion
        });
    } catch (error) {
        console.error("Error al crear inscripción:", error);
        if (error.code === "23505") { // Unique violation in PG
            return res.status(409).json({ error: "El alumno ya está inscrito en esta materia." });
        }
        return res.status(500).json({ error: "Error interno del servidor." });
    }
}

export async function remove(req, res) {
    try {
        const { id } = req.params;
        const deleted = await deleteInscripcion(id);
        if (!deleted) {
            return res.status(404).json({ error: "Inscripción no encontrada." });
        }
        return res.status(200).json({
            message: "Inscripción eliminada exitosamente.",
            inscripcion: deleted
        });
    } catch (error) {
        console.error("Error al eliminar inscripción:", error);
        return res.status(500).json({ error: "Error interno del servidor." });
    }
}

export async function removeByRelation(req, res) {
    try {
        const { alumno_id, materia_id } = req.params;
        const deleted = await deleteInscripcionByRelation(alumno_id, materia_id);
        if (!deleted) {
            return res.status(404).json({ error: "Inscripción no encontrada para esa relación alumno-materia." });
        }
        return res.status(200).json({
            message: "Inscripción eliminada exitosamente.",
            inscripcion: deleted
        });
    } catch (error) {
        console.error("Error al eliminar inscripción por relación:", error);
        return res.status(500).json({ error: "Error interno del servidor." });
    }
}

export async function getByAlumno(req, res) {
    try {
        const { alumno_id } = req.params;
        
        // Verify alumno exists
        const alumno = await getAlumnoById(alumno_id);
        if (!alumno) {
            return res.status(404).json({ error: "Alumno no encontrado." });
        }

        const inscripciones = await getInscripcionesByAlumno(alumno_id);
        return res.status(200).json(inscripciones);
    } catch (error) {
        console.error("Error al obtener inscripciones de alumno:", error);
        return res.status(500).json({ error: "Error interno del servidor." });
    }
}

export async function getByMateria(req, res) {
    try {
        const { materia_id } = req.params;

        // Verify materia exists
        const materia = await getMateriaById(materia_id);
        if (!materia) {
            return res.status(404).json({ error: "Materia no encontrada." });
        }

        const inscripciones = await getInscripcionesByMateria(materia_id);
        return res.status(200).json(inscripciones);
    } catch (error) {
        console.error("Error al obtener inscripciones de materia:", error);
        return res.status(500).json({ error: "Error interno del servidor." });
    }
}
