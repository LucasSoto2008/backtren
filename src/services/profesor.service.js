import { pool } from "../database.js";

export async function createProfesor({ nombre, email, especialidad }) {
    const query = `
        INSERT INTO profesores (nombre, email, especialidad)
        VALUES ($1, $2, $3)
        RETURNING id, nombre, email, especialidad, created_at;
    `;
    const result = await pool.query(query, [nombre, email, especialidad]);
    return result.rows[0];
}

export async function getProfesorByEmail(email) {
    const query = `
        SELECT * FROM profesores
        WHERE email = $1 AND deleted_at IS NULL;
    `;
    const result = await pool.query(query, [email]);
    return result.rows[0];
}

export async function getProfesorById(id) {
    const query = `
        SELECT id, nombre, email, especialidad, created_at FROM profesores
        WHERE id = $1 AND deleted_at IS NULL;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
}

export async function getAllProfesores() {
    const query = `
        SELECT id, nombre, email, especialidad, created_at FROM profesores
        WHERE deleted_at IS NULL
        ORDER BY nombre;
    `;
    const result = await pool.query(query);
    return result.rows;
}

export async function updateProfesor(id, { nombre, email, especialidad }) {
    const query = `
        UPDATE profesores
        SET nombre = $1, email = $2, especialidad = $3
        WHERE id = $4 AND deleted_at IS NULL
        RETURNING id, nombre, email, especialidad, created_at;
    `;
    const result = await pool.query(query, [nombre, email, especialidad, id]);
    return result.rows[0];
}

export async function deleteProfesor(id) {
    const query = `
        UPDATE profesores
        SET deleted_at = NOW()
        WHERE id = $1 AND deleted_at IS NULL
        RETURNING id, nombre, email;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
}
