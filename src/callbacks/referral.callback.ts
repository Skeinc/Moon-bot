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
            const invites = pluralize(referralQuantity, "приглашенный", "приглашенных", "приглашенных");
            const users = pluralize(referralQuantity, "пользователь", "пользователя", "пользователей");
            const requests = pluralize(referralQuantity, "запрос", "запроса", "запросов");
            const bonus = pluralize(referralQuantity, "бонусный", "бонусных", "бонусных");

            await ctx.reply(
                `У вас ${referralQuantity} ${invites} ${users}, вы получили ${referralQuantity} ${bonus} ${requests}.`
            );
            break;
        default:
            await ctx.reply("Неизвестная команда рефералки.");
            break;
    }

    await ctx.answerCallbackQuery();
}