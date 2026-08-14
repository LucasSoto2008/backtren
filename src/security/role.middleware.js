/**
 * Middleware para autorización basada en roles (RBAC) y protección de datos académicos.
 */

/**
 * Middleware que autoriza el acceso solo si el rol del usuario autenticado está en la lista de roles permitidos.
 * 
 * @param  {...string} allowedRoles Roles permitidos (ej. 'admin', 'teacher', 'student')
 */
export function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                error: "Acceso denegado. No se encontró información de autenticación."
            });
        }

        const userRole = req.user.role;

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({
                error: "Acceso prohibido. No posees los permisos necesarios para acceder a este recurso.",
                requiredRoles: allowedRoles,
                currentRole: userRole
            });
        }

        next();
    };
}

/**
 * Middleware para verificar si un estudiante está accediendo a sus propios recursos académicos o si es admin/profesor.
 */
export function checkStudentSelfOrStaff(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ error: "Acceso denegado. Usuario no autenticado." });
    }

    const { role } = req.user;
    
    // Admins y profesores tienen acceso amplio
    if (role === "admin" || role === "teacher") {
        return next();
    }

    // Para estudiantes, si se especifica alumno_id en los parámetros o query
    const targetAlumnoId = req.params.alumno_id || req.params.id;
    if (targetAlumnoId && req.user.alumnoId && req.user.alumnoId !== targetAlumnoId) {
        return res.status(403).json({
            error: "Acceso prohibido. Un estudiante no puede acceder ni modificar la información académica de otro alumno."
        });
    }

    next();
}
