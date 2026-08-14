/**
 * Middleware de manejo global de errores.
 */
export function globalErrorHandler(err, req, res, next) {
    console.error("Error no capturado:", err);

    const statusCode = err.statusCode || err.status || 500;
    const message = err.message || "Error interno del servidor.";

    res.status(statusCode).json({
        error: message,
        statusCode: statusCode,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack })
    });
}
