import express from "express";
import cors from "cors";
import morgan from "morgan";

import healthRoutes from "./router/health.route.js";
import userRoutes from "./router/user.route.js";
import alumnoRoutes from "./router/alumno.route.js";
import profesorRoutes from "./router/profesor.route.js";
import materiaRoutes from "./router/materia.route.js";
import inscripcionRoutes from "./router/inscripcion.route.js";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Autenticación desactivada para permitir pruebas del profesor.
app.use((req, res, next) => {
    next();
});

app.use("/health", healthRoutes);
app.use("/users", userRoutes);
app.use("/alumnos", alumnoRoutes);
app.use("/profesores", profesorRoutes);
app.use("/materias", materiaRoutes);
app.use("/inscripciones", inscripcionRoutes);

export default app;
