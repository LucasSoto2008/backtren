-- ENUM para roles
create type user_role as enum ('student', 'teacher');

-- USERS
create table users (
    id uuid primary key default gen_random_uuid(),
    email text unique not null,
    password text not null,
    role user_role not null,
    created_at timestamp default now(),
    deleted_at timestamp
);

-- SUBJECTS (materias)
create table subjects (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    teacher_id uuid not null,
    created_at timestamp default now(),
    deleted_at timestamp,

    constraint fk_teacher
        foreign key (teacher_id)
        references users(id)
        on delete restrict
);

-- ENROLLMENTS (relación alumno - materia)
create table enrollments (
    id uuid primary key default gen_random_uuid(),
    student_id uuid not null,
    subject_id uuid not null,
    created_at timestamp default now(),

    constraint fk_student
        foreign key (student_id)
        references users(id)
        on delete cascade,

    constraint fk_subject
        foreign key (subject_id)
        references subjects(id)
        on delete cascade,

    constraint unique_enrollment unique (student_id, subject_id)
);

-- ÍNDICES (performance)
create index idx_subjects_teacher on subjects(teacher_id);
create index idx_enrollments_student on enrollments(student_id);
create index idx_enrollments_subject on enrollments(subject_id);

-- FILTRO para soft delete (opcional pero recomendado)
-- Ejemplo: solo activos
-- select * from users where deleted_at is null;