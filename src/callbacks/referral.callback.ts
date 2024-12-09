import { pluralize } from "@utils/pluralize.util";
import { Context } from "grammy";

export const referralCallback = async (ctx: Context) => {
    const data = ctx.callbackQuery?.data;

    // Переменные для теста
    const referralQuantity: number = 3;

    switch (data) {
        case "generate_referral_link":
            await ctx.reply("Ваша реферальная ссылка: https://t.me/MoonBot?start=referral123");
            break;
        case "get_referral_link":
            await ctx.reply("Ваша реферальная ссылка: https://t.me/MoonBot?start=referral123");
            break;
        case "my_bonuses":
            const requests = pluralize(referralQuantity, "запрос", "запроса", "запросов");
            
            await ctx.reply(`У вас ${referralQuantity} приглашенных пользователей, вы получили ${referralQuantity} ${requests}.`);
            break;
        default:
            await ctx.reply("Неизвестная команда рефералки.");
            break;
    }

    await ctx.answerCallbackQuery();
}