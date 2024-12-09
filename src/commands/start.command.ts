import { getMenuKeyboard } from "@constants/keyboards.const";
import { Context } from "grammy";

export const startCommand = async (ctx: Context) => {
    // Переменные для теста
    const freeRequests = 3;
    const hasSubscription = false;
    const subscriptionDaysLeft = 0;

    // Первое сообщение
    await ctx.reply(
        "Привет! Я здесь, чтобы помочь тебе разобраться в твоем раскладе по колоде ТАРО МАНАРА.\n\n" +
        "✅ Напиши свой вопрос для расклада.\n" +
        "✅ Выбери карты.\n\n" +
        "🎁 Новым пользователям доступно 3 бесплатных запроса!\n\n" +
        "С любовью, твой персональный таролог Moon. 💫\n\n" +
        "P.S. Если что-то пошло не так, попробуй нажать /start.\n" +
        "Меню находится внизу, рядом с полем для ввода текста.\n\n" +
        "Для связи с техподдержкой: @bot_lovemyself.", {
            reply_markup: {
                keyboard: getMenuKeyboard().build(),
                resize_keyboard: true,
                is_persistent: true,
            },
        }
    );

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
};