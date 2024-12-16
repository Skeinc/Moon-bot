import { backToMenu } from "@actions/menu.action";
import { emptyReferralButtons, hasReferralButtons } from "@constants/buttons.const";
import { checkTelegramID } from "@utils/checkTelegramID.util";
import { Context } from "grammy"

export const referralCommand = async (ctx: Context) => {
    if(!await checkTelegramID(ctx)) {
        return;
    }
    
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

    await backToMenu(ctx);
}