import { DEFAULT_LOG_LEVEL, LOG_LEVELS } from "@constants/logger.const";
import { createLogger, transports } from "winston";
import { logFormat } from "@utils/logger.util";
import path from "path";
import fs from "fs";

// Получение абсолютного пути до папки logs
const logsDir = path.resolve(__dirname, "../../logs");

// Проверяем, существует ли папка logs, если нет — создаем
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

// Создаем основной логгер
const logger = createLogger({
    levels: LOG_LEVELS.levels,
    level: DEFAULT_LOG_LEVEL,
    format: logFormat,
    transports: [
        new transports.Console(),
        new transports.File({
            filename: path.join(logsDir, 'app.log'),
            level: 'info'
        }),
        new transports.File({
            filename: path.join(logsDir, 'error.log'),
            level: 'error'
        })
    ]
});

// Обработка необработанных исключений
logger.exceptions.handle(
    new transports.File({ filename: path.join(logsDir, 'exceptions.log') })
);

// Экспортируем логгер
export default logger;