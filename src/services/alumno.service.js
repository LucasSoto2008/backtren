import { pool } from "../database.js";

export async function createAlumno({ nombre, email, edad }) {
    const query = `
        INSERT INTO alumnos (nombre, email, edad)
        VALUES ($1, $2, $3)
        RETURNING id, nombre, email, edad, created_at;
    `;
    const result = await pool.query(query, [nombre, email, edad]);
    return result.rows[0];
}

export async function getAlumnoByEmail(email) {
    const query = `
        SELECT * FROM alumnos
        WHERE email = $1 AND deleted_at IS NULL;
    `;
    const result = await pool.query(query, [email]);
    return result.rows[0];
}

export async function getAlumnoById(id) {
    const query = `
        SELECT id, nombre, email, edad, created_at FROM alumnos
        WHERE id = $1 AND deleted_at IS NULL;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
}

export async function getAllAlumnos() {
    const query = `
        SELECT id, nombre, email, edad, created_at FROM alumnos
        WHERE deleted_at IS NULL
        ORDER BY nombre;
    `;
    const result = await pool.query(query);
    return result.rows;
}

export async function updateAlumno(id, { nombre, email, edad }) {
    const query = `
        UPDATE alumnos
        SET nombre = $1, email = $2, edad = $3
        WHERE id = $4 AND deleted_at IS NULL
        RETURNING id, nombre, email, edad, created_at;
    `;
    const result = await pool.query(query, [nombre, email, edad, id]);
    return result.rows[0];
}

export async function deleteAlumno(id) {
    const query = `
        UPDATE alumnos
        SET deleted_at = NOW()
        WHERE id = $1 AND deleted_at IS NULL
        RETURNING id, nombre, email;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
}
