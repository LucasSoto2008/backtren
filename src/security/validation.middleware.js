/**
 * Middleware para validación y sanitización de datos de entrada.
 */

// Regex para validar email
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Regex para validar UUIDv4
const UUID_REGEX = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

/**
 * Sanitiza recursivamente objetos string en req.body para prevenir XSS y limpiar datos
 */
export function sanitizeBody(req, res, next) {
    if (req.body && typeof req.body === "object") {
        for (const key of Object.keys(req.body)) {
            if (typeof req.body[key] === "string") {
                // Trim y remoción de caracteres potencialmente peligrosos de XSS
                req.body[key] = req.body[key]
                    .trim()
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;");
            }
        }
    }
    next();
}

/**
 * Valida los datos requeridos para el registro de usuarios
 */
export function validateRegisterInput(req, res, next) {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        return res.status(400).json({
            error: "Datos incompletos. Email, contraseña y rol son requeridos."
        });
    }

    if (!EMAIL_REGEX.test(email)) {
        return res.status(400).json({
            error: "Formato de email inválido."
        });
    }

    if (password.length < 6) {
        return res.status(400).json({
            error: "La contraseña debe tener al menos 6 caracteres por razones de seguridad."
        });
    }

    const validRoles = ["admin", "teacher", "student"];
    if (!validRoles.includes(role)) {
        return res.status(400).json({
            error: "Rol no válido. Debe ser uno de los siguientes: admin, teacher, student."
        });
    }

    next();
}

/**
 * Valida los datos de inicio de sesión
 */
export function validateLoginInput(req, res, next) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            error: "Email y contraseña son requeridos para iniciar sesión."
        });
    }

    if (!EMAIL_REGEX.test(email)) {
        return res.status(400).json({
            error: "Formato de email inválido."
        });
    }

    next();
}

/**
 * Middleware para validar que los parámetros ID sean UUID válidos
 */
export function validateUUIDParam(...paramNames) {
    return (req, res, next) => {
        for (const paramName of paramNames) {
            const val = req.params[paramName];
            if (val && !UUID_REGEX.test(val)) {
                return res.status(400).json({
                    error: `El parámetro '${paramName}' no es un identificador UUID válido.`
                });
            }
        }
        next();
    };
}
