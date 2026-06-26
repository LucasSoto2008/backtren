import { pool } from "../database.js";

export async function checkDatabase() {
    try {
        await pool.query("SELECT 1");

        return {
            status: "CONNECTED",
            ok: true,
        };
    } catch (error) {
        return {
            status: "DISCONNECTED",
            ok: false,
            error: error.message,
        };
    }
}