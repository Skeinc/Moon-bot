import { backToMenu } from "@actions/menu.action";
import { emptyReferralButtons, hasReferralButtons } from "@constants/buttons.const";
import { logger } from "@services/logger.service";
import { checkTelegramID } from "@utils/checkTelegramID.util";
import { Context } from "grammy"
import { referralStateManager } from "../states/referralState";
import { sessionStateManager } from "../states/sessionState";
import { SessionStepsEnum } from "../enums/session.enum";

export const referralCommand = async (ctx: Context) => {
    if(!await checkTelegramID(ctx)) {
        return;
    }
    
    // Данные пользователя
    const telegramId: number = ctx.from?.id!;

    if(!sessionStateManager.getSessionState(telegramId)) {
        sessionStateManager.setSession(telegramId);
    }

    // Обновляем статус сессии
    sessionStateManager.updateSessionState(telegramId, {currentStep: SessionStepsEnum.IDLE});

    // Данные необходимые для обработки команды
    const commandData = {
        hasReferral: false,
    };

    const referralStateData = referralStateManager.getReferralState(telegramId);
        
    referralStateData ? commandData.hasReferral = true : commandData.hasReferral = false;

    const referralDescription = `
👥 **Пригласи друзей и получи бонусы!**
За каждого приглашенного друга вы получаете **1 бесплатный запрос**. Чем больше друзей вы пригласите, тем больше запросов сможете сделать!
Поделитесь ссылкой и начните зарабатывать запросы прямо сейчас! 🌟
    `;

    if (!commandData.hasReferral) {
        // Если реферальной ссылки нет
        await ctx.reply(referralDescription, {
            reply_markup: emptyReferralButtons,
            parse_mode: "Markdown",
        });
    } else {
        // Если реферальной ссылки нет
        await ctx.reply(referralDescription, {
            reply_markup: hasReferralButtons,
            parse_mode: "Markdown",
        });
    }

    await backToMenu(ctx);
}