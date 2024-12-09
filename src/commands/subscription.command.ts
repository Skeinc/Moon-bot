import { subscriptionButtons } from "@constants/buttons.const";
import { backToMenuKeyboard } from "@constants/keyboards.const";
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

        await ctx.reply("Выберите действие из меню ниже:", {
            reply_markup: {
                keyboard: backToMenuKeyboard.build(),
                resize_keyboard: true,
                is_persistent: true,
            },
            parse_mode: "Markdown",
        });
    } else {
        // Если подписка активна
        const subscriptionDescription = `
👤 **У вас уже есть активная подписка!**

⏳ **Осталось ${daysLeft} дней до её окончания.**
        `;

        await ctx.reply(subscriptionDescription, {
            reply_markup: {
                keyboard: backToMenuKeyboard.build(),
                resize_keyboard: true,
                is_persistent: true,
            },
            parse_mode: "Markdown",
        });
    }
}