import { checkTelegramID } from "@utils/checkTelegramID.util";
import { Context } from "grammy";

export const newSpreadCommand = async (ctx: Context) => {
    if(!await checkTelegramID(ctx)) {
        return;
    }
    
    // Переменные для теста
    const freeRequests = 3;
    const hasSubscription = false;
    const subscriptionDaysLeft = 0;
    
    const userId = ctx.from?.id;

    if (!userId) {
        await ctx.reply("Не удалось определить ваш идентификатор. Попробуйте снова.");
        return;
    }

    // Второе сообщение: проверка подписки и доступных запросов
    if (hasSubscription) {
        await ctx.reply(
            `У вас активна подписка ещё ${subscriptionDaysLeft} дней. ✨`
        );
    }
    else if (freeRequests > 0) {
        await ctx.reply(
            `У вас нет активной подписки, но вам доступно ${freeRequests} бесплатных запроса. ✨`
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
    if (hasSubscription || freeRequests > 0) {
        await ctx.reply("Напишите свой вопрос картам, чтобы начать расклад:");
    }
}