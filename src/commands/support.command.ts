import { backToMenu } from "@actions/menu.action";
import { getSupportButton } from "@constants/buttons.const";
import { checkTelegramID } from "@utils/checkTelegramID.util";
import { Context } from "grammy";
import { sessionStateManager } from "../states/sessionState";
import { SessionStepsEnum } from "../enums/session.enum";

export const supportCommand= async (ctx: Context) => {
    if(!await checkTelegramID(ctx)) {
        return;
    }

    const telegramId: number = ctx.from?.id!;

    if(!sessionStateManager.getSessionState(telegramId)) {
        sessionStateManager.setSession(telegramId);
    }

    // Обновляем статус сессии
    sessionStateManager.updateSessionState(telegramId, {currentStep: SessionStepsEnum.IDLE});
    
    const supportDescription = `
👋 **Добро пожаловать в службу поддержки!**
    
🔗 **Связаться с поддержкой**: [Нажмите здесь](https://t.me/bot_lovemyself) для перехода в чат с нашей службой поддержки.
    
Спасибо, что выбрали нас! Мы здесь, чтобы помочь вам.
    `;

    await ctx.reply(supportDescription, {
        reply_markup: getSupportButton,
        parse_mode: "Markdown",
    });

    await backToMenu(ctx);
}