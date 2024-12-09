import { sendMenu } from "@actions/menu.action";
import registerActions from "@actions/registerActions";
import registerCommands from "@commands/registerCommands";
import { logger } from "@services/logger.service";
import { Bot } from "grammy";

export const initConfig = async (bot: Bot) => {
    try {
        // Устанавливаем описание
        await bot.api.setMyDescription(`Привет! Я уникальный бот, который поможет разобраться в раскладах Таро. Нажмите "Start", чтобы начать!`);
        // Устанавливаем подсказку
        await bot.api.setMyCommands([
            { command: "start", description: "Запустить бота" },
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
}