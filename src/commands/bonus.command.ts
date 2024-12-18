
import { backToMenu } from "@actions/menu.action";
import { bonusButtons } from "@constants/buttons.const";
import { checkTelegramID } from "@utils/checkTelegramID.util";
import { Context } from "grammy";
import { sessionStateManager } from "../states/sessionState";
import { SessionStepsEnum } from "../enums/session.enum";

export const bonusCommand = async (ctx: Context) => {
    if(!await checkTelegramID(ctx)) {
        return;
    }

    const telegramId: number = ctx.from?.id!;

    if(!sessionStateManager.getSessionState(telegramId)) {
        sessionStateManager.setSession(telegramId);
    }

    // Обновляем статус сессии
    sessionStateManager.updateSessionState(telegramId, {currentStep: SessionStepsEnum.IDLE});
    
    // Тестовые переменные
    const claimedBonus: boolean = false;

    if (!claimedBonus) {
        // Если бонус не был забран
        const bonusDescription = `
📢 **Подпишись на наш канал, чтобы получить дополнительные 3 запроса!**

На нашем канале ты найдешь много интересной информации про эзотерику и астрологию, а также научишься делать свои Таро расклады! 🌟

Подписавшись, ты не только получишь бонус, но и будешь в курсе всех новинок и полезных советов.
        `;

        await ctx.reply(bonusDescription, {
            reply_markup: bonusButtons,
            parse_mode: "Markdown",
        });

        await backToMenu(ctx);
    }
    else {
        // Если бонус уже был забран
        const bonusDescription = `
⛔️ Вы уже забирали бонус
        `;

        await backToMenu(ctx, bonusDescription);
    }
}