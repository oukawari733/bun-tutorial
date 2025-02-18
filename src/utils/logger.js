import pino from 'pino';

// Configure the logger
const logger = pino({
    level: process.env.LOG_LEVEL || 'info', // Log level (e.g., info, debug, error)
    transport: {
        target: 'pino-pretty', // Format logs for better readability
        options: {
            colorize: true, // Add colors to logs
            translateTime: 'yyyy-MM-dd HH:mm:ss', // Custom timestamp format
        },
    },
});

export default logger;
