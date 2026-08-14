/**
 * Sistema de Rate Limiting configurable por endpoint, IP, usuario autenticado y rol.
 */

// Almacenamiento en memoria para rastrear las peticiones por clave
const memoryStore = new Map();

// Limpieza periódica de registros expirados para evitar fugas de memoria cada 5 minutos
setInterval(() => {
    const now = Date.now();
    for (const [key, record] of memoryStore.entries()) {
        if (now > record.resetTime) {
            memoryStore.delete(key);
        }
    }
}, 5 * 60 * 1000).unref();

/**
 * Función creadora de middleware de Rate Limiting.
 * 
 * @param {Object} options Configuración del Rate Limiter
 * @param {number} options.windowMs Tiempo de la ventana en milisegundos (por defecto 15 minutos = 900000ms)
 * @param {number} options.max Número máximo de peticiones por ventana por defecto
 * @param {string} options.message Mensaje de error personalizado al superar el límite
 * @param {Object} options.roleMultipliers Multiplicadores opcionales según rol (ej: { admin: 3, teacher: 2, student: 1 })
 * @returns {Function} Middleware de Express
 */
export function createRateLimiter(options = {}) {
    const windowMs = options.windowMs || 15 * 60 * 1000; // 15 minutos
    const defaultMax = options.max || 100;
    const message = options.message || "Demasiadas peticiones. Has superado el límite permitido. Por favor intente más tarde.";
    const roleMultipliers = options.roleMultipliers || {
        admin: 3,
        teacher: 2,
        student: 1
    };

    return (req, res, next) => {
        // Determinamos la clave única: usuario autenticado (req.user.id) o IP del cliente
        const keyPrefix = options.name || "global";
        const userId = req.user ? req.user.id : null;
        const userRole = req.user ? req.user.role : null;
        const clientIp = req.headers["x-forwarded-for"] || req.ip || req.socket.remoteAddress || "127.0.0.1";
        
        const identifier = userId ? `user:${userId}` : `ip:${clientIp}`;
        const key = `${keyPrefix}:${identifier}`;

        // Determinar el límite máximo para esta petición (considerando el rol si está autenticado)
        let maxRequests = defaultMax;
        if (userRole && roleMultipliers[userRole]) {
            maxRequests = Math.floor(defaultMax * roleMultipliers[userRole]);
        }

        const now = Date.now();
        let record = memoryStore.get(key);

        if (!record || now > record.resetTime) {
            record = {
                count: 1,
                resetTime: now + windowMs
            };
            memoryStore.set(key, record);
        } else {
            record.count += 1;
        }

        const timeRemaining = Math.ceil((record.resetTime - now) / 1000);
        const remainingRequests = Math.max(0, maxRequests - record.count);

        // Cabeceras HTTP de Rate Limit
        res.setHeader("X-RateLimit-Limit", maxRequests);
        res.setHeader("X-RateLimit-Remaining", remainingRequests);
        res.setHeader("X-RateLimit-Reset", Math.ceil(record.resetTime / 1000));

        if (record.count > maxRequests) {
            // Cabecera estándar Retry-After (en segundos)
            res.setHeader("Retry-After", timeRemaining);
            return res.status(429).json({
                error: message,
                statusCode: 429,
                retryAfterSeconds: timeRemaining,
                limit: maxRequests,
                current: record.count,
                resetTime: new Date(record.resetTime).toISOString()
            });
        }

        next();
    };
}

/**
 * Limitadores preconfigurados por tipo de endpoint:
 */

// 1. Límite Estricto para Autenticación (login, registro, recuperación de contraseña)
export const authLimiter = createRateLimiter({
    name: "auth",
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 10, // Máximo 10 intentos en 15 minutos por IP
    message: "Demasiados intentos de autenticación. Por favor intente de nuevo en 15 minutos."
});

// 2. Límite Moderado para Consultas Generales (GET)
export const generalLimiter = createRateLimiter({
    name: "general",
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // 100 peticiones en 15 minutos para estudiantes, 200 profesores, 300 admin
    roleMultipliers: {
        admin: 3,
        teacher: 2,
        student: 1
    },
    message: "Ha superado el límite de consultas generales permitidas."
});

// 3. Límite Específico para Operaciones Escritas / Sensibles (POST, PUT, DELETE)
export const writeLimiter = createRateLimiter({
    name: "write",
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 30, // 30 operaciones de escritura por ventana para estudiantes
    roleMultipliers: {
        admin: 5,
        teacher: 3,
        student: 1
    },
    message: "Ha superado el límite de operaciones de modificación de datos perjudiciales o frecuentes."
});

/**
 * Función helper para reiniciar la memoria del rate limiter (para tests y reinicios)
 */
export function resetRateLimiterStore() {
    memoryStore.clear();
}
