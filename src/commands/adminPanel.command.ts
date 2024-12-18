import { backToMenu } from "@actions/menu.action";
import { checkTelegramID } from "@utils/checkTelegramID.util";
import { Context } from "grammy";
import { sessionStateManager } from "../states/sessionState";
import { SessionStepsEnum } from "../enums/session.enum";

export const adminPanelCommand = async (ctx: Context) => {
    if(!await checkTelegramID(ctx)) {
        return;
    }

    const telegramId: number = ctx.from?.id!;

    if(!sessionStateManager.getSessionState(telegramId)) {
        sessionStateManager.setSession(telegramId);
    }

    // Обновляем статус сессии
    sessionStateManager.updateSessionState(telegramId, {currentStep: SessionStepsEnum.IDLE});
    
    const adminPanelDescription = `🛠️ **Сервис в разработке, скоро будет готов!**

Мы работаем над улучшением и добавлением новых функций. 
Скоро ты сможешь воспользоваться нашим сервисом и наслаждаться всеми преимуществами! Благодарим за твоё терпение.`;

    await backToMenu(ctx, adminPanelDescription);
};