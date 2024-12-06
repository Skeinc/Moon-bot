import { logger } from "@services/logger.service";
import { loadEnv } from "@utils/envLoader.util";
import { initConfig } from "@utils/initConfig.util";
import { Bot } from "grammy";

// Загружаем переменные окружения
loadEnv();

const botToken = process.env.TELEGRAM_TOKEN;

if(!botToken) {
    logger.error("Переменная TELEGRAM_TOKEN не задана. Завершение работы.");

    process.exit(1);
}

// Создаем экземпляр бота
const bot = new Bot(botToken);

(async () => {
    try {
        // Устанавливаем начальную конфигурацию
        await initConfig(bot);

        // Запуск бота
        await bot.start();

        logger.info("Бот успешно запущен.");
    } 
    catch (error: any) {
        logger.error(`Ошибка запуска бота: ${error.message}`);

        process.exit(1);
    }
})();