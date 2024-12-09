import { backToMenu } from "@actions/menu.action";
import { subscriptionButtons } from "@constants/buttons.const";
import { Context } from "grammy";

export const subscriptionCommand = async (ctx: Context) => {
    // Тестовые данные
    const hasActiveSubscription: boolean = false;
    const daysLeft: number = 3;

    if (!hasActiveSubscription) {
        // Если подписки нет
        const subscriptionDescription = `
💳 **Международная оплата через TelegramStars**

После оплаты ваш баланс обновится в течение **1–2 минут**.

Если этого не произошло, свяжитесь с поддержкой.
        `;

        await ctx.reply(subscriptionDescription, {
            reply_markup: subscriptionButtons,
            parse_mode: "Markdown",
        });

        await backToMenu(ctx);
    } else {
        // Если подписка активна
        const subscriptionDescription = `
👤 **У вас уже есть активная подписка!**

⏳ **Осталось ${daysLeft} дней до её окончания.**
        `;

        await backToMenu(ctx, subscriptionDescription);
    }
}