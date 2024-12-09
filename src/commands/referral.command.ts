import { emptyReferralButtons, hasReferralButtons } from "@constants/buttons.const";
import { backToMenuKeyboard } from "@constants/keyboards.const";
import { Context } from "grammy"

export const referralCommand = async (ctx: Context) => {
    // Тестовые переменные
    const hasReferral: boolean = true;

    const referralDescription = `
👥 **Пригласи друзей и получи бонусы!**
За каждого приглашенного друга вы получаете **1 бесплатный запрос**. Чем больше друзей вы пригласите, тем больше запросов сможете сделать!
Поделитесь ссылкой и начните зарабатывать запросы прямо сейчас! 🌟
    `;

    if (!hasReferral) {
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

    await ctx.reply("Выберите действие из меню ниже:", {
        reply_markup: {
            keyboard: backToMenuKeyboard.build(),
            resize_keyboard: true,
            is_persistent: true,
        },
        parse_mode: "Markdown",
    });
}