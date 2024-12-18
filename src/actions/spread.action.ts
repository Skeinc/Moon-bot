import { checkTelegramID } from "@utils/checkTelegramID.util";
import { Context } from "grammy";
import { sessionStateManager } from "../states/sessionState";
import { SessionStepsEnum } from "../enums/session.enum";
import { RequestService } from "@services/request.service";
import { userStateManager } from "../states/userState";
import { RequestTypesEnum } from "../enums/request.enum";
import { logger } from "@services/logger.service";
import { UserInterface } from "@interfaces/api/user.interface";
import { UserService } from "@services/user.service";
import { generateRandomCards } from "@utils/generateRandomCards.util";
import { CreateRequestInterface } from "@interfaces/api/request.interface";
import { newSpreadCommand } from "@commands/newSpread.command";

export const handleSpreadAction = async (ctx: Context) => {
    if(!await checkTelegramID(ctx)) {
        return;
    }
    
    const telegramId = ctx.from?.id!;

    // Проверяем текущее состояние пользователя
    const session = sessionStateManager.getSessionState(telegramId);
    
    if (!session || session.currentStep !== SessionStepsEnum.QUESTION_INPUT) {
        return;
    }

    // Получаем текст вопроса
    const question = ctx.message?.text;

    if (!question) {
        await ctx.reply("Пожалуйста, введите корректный вопрос.");

        return;
    }

    try {
        const storageUserData = userStateManager.getUserState(telegramId);
        const cards: string[] = generateRandomCards(3);

        // Подготовка сообщения о процессе расклада
        await ctx.reply("Ваш вопрос принят. Карты готовят ответ... ✨");

        let requestData: CreateRequestInterface | null = null;

        if (storageUserData) {
            // Отправляем данные на бекенд
            requestData = await RequestService.createRequest(
                storageUserData.id, telegramId, RequestTypesEnum.NEW_SPREAD, question, cards, true
            );
        }
        else {
            const userData: UserInterface | null = await UserService.getUserByTelegramId(telegramId);

            if (userData) {
                requestData = await RequestService.createRequest(
                    userData.id, telegramId, RequestTypesEnum.NEW_SPREAD, question, cards, true
                );
            } else {
                logger.error(`Не удалось найти пользователя с telegram ID: ${telegramId}`);

                await ctx.reply("Произошла ошибка при обработке вашего расклада, попробуйте нажать /start.");

                return;
            }
        }

        if (requestData) {
            // Успешный ответ с бэкенда
            const openAIResponse = requestData.openAIResponse || "Вселенная не смогла дать четкий ответ.";
            const selectedCards = cards.join(", ");

            // Форматированный вывод для пользователя
            const responseMessage = `
✨ *Ваш расклад готов!* ✨

🔮 *Вы выбрали карты*:  
${selectedCards}

🌌 *Вселенная ответила*:  
"${openAIResponse}"
            `.trim();

            await ctx.reply(responseMessage, { parse_mode: "Markdown" });

            sessionStateManager.updateSessionState(telegramId, { currentStep: SessionStepsEnum.CARD_SELECTION });

            // Вызов newSpreadCommand
            await newSpreadCommand(ctx);
        }

    } catch (error) {
        logger.error(`Ошибка при обработке расклада пользователя: ${(error as Error).message}`);
        
        await ctx.reply("Произошла ошибка при обработке вашего расклада, попробуйте нажать /start.");
    }
};