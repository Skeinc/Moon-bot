import { Bot, Context } from "grammy";
import { sendMenu } from "./menu.action";
import { customSpreadCommand } from "@commands/customSpread.command";
import { aboutTarotCommand } from "@commands/aboutTarot.command";
import { adminPanelCommand } from "@commands/adminPanel.command";
import { supportCommand } from "@commands/support.command";
import { bonusCommand } from "@commands/bonus.command";
import { subscriptionCommand } from "@commands/subscription.command";
import { referralCommand } from "@commands/referral.command";
import { newSpreadCommand } from "@commands/newSpread.command";
import { sessionStateManager } from "../states/sessionState";
import { SessionStepsEnum } from "../enums/session.enum";
import { handleSpreadAction } from "./spread.action";

export default function registerActions(bot: Bot): void {
    // Обработчик нажатия "В главное меню"
    bot.hears("🏠 В главное меню", sendMenu);
    // Обработчик нажатия "Новый расклад"
    bot.hears("🔮 Новый расклад", newSpreadCommand);
    // Обработчик нажатия "Бонусы"
    bot.hears("🎁 Бонусы", bonusCommand);
    // Обработчик нажатия "Подписка"
    bot.hears("💎 Подписка", subscriptionCommand);
    // Обработчик нажатия "Индивидуальный расклад"
    bot.hears("🗓 Индивидуальный расклад", customSpreadCommand);
    // Обработчик нажатия "Поддержка"
    bot.hears("📩 Поддержка", supportCommand);
    // Обработчик нажатия "Реферальная программа"
    bot.hears("👥 Реферальная программа", referralCommand);
    // Обработчик нажатия "О картах таро"
    bot.hears("📖 О картах Таро", aboutTarotCommand);
    // Обработчик нажатия "🛠 Админ Панель"
    bot.hears("🛠 Админ Панель", adminPanelCommand);
    // Обработка всех текстовых сообщений
    bot.on("message:text", async (ctx: Context) => {
        const telegramId = ctx.from?.id;

        if (!telegramId) return;

        const session = sessionStateManager.getSessionState(telegramId);

        if (session?.currentStep === SessionStepsEnum.QUESTION_INPUT) {
            await handleSpreadAction(ctx);
        }
    });
}