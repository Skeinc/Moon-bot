import { Bot } from "grammy";
import { startCommand } from "./start.command";

export default function registerCommands(bot: Bot): void {
    // Регистрируем команду /start
    bot.command("start", startCommand);
}