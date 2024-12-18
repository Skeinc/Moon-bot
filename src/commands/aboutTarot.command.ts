import { backToMenu } from "@actions/menu.action";
import { getMoreInfoButton } from "@constants/buttons.const";
import { checkTelegramID } from "@utils/checkTelegramID.util";
import { Context } from "grammy";
import { sessionStateManager } from "../states/sessionState";
import { SessionStepsEnum } from "../enums/session.enum";

export const aboutTarotCommand = async (ctx: Context) => {
    if(!await checkTelegramID(ctx)) {
        return;
    }

    const telegramId: number = ctx.from?.id!;

    if(!sessionStateManager.getSessionState(telegramId)) {
        sessionStateManager.setSession(telegramId);
    }

    // Обновляем статус сессии
    sessionStateManager.updateSessionState(telegramId, {currentStep: SessionStepsEnum.IDLE});
    
    const tarotDescription = `
Таро — это система из 78 карт, используемых для гадания и саморазмышлений. Колода делится на два типа карт:

1. **Старшие Арканы (22 карты)** — представляют важные жизненные уроки и события. Например, **Шут** (новые начинания) или **Солнце** (счастье, успех).
2. **Младшие Арканы (56 карт)** — отражают повседневные аспекты жизни. Они делятся на 4 масти:
    - **Кубки** (эмоции, отношения)
    - **Мечи** (мысли, конфликты)
    - **Пентакли** (материальные вопросы)
    - **Жезлы** (действия, амбиции)

Каждая карта имеет своё значение и помогает раскрыть подсознательные мысли, эмоции и возможные пути решения проблем.

Таро используется для предсказаний, саморазмышлений и гармонизации внутренней энергии.
    `;

    await ctx.reply(tarotDescription, {
        reply_markup: getMoreInfoButton,
        parse_mode: "Markdown",
    });

    await backToMenu(ctx);
};