-- PROFESORES (teachers)
CREATE TABLE profesores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    especialidad TEXT,
    created_at TIMESTAMP DEFAULT now(),
    deleted_at TIMESTAMP
);

-- ALUMNOS (students)
CREATE TABLE alumnos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    edad INTEGER,
    created_at TIMESTAMP DEFAULT now(),
    deleted_at TIMESTAMP
);

-- MATERIAS (subjects)
CREATE TABLE materias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    profesor_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    deleted_at TIMESTAMP,

    CONSTRAINT fk_profesor
        FOREIGN KEY (profesor_id)
        REFERENCES profesores(id)
        ON DELETE RESTRICT
);

-- INSCRIPCIONES (enrollments: relación alumno - materia)
CREATE TABLE inscripciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alumno_id UUID NOT NULL,
    materia_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT now(),

    CONSTRAINT fk_alumno
        FOREIGN KEY (alumno_id)
        REFERENCES alumnos(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_materia
        FOREIGN KEY (materia_id)
        REFERENCES materias(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_inscripcion UNIQUE (alumno_id, materia_id)
);

-- ÍNDICES (performance)
CREATE INDEX idx_materias_profesor ON materias(profesor_id);
CREATE INDEX idx_inscripciones_alumno ON inscripciones(alumno_id);
CREATE INDEX idx_inscripciones_materia ON inscripciones(materia_id);