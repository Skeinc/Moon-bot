import { Bot } from "grammy";

// Инициализируем бота с токеном из окружения
const bot = new Bot(process.env.TELEGRAM_TOKEN as string);