import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";

import healthRoutes from "./router/health.route.js";
import authRoutes from "./router/auth.route.js";
import userRoutes from "./router/user.route.js";
import alumnoRoutes from "./router/alumno.route.js";
import profesorRoutes from "./router/profesor.route.js";
import materiaRoutes from "./router/materia.route.js";
import inscripcionRoutes from "./router/inscripcion.route.js";

import { verifyAuthToken } from "./security/auth.middleware.js";
import { globalErrorHandler } from "./security/errorHandler.middleware.js";

const app = express();

// Seguridad de cabeceras HTTP mediante Helmet y configuración CORS
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Rutas Públicas
app.use("/health", healthRoutes);
app.use("/auth", authRoutes);

// Middleware de Autenticación JWT para proteger las siguientes rutas
app.use("/users", verifyAuthToken, userRoutes);
app.use("/alumnos", verifyAuthToken, alumnoRoutes);
app.use("/profesores", verifyAuthToken, profesorRoutes);
app.use("/materias", verifyAuthToken, materiaRoutes);
app.use("/inscripciones", verifyAuthToken, inscripcionRoutes);

// Manejador para rutas 404 No Encontradas
app.use((req, res) => {
    res.status(404).json({ error: `La ruta ${req.originalUrl} no fue encontrada en este servidor.` });
});

// Middleware Global de Manejo de Errores
app.use(globalErrorHandler);

export default app;
