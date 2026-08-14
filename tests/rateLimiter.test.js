import express from "express";
import request from "supertest";
import { createRateLimiter, resetRateLimiterStore } from "../src/security/rateLimiter.js";
import { createToken } from "../src/security/jwt.js";
import { verifyAuthToken } from "../src/security/auth.middleware.js";

describe("Rate Limiting System Tests", () => {
    let app;

    beforeEach(() => {
        resetRateLimiterStore();
        app = express();
        app.use(express.json());
    });

    test("Responde con status 200 dentro del límite permitido", async () => {
        const limiter = createRateLimiter({
            name: "test_limit",
            windowMs: 60000,
            max: 3,
            message: "Límite superado"
        });

        app.get("/test", limiter, (req, res) => res.json({ success: true }));

        const res1 = await request(app).get("/test");
        expect(res1.status).toBe(200);
        expect(res1.headers["x-ratelimit-limit"]).toBe("3");
        expect(res1.headers["x-ratelimit-remaining"]).toBe("2");

        const res2 = await request(app).get("/test");
        expect(res2.status).toBe(200);
        expect(res2.headers["x-ratelimit-remaining"]).toBe("1");
    });

    test("Responde con 429 Too Many Requests y cabecera Retry-After al superar el límite", async () => {
        const limiter = createRateLimiter({
            name: "test_limit_exceeded",
            windowMs: 60000,
            max: 2,
            message: "Has superado el límite de solicitudes."
        });

        app.get("/test", limiter, (req, res) => res.json({ success: true }));

        await request(app).get("/test"); // Petición 1
        await request(app).get("/test"); // Petición 2

        const resExceeded = await request(app).get("/test"); // Petición 3 (Supera el límite)

        expect(resExceeded.status).toBe(429);
        expect(resExceeded.headers["retry-after"]).toBeDefined();
        expect(resExceeded.body.error).toBe("Has superado el límite de solicitudes.");
        expect(resExceeded.body.statusCode).toBe(429);
        expect(resExceeded.body.limit).toBe(2);
    });

    test("Aplica multiplicador de límite por rol cuando el usuario está autenticado", async () => {
        const limiter = createRateLimiter({
            name: "test_role_multiplier",
            windowMs: 60000,
            max: 2,
            roleMultipliers: {
                admin: 3, // 2 * 3 = 6 peticiones
                student: 1 // 2 * 1 = 2 peticiones
            }
        });

        app.get("/test-role", verifyAuthToken, limiter, (req, res) => res.json({ role: req.user.role }));

        const adminToken = createToken({ id: "admin-1", role: "admin" });

        // Administrador puede realizar más solicitudes
        for (let i = 0; i < 5; i++) {
            const res = await request(app)
                .get("/test-role")
                .set("Authorization", `Bearer ${adminToken}`);
            expect(res.status).toBe(200);
            expect(res.headers["x-ratelimit-limit"]).toBe("6");
        }
    });
});
