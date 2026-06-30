import { pool } from "../database.js";

export async function createInscripcion({ alumno_id, materia_id }) {
    const query = `
        INSERT INTO inscripciones (alumno_id, materia_id)
        VALUES ($1, $2)
        RETURNING id, alumno_id, materia_id, created_at;
    `;
    const result = await pool.query(query, [alumno_id, materia_id]);
    return result.rows[0];
}

export async function deleteInscripcion(id) {
    const query = `
        DELETE FROM inscripciones
        WHERE id = $1
        RETURNING id, alumno_id, materia_id;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
}

export async function deleteInscripcionByRelation(alumno_id, materia_id) {
    const query = `
        DELETE FROM inscripciones
        WHERE alumno_id = $1 AND materia_id = $2
        RETURNING id, alumno_id, materia_id;
    `;
    const result = await pool.query(query, [alumno_id, materia_id]);
    return result.rows[0];
}

export async function getAllInscripciones() {
    const query = `
        SELECT i.id, i.alumno_id, a.nombre as alumno_nombre, a.email as alumno_email, 
               i.materia_id, m.nombre as materia_nombre, i.created_at
        FROM inscripciones i
        JOIN alumnos a ON i.alumno_id = a.id
        JOIN materias m ON i.materia_id = m.id
        ORDER BY i.created_at DESC;
    `;
    const result = await pool.query(query);
    return result.rows;
}

export async function getInscripcionesByAlumno(alumno_id) {
    const query = `
        SELECT i.id, i.materia_id, m.nombre as materia_nombre, i.created_at
        FROM inscripciones i
        JOIN materias m ON i.materia_id = m.id
        WHERE i.alumno_id = $1
        ORDER BY m.nombre;
    `;
    const result = await pool.query(query, [alumno_id]);
    return result.rows;
}

export async function getInscripcionesByMateria(materia_id) {
    const query = `
        SELECT i.id, i.alumno_id, a.nombre as alumno_nombre, a.email as alumno_email, i.created_at
        FROM inscripciones i
        JOIN alumnos a ON i.alumno_id = a.id
        WHERE i.materia_id = $1
        ORDER BY a.nombre;
    `;
    const result = await pool.query(query, [materia_id]);
    return result.rows;
}
