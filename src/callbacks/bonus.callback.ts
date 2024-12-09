import { Context } from "grammy";

export const checkSubscriptionCallback = async (ctx: Context) => {
    // Переменные для теста
    const isSubscribed: boolean = true;

    await ctx.answerCallbackQuery({
        text: "Проверяем вашу подписку... ⏳",
    });

    if (isSubscribed) {
        await ctx.reply("Вы успешно подписаны на наш канал. 🎉");
    } else {
        await ctx.reply("Вы не подписаны на канал. Пожалуйста, подпишитесь, чтобы продолжить. 🙏");
    }
}