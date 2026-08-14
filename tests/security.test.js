import express from "express";
import request from "supertest";
import { authorizeRoles } from "../src/security/role.middleware.js";
import { sanitizeBody, validateUUIDParam } from "../src/security/validation.middleware.js";
import { createToken } from "../src/security/jwt.js";
import { verifyAuthToken } from "../src/security/auth.middleware.js";

describe("Security & RBAC Authorization Tests", () => {
    let app;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use(sanitizeBody);
    });

    test("Deniega el acceso (401) si no se proporciona token de autenticación", async () => {
        app.get("/protected", verifyAuthToken, (req, res) => res.json({ ok: true }));

        const res = await request(app).get("/protected");
        expect(res.status).toBe(401);
        expect(res.body.error).toContain("Acceso denegado");
    });

    test("Permite el acceso a un usuario con el rol adecuado (200)", async () => {
        app.get("/admin-only", verifyAuthToken, authorizeRoles("admin"), (req, res) => res.json({ ok: true }));

        const adminToken = createToken({ id: "admin-id-123", role: "admin" });
        const res = await request(app)
            .get("/admin-only")
            .set("Authorization", `Bearer ${adminToken}`);

        expect(res.status).toBe(200);
        expect(res.body.ok).toBe(true);
    });

    test("Rechaza con 403 Forbidden a un estudiante que intenta acceder a un endpoint restringido", async () => {
        app.get("/admin-only", verifyAuthToken, authorizeRoles("admin"), (req, res) => res.json({ ok: true }));

        const studentToken = createToken({ id: "student-id-456", role: "student" });
        const res = await request(app)
            .get("/admin-only")
            .set("Authorization", `Bearer ${studentToken}`);

        expect(res.status).toBe(403);
        expect(res.body.error).toContain("Acceso prohibido");
        expect(res.body.currentRole).toBe("student");
    });

    test("Sanitiza las cadenas de texto del body para prevenir XSS", async () => {
        app.post("/submit", (req, res) => res.json(req.body));

        const res = await request(app)
            .post("/submit")
            .send({ nombre: "<script>alert('xss')</script> Juan" });

        expect(res.status).toBe(200);
        expect(res.body.nombre).toBe("&lt;script&gt;alert('xss')&lt;/script&gt; Juan");
    });

    test("Rechaza identificadores no UUID con 400 Bad Request", async () => {
        app.get("/item/:id", validateUUIDParam("id"), (req, res) => res.json({ ok: true }));

        const resInvalid = await request(app).get("/item/123-invalid-id");
        expect(resInvalid.status).toBe(400);
        expect(resInvalid.body.error).toContain("no es un identificador UUID válido");

        const resValid = await request(app).get("/item/a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11");
        expect(resValid.status).toBe(200);
    });
});
