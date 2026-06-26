import { checkDatabase } from "../services/health.service.js";

export async function health(req, res) {
    const db = await checkDatabase();

    const response = {
        status: db.ok ? "UP" : "DOWN",
        database: db.status,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    };

    if (!db.ok) {
        response.error = db.error;
    }

    return res.status(db.ok ? 200 : 503).json(response);
}