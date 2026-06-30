import { 
    getAllAlumnos, 
    getAlumnoById, 
    getAlumnoByEmail, 
    createAlumno, 
    updateAlumno, 
    deleteAlumno 
} from "../services/alumno.service.js";

export async function getAlumnos(req, res) {
    try {
        const alumnos = await getAllAlumnos();
        return res.status(200).json(alumnos);
    } catch (error) {
        console.error("Error al obtener alumnos:", error);
        return res.status(500).json({ error: "Error interno del servidor." });
    }
}

export async function getAlumno(req, res) {
    try {
        const { id } = req.params;
        const alumno = await getAlumnoById(id);
        if (!alumno) {
            return res.status(404).json({ error: "Alumno no encontrado." });
        }
        return res.status(200).json(alumno);
    } catch (error) {
        console.error("Error al obtener alumno:", error);
        return res.status(500).json({ error: "Error interno del servidor." });
    }
}

export async function create(req, res) {
    try {
        const { nombre, email, edad } = req.body;

        if (!nombre || !email) {
            return res.status(400).json({ error: "Nombre y email son requeridos." });
        }

        // Check if email already registered
        const existingAlumno = await getAlumnoByEmail(email);
        if (existingAlumno) {
            return res.status(409).json({ error: "El email ya está registrado." });
        }

        const newAlumno = await createAlumno({ nombre, email, edad });
        return res.status(201).json({
            message: "Alumno creado exitosamente.",
            alumno: newAlumno
        });
    } catch (error) {
        console.error("Error al crear alumno:", error);
        return res.status(500).json({ error: "Error interno del servidor." });
    }
}

export async function update(req, res) {
    try {
        const { id } = req.params;
        const { nombre, email, edad } = req.body;

        if (!nombre || !email) {
            return res.status(400).json({ error: "Nombre y email son requeridos." });
        }

        const existingAlumno = await getAlumnoById(id);
        if (!existingAlumno) {
            return res.status(404).json({ error: "Alumno no encontrado." });
        }

        // Check if email is in use by another student
        if (email !== existingAlumno.email) {
            const emailInUse = await getAlumnoByEmail(email);
            if (emailInUse) {
                return res.status(409).json({ error: "El email ya está en uso por otro alumno." });
            }
        }

        const updated = await updateAlumno(id, { nombre, email, edad });
        return res.status(200).json({
            message: "Alumno actualizado exitosamente.",
            alumno: updated
        });
    } catch (error) {
        console.error("Error al actualizar alumno:", error);
        return res.status(500).json({ error: "Error interno del servidor." });
    }
}

export async function remove(req, res) {
    try {
        const { id } = req.params;
        const existingAlumno = await getAlumnoById(id);
        if (!existingAlumno) {
            return res.status(404).json({ error: "Alumno no encontrado o ya eliminado." });
        }

        const deleted = await deleteAlumno(id);
        return res.status(200).json({
            message: "Alumno eliminado exitosamente.",
            alumno: deleted
        });
    } catch (error) {
        console.error("Error al eliminar alumno:", error);
        return res.status(500).json({ error: "Error interno del servidor." });
    }
}
