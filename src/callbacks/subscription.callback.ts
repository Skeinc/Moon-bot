import { TariffInterface } from "@interfaces/api/tariff.interface";
import { TariffService } from "@services/tariffs.service";
import { Context, InlineKeyboard } from "grammy";
import { PaymentMethodsEnum } from "../enums/paymentMethod.enum";
import { createSubscriptionButtons } from "@utils/generateSubscriptionButtons.util";
import { logger } from "@services/logger.service";
import { PaymentService } from "@services/payment.service";

export const subscribeCallback = async (ctx: Context) => {
    const data = ctx.callbackQuery?.data;

    // Данные для оплаты
    let amount: string = "";
    let description: string = "";

    switch (data) {
        case "subscribe_10_requests":
            await ctx.reply("Вы выбрали подписку: 10 запросов за 199 рублей. Ожидайте инструкций для оплаты.");
            amount = "199.00";
            description = "Подписка: 10 запросов";

            break;
        case "subscribe_30_requests":
            await ctx.reply("Вы выбрали подписку: 30 запросов за 349 рублей. Ожидайте инструкций для оплаты.");
            amount = "349.00";
            description = "Подписка: 30 запросов";

            break;
        case "subscribe_1_day":
            await ctx.reply("Вы выбрали подписку: 1 день (безлимит) за 499 рублей. Ожидайте инструкций для оплаты.");
            amount = "499.00";
            description = "Подписка: 1 день (безлимит)";
            
            break;
        case "subscribe_7_days":
            await ctx.reply("Вы выбрали подписку: 7 дней (безлимит) за 699 рублей. Ожидайте инструкций для оплаты.");
            amount = "699.00";
            description = "Подписка: 7 дней (безлимит)";

            break;
        case "subscribe_30_days":
            await ctx.reply("Вы выбрали подписку: 30 дней (безлимит) за 999 рублей. Ожидайте инструкций для оплаты.");
            amount = "999.00";
            description = "Подписка: 30 дней (безлимит)";

            break;
        default:
            await ctx.reply("Неизвестная команда подписки. Попробуйте снова.");
            await ctx.answerCallbackQuery();

            break;
    }

    try {
        // Создание платежа через YooKassa
        const paymentResponse = await PaymentService.createPaymentWithYooKassa({ amount, description });

        if (paymentResponse?.confirmation?.confirmation_url) {
            await ctx.reply(
                `Для завершения оплаты перейдите по ссылке:\n\n${paymentResponse.confirmation.confirmation_url}`
            );
        } else {
            await ctx.reply("Не удалось создать платеж. Попробуйте позже.");
        }
    } catch (error) {
        await ctx.reply("Произошла ошибка при обработке вашего запроса. Попробуйте позже.");

        logger.error(`Ошибка при создании платежа: ${(error as Error).message}`);
    }

    await ctx.answerCallbackQuery();
}

export const internationalPaymentCallback = async (ctx: Context) => {
    let internationalSubscriptionKeyboard: InlineKeyboard;

    // Получение списка тарифов
    try {
        const tariffsData: TariffInterface[] | null = await TariffService.getTariffsByPaymentMethod(PaymentMethodsEnum.TELEGRAM_STARS);

        if(tariffsData && tariffsData.length > 0) {
            // Создаем клавиатуру на основе полученных данных
            internationalSubscriptionKeyboard = createSubscriptionButtons(tariffsData, PaymentMethodsEnum.TELEGRAM_STARS);

            // Сообщение с инструкциями для международной оплаты
            await ctx.reply(
                "Оплатить подписку Telegram Stars\n\nВыберите подходящий вариант оплаты:",
                {
                    reply_markup: internationalSubscriptionKeyboard,
                }
            );
        }
        else {
            logger.error(`Не удалось найти тарифы по способу оплаты: ${PaymentMethodsEnum.TELEGRAM_STARS}`);

            await ctx.reply("Не удалось найти подходящие тарифы. Попробуйте позже.");
        }
    } catch (error) {
        logger.error(`Ошибка при поиске тарифов по способу оплаты: ${(error as Error).message}`);

        await ctx.reply("Произошла ошибка при обработке вашей команды. Попробуйте позже.");

        return;
    }

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