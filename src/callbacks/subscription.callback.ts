import { TariffService } from "@services/tariffs.service";
import { Context, InlineKeyboard } from "grammy";
import { logger } from "@services/logger.service";
import { PaymentService } from "@services/payment.service";
import { TariffInterface } from "@interfaces/api/tariff.interface";
import { UserInterface } from "@interfaces/api/user.interface";
import { UserStateInterface } from "@interfaces/states/userState.interface";
import { userStateManager } from "../states/userState";
import { checkTelegramID } from "@utils/checkTelegramID.util";
import { UserService } from "@services/user.service";
import { TransactionInterface } from "@interfaces/api/transaction.interface";
import { TransactionService } from "@services/transaction.service";
import { CurrencyEnum } from "../enums/currency.enum";
import { TransactionStatusesEnum, TransactionTypesEnum } from "../enums/transaction.enum";
import { InternationalSubscribeCallbacksEnum, SubscribeCallbacksEnum } from "../enums/subscription.enum";
import { getTransactionTypeByCallback } from "@utils/getTransactionTypeByCallback.util";

export const subscribeCallback = async (ctx: Context) => {
    if (!await checkTelegramID(ctx)) {
        return;
    }

    const data = ctx.callbackQuery?.data;
    const telegramId = ctx.from?.id!;

    if (!data) {
        await ctx.reply("Неизвестная команда. Попробуйте снова.");

        return;
    }

    // Данные для оплаты
    let amount: string = "";
    let description: string = "";

    switch (data) {
        case SubscribeCallbacksEnum.SUBSCRIBE_10_REQUESTS:
            await ctx.reply("🎉 Вы выбрали подписку: 10 запросов за 199 рублей. Ожидайте инструкций для оплаты.");
            amount = "199.00";
            description = "Подписка: 10 запросов";

            break;
        case SubscribeCallbacksEnum.SUBSCRIBE_30_REQUESTS:
            await ctx.reply("🎉 Вы выбрали подписку: 30 запросов за 349 рублей. Ожидайте инструкций для оплаты.");
            amount = "349.00";
            description = "Подписка: 30 запросов";

            break;
        case SubscribeCallbacksEnum.SUBSCRIBE_1_DAY:
            await ctx.reply("🎉 Вы выбрали подписку: 1 день (безлимит) за 499 рублей. Ожидайте инструкций для оплаты.");
            amount = "499.00";
            description = "Подписка: 1 день (безлимит)";
            
            break;
        case SubscribeCallbacksEnum.SUBSCRIBE_7_DAYS:
            await ctx.reply("🎉 Вы выбрали подписку: 7 дней (безлимит) за 699 рублей. Ожидайте инструкций для оплаты.");
            amount = "699.00";
            description = "Подписка: 7 дней (безлимит)";

            break;
        case SubscribeCallbacksEnum.SUBSCRIBE_30_DAYS:
            await ctx.reply("🎉 Вы выбрали подписку: 30 дней (безлимит) за 999 рублей. Ожидайте инструкций для оплаты.");
            amount = "999.00";
            description = "Подписка: 30 дней (безлимит)";

            break;
        default:
            await ctx.reply("Неизвестная команда подписки. Попробуйте снова.");
            await ctx.answerCallbackQuery();

            break;
    }

    try {
        // Получение данных тарифа
        const tariffData: TariffInterface | null = await TariffService.getTariffByCallback(data);

        if (!tariffData) {
            await ctx.reply(`
🚧 *Произошла ошибка!*  
Мы не смогли найти информацию о выбранном тарифе.  
Попробуйте позже или обратитесь в поддержку. 🙏
`.trim(), { parse_mode: "Markdown" });

            return;
        }

        // Получение данных пользователя
        let userData: UserInterface | UserStateInterface | undefined | null = userStateManager.getUserState(telegramId);

        if(!userData) {
            userData = await UserService.getUserByTelegramId(telegramId);

            if(!userData) {
                await ctx.reply(`
🚧 *Произошла ошибка!*  
Мы не смогли найти информацию о вас.  
Попробуйте позже или обратитесь в поддержку. 🙏
`.trim(), { parse_mode: "Markdown" });
                    
                return;
            }
        }

        // Создание платежа через YooKassa
        const paymentResponse = await PaymentService.createPaymentWithYooKassa({ amount, description });

        if (paymentResponse?.confirmation?.confirmation_url) {
            // Создаем транзакцию
            const createdTransactionData: TransactionInterface | null = await TransactionService.createTransaction(
                userData.id, amount, CurrencyEnum.RUB, getTransactionTypeByCallback(data! as SubscribeCallbacksEnum), TransactionStatusesEnum.PENDING, 1, tariffData.id, paymentResponse.id,
            );

            if(!createdTransactionData) {
                await ctx.reply(`
🚧 *Произошла ошибка!*  
Мы не смогли создать транзакцию.  
Попробуйте позже или обратитесь в поддержку. 🙏
`.trim(), { parse_mode: "Markdown" });
                    
                return;
            }

            // Выводим инструкцию для оплаты пользователю
            const paymentKeyboard = new InlineKeyboard().url(
                "💳 Перейти к оплате",
                paymentResponse.confirmation.confirmation_url
            );

            await ctx.reply(
            "💳 Для завершения оплаты нажмите на кнопку ниже:",
            {
                reply_markup: paymentKeyboard,
            }
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