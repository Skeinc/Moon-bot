import { logger } from "@services/logger.service"
import dotenv from "dotenv";
import path from "path";

export const loadEnv = (environment: string = process.env.NODE_ENV || "development"): void => {
    try {
        const envFilePath = path.resolve(__dirname, `../../environments/${environment}.env`);
        const result = dotenv.config({ path: envFilePath });

        if(result.error) {
            throw new Error(`Ошибка загрузки переменных из файла ${envFilePath}: ${result.error.message}`);
        }

        logger.info(`Переменные окружения загружены из файла: ${envFilePath}`);
    }
    catch (error: any) {
        logger.error(`Ошибка загрузки переменных окружения: ${error.message}`);

        process.exit(1);
    }
}