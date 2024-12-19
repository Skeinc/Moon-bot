import registerActions from "@actions/registerActions";
import { registerCallbacks } from "@callbacks/registerCallbacks";
import registerCommands from "@commands/registerCommands";
import { logger } from "@services/logger.service";
import { Bot } from "grammy";
import { registerWebhook } from "../webhooks/registerWebhook";

export const initConfig = async (bot: Bot) => {
    try {
        // Устанавливаем описание
        await bot.api.setMyDescription(`Привет! Я уникальный бот, который поможет разобраться в раскладах Таро. Нажмите "Start", чтобы начать!`);
        // Устанавливаем подсказку
        await bot.api.setMyCommands([
            { command: "start", description: "Запустить бота" },
            { command: "new_spread", description: "🔮 Новый расклад" },
            { command: "bonus", description: "🎁 Бонусы" },
            { command: "subscription", description: "💎 Подписка" },
            { command: "custom_spread", description: "🗓 Индивидуальный расклад" },
            { command: "support", description: "📩 Поддержка" },
            { command: "referral", description: "👥 Реферальная программа" },
            { command: "about_tarot", description: "📖 О картах Таро" }
        ]);
    }
    catch (error) {
        logger.error("Ошибка при установке описания или команд: ", error);
    }

    // Регистрируем команды
    registerCommands(bot);

    // Регистрируем обработчики действий
    registerActions(bot);

    // Регистрируем обратные вызовы
    registerCallbacks(bot);

    // Регистрируем webhook
    try {
        await registerWebhook();
    } catch (error) {
        logger.error('Критическая ошибка: не удалось зарегистрировать вебхук. Завершаем процесс.');
        
        process.exit(1);
    }
}