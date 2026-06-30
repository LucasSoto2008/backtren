import { pool } from "../database.js";
import bcrypt from "bcrypt";

export async function createUser({ email, password, role }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
        INSERT INTO users (email, password, role)
        VALUES ($1, $2, $3)
        RETURNING id, email, role, created_at;
    `;
    const result = await pool.query(query, [email, hashedPassword, role]);
    return result.rows[0];
}

export async function getUserByEmail(email) {
    const query = `
        SELECT * FROM users
        WHERE email = $1 AND deleted_at IS NULL;
    `;
    const result = await pool.query(query, [email]);
    return result.rows[0];
}

export async function getUserById(id) {
    const query = `
        SELECT id, email, role, created_at FROM users
        WHERE id = $1 AND deleted_at IS NULL;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
}

export async function getAllUsers() {
    const query = `
        SELECT id, email, role, created_at FROM users
        WHERE deleted_at IS NULL;
    `;
    const result = await pool.query(query);
    return result.rows;
}

export async function updateUser(id, { email, role, password }) {
    let query;
    let params;
    if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        query = `
            UPDATE users
            SET email = $1, role = $2, password = $3
            WHERE id = $4 AND deleted_at IS NULL
            RETURNING id, email, role, created_at;
        `;
        params = [email, role, hashedPassword, id];
    } else {
        query = `
            UPDATE users
            SET email = $1, role = $2
            WHERE id = $3 AND deleted_at IS NULL
            RETURNING id, email, role, created_at;
        `;
        params = [email, role, id];
    }
    const result = await pool.query(query, params);
    return result.rows[0];
}

export async function deleteUser(id) {
    const query = `
        UPDATE users
        SET deleted_at = NOW()
        WHERE id = $1 AND deleted_at IS NULL
        RETURNING id, email;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
}

