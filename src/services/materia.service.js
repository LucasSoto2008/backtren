import { pool } from "../database.js";

export async function createMateria({ nombre, profesor_id }) {
    const query = `
        INSERT INTO materias (nombre, profesor_id)
        VALUES ($1, $2)
        RETURNING id, nombre, profesor_id, created_at;
    `;
    const result = await pool.query(query, [nombre, profesor_id]);
    return result.rows[0];
}

export async function getMateriaById(id) {
    const query = `
        SELECT m.id, m.nombre, m.profesor_id, p.nombre as profesor_nombre, p.email as profesor_email, m.created_at 
        FROM materias m
        LEFT JOIN profesores p ON m.profesor_id = p.id
        WHERE m.id = $1 AND m.deleted_at IS NULL;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
}

export async function getAllMaterias() {
    const query = `
        SELECT m.id, m.nombre, m.profesor_id, p.nombre as profesor_nombre, p.email as profesor_email, m.created_at 
        FROM materias m
        LEFT JOIN profesores p ON m.profesor_id = p.id
        WHERE m.deleted_at IS NULL
        ORDER BY m.nombre;
    `;
    const result = await pool.query(query);
    return result.rows;
}

export async function updateMateria(id, { nombre, profesor_id }) {
    const query = `
        UPDATE materias
        SET nombre = $1, profesor_id = $2
        WHERE id = $3 AND deleted_at IS NULL
        RETURNING id, nombre, profesor_id, created_at;
    `;
    const result = await pool.query(query, [nombre, profesor_id, id]);
    return result.rows[0];
}

export async function deleteMateria(id) {
    const query = `
        UPDATE materias
        SET deleted_at = NOW()
        WHERE id = $1 AND deleted_at IS NULL
        RETURNING id, nombre;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
}
