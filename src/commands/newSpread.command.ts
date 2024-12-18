import { UserInterface } from "@interfaces/api/user.interface";
import { logger } from "@services/logger.service";
import { UserService } from "@services/user.service";
import { checkTelegramID } from "@utils/checkTelegramID.util";
import { Context } from "grammy";
import { pluralize } from "@utils/pluralize.util";
import { getTimeRemainingInDays, getTimeRemainingInHMS, getTimeRemainingInSeconds } from "@utils/date.util";
import { SessionStepsEnum } from "../enums/session.enum";
import { sessionStateManager } from "../states/sessionState";

export const newSpreadCommand = async (ctx: Context) => {
    if(!await checkTelegramID(ctx)) {
        return;
    }

    // Данные пользователя
    const telegramId = ctx.from?.id!;
    
    // Данные необходимые для обработки команды
    const commandData = {
        freeRequests: 0,
        hasSubscription: false,
        subscriptionExpiry: '',
    };

    // Проверяем данные пользователя
    try {
        const userData: UserInterface | null = await UserService.getUserByTelegramId(telegramId);

        if(userData) {
            // Обновляем кол-во бесплатных запросов
            commandData.freeRequests = userData.requestsLeft;

            // Обновляем данные подписки
            if(userData.subscriptionExpiry) {
                const remainingSeconds = getTimeRemainingInSeconds(userData.subscriptionExpiry);

                if (remainingSeconds > 0) {
                    commandData.hasSubscription = true;
                    commandData.subscriptionExpiry = userData.subscriptionExpiry;
                }
            }
        }
        else {
            logger.error(`Не удалось найти пользователя с telegram ID: ${telegramId}`);

            await ctx.reply("Произошла ошибка при обработке вашей команды, попробуйте нажать /start.");

            return;
        }
    } catch (error) {
        logger.error(`Ошибка при обработке пользователя: ${(error as Error).message}`);

        await ctx.reply("Произошла ошибка при обработке вашей команды. Попробуйте позже.");

        return;
    }

    // Второе сообщение: проверка подписки и доступных запросов
    if (commandData.hasSubscription) {
        const days = pluralize(getTimeRemainingInDays(commandData.subscriptionExpiry), "день", "дня", "дней");

        if(getTimeRemainingInDays(commandData.subscriptionExpiry) > 0) {
            await ctx.reply(
                `У вас активна подписка ещё ${getTimeRemainingInDays(commandData.subscriptionExpiry).toString()} ${days}. ✨`
            );
        }
        else {
            await ctx.reply(
                `У вас активна подписка ещё ${getTimeRemainingInHMS(commandData.subscriptionExpiry) ?? '0 дней'}. ✨`
            );
        }
    }
    else if (commandData.freeRequests > 0) {
        const free = pluralize(commandData.freeRequests, "бесплатный", "бесплатных", "бесплатных");
        const requests = pluralize(commandData.freeRequests, "запрос", "запроса", "запросов");

        await ctx.reply(
            `У вас нет активной подписки, но вам доступно ${commandData.freeRequests} ${free} ${requests}. ✨`
        );
    }
    else {
        await ctx.reply(
            "У вас нет активной подписки, и доступные запросы закончились.\n\n" +
            "Чтобы продолжить пользоваться сервисом:\n\n" +
            "🔹 Оформите подписку.\n" +
            "🔹 Купите дополнительные запросы.\n" +
            "🔹 Пригласите друзей через нашу реферальную программу.\n" +
            "🔹 Подпишитесь на наши каналы и получите дополнительные запросы.\n\n" +
            "Если возникнут вопросы, техподдержка всегда на связи: @bot_lovemyself. 💫"
        );
    }

    // Третье сообщение: предложение начать расклад
    if (commandData.hasSubscription || commandData.freeRequests > 0) {
        await ctx.reply("Напишите свой вопрос картам, чтобы начать расклад:");

        if(!sessionStateManager.getSessionState(telegramId)) {
            sessionStateManager.setSession(telegramId);
        }

        // Обновляем статус сессии
        sessionStateManager.updateSessionState(telegramId, {currentStep: SessionStepsEnum.QUESTION_INPUT});
    }
}