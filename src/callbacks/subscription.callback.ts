import { internationalPaymentButtons } from "@constants/buttons.const";
import { Context } from "grammy";

export const subscribeCallback = async (ctx: Context) => {
    const data = ctx.callbackQuery?.data;

    switch (data) {
        case "subscribe_10_requests":
            await ctx.reply("Вы выбрали подписку: 10 запросов за 199 рублей.");
            break;
        case "subscribe_30_requests":
            await ctx.reply("Вы выбрали подписку: 30 запросов за 349 рублей.");
            break;
        case "subscribe_1_day":
            await ctx.reply("Вы выбрали подписку: 1 день (безлимит) за 499 рублей.");
            break;
        case "subscribe_7_days":
            await ctx.reply("Вы выбрали подписку: 7 дней (безлимит) за 699 рублей.");
            break;
        case "subscribe_30_days":
            await ctx.reply("Вы выбрали подписку: 30 дней (безлимит) за 999 рублей.");
            break;
        default:
            await ctx.reply("Неизвестная команда подписки. Попробуйте снова.");
            break;
    }

    await ctx.answerCallbackQuery();
}

export const internationalPaymentCallback = async (ctx: Context) => {
    // Сообщение с инструкциями для международной оплаты
    await ctx.reply(
        "Оплатить подписку Telegram Stars\n\nВыберите подходящий вариант оплаты:",
        {
            reply_markup: internationalPaymentButtons,
        }
    );

    // Закрываем всплывающее уведомление, если нужно
    await ctx.answerCallbackQuery();
};

export const handleInternationalSubscription = async (ctx: Context) => {
    const data = ctx.callbackQuery?.data;

    switch (data) {
        case "international_subscribe_10_requests":
            await ctx.reply("Вы выбрали международную подписку: 10 запросов за 119 ⭐️. Ожидайте инструкций для оплаты.");
            break;
        case "international_subscribe_30_requests":
            await ctx.reply("Вы выбрали международную подписку: 30 запросов за 179 ⭐️. Ожидайте инструкций для оплаты.");
            break;
        case "international_subscribe_1_day":
            await ctx.reply("Вы выбрали международную подписку: 1 день (безлимит) за 299 ⭐️. Ожидайте инструкций для оплаты.");
            break;
        case "international_subscribe_7_days":
            await ctx.reply("Вы выбрали международную подписку: 7 дней (безлимит) за 399 ⭐️. Ожидайте инструкций для оплаты.");
            break;
        case "international_subscribe_30_days":
            await ctx.reply("Вы выбрали международную подписку: 30 дней (безлимит) за 599 ⭐️. Ожидайте инструкций для оплаты.");
            break;
        default:
            await ctx.reply("Неизвестная команда для международной подписки.");
            break;
    }

    // Закрываем всплывающее уведомление
    await ctx.answerCallbackQuery();
};