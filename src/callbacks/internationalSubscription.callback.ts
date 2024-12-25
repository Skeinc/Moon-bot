import { TariffInterface } from "@interfaces/api/tariff.interface";
import { TariffService } from "@services/tariffs.service";
import { createSubscriptionButtons } from "@utils/generateSubscriptionButtons.util";
import { Context, InlineKeyboard } from "grammy";
import { PaymentMethodsEnum } from "../enums/paymentMethod.enum";
import { logger } from "@services/logger.service";
import { InternationalSubscribeCallbacksEnum } from "../enums/subscription.enum";
import { UserInterface } from "@interfaces/api/user.interface";
import { UserStateInterface } from "@interfaces/states/userState.interface";
import { userStateManager } from "../states/userState";
import { UserService } from "@services/user.service";
import { getTimeRemainingInHMS, getTimeRemainingInSeconds } from "@utils/date.util";
import { TelegramPaymentInterface } from "@interfaces/telegram/payment.interface";
import { CurrencyEnum } from "../enums/currency.enum";
import { PaymentService } from "@services/payment.service";
import { TransactionInterface } from "@interfaces/api/transaction.interface";
import { TransactionService } from "@services/transaction.service";
import { getTransactionTypeByCallback } from "@utils/getTransactionTypeByCallback.util";
import { TransactionStatusesEnum } from "../enums/transaction.enum";

export const internationalPaymentCallback = async (ctx: Context) => {
    let internationalSubscriptionKeyboard: InlineKeyboard;

    // Получение списка тарифов
    try {
        const tariffsData: TariffInterface[] | null = await TariffService.getTariffsByPaymentMethod(PaymentMethodsEnum.TELEGRAM_STARS);

        if(tariffsData && tariffsData.length > 0) {
            // Создаем клавиатуру на основе полученных данных
            internationalSubscriptionKeyboard = createSubscriptionButtons(tariffsData, PaymentMethodsEnum.TELEGRAM_STARS);

            // Сообщение с инструкциями для международной оплаты
            await ctx.reply(`
🌍 *Международная оплата через Telegram Stars*  
Выберите подходящий вариант оплаты ниже:`,
                {
                    reply_markup: internationalSubscriptionKeyboard,
                    parse_mode: "Markdown",
                }
            );
        }
        else {
            logger.error(`Не удалось найти тарифы по способу оплаты: ${PaymentMethodsEnum.TELEGRAM_STARS}`);

            await ctx.reply(`
🚧 *Произошла ошибка!*  
Мы не смогли найти подходящие тарифы.  
Попробуйте позже или обратитесь в поддержку. 🙏
`.trim(), { parse_mode: "Markdown" });
        }
    } catch (error) {
        logger.error(`Ошибка при поиске тарифов по способу оплаты: ${(error as Error).message}`);

        await ctx.reply(`
🚧 *Произошла ошибка!*  
Мы не смогли обработать вашу команду.  
Попробуйте позже или обратитесь в поддержку. 🙏
`.trim(), { parse_mode: "Markdown" });

        return;
    }

    // Закрываем всплывающее уведомление, если нужно
    await ctx.answerCallbackQuery();
};

export const handleInternationalSubscription = async (ctx: Context) => {
    const data = ctx.callbackQuery?.data;
    const telegramId = ctx.from?.id!;

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

    let paymentDetails: TelegramPaymentInterface;
    let tariffData: TariffInterface | null;
    let transactionId: string;

    switch (data) {
        case InternationalSubscribeCallbacksEnum.SUBSCRIBE_10_REQUESTS:
            if(userData.subscriptionExpiry && getTimeRemainingInSeconds(userData.subscriptionExpiry) > 0) {
                await ctx.reply(`
🎉 У вас уже есть активная подписка!  
⏳ Время до окончания: ${getTimeRemainingInHMS(userData.subscriptionExpiry)}.
Вы можете продолжать использовать свои преимущества!
`.trim(), { parse_mode: "Markdown" });

                return;
            }

            transactionId = crypto.randomUUID()

            tariffData = await TariffService.getTariffByCallback(InternationalSubscribeCallbacksEnum.SUBSCRIBE_10_REQUESTS);

            if(tariffData) {
                paymentDetails = {
                    title: tariffData.name,
                    description: `Вы выбрали международную подписку: ${tariffData.name}`,
                    payload: transactionId,
                    currency: CurrencyEnum.TELEGRAM_STARS,
                    amount: Number(tariffData.price),
                };

                await ctx.reply("🌟 Пожалуйста, подождите, мы обрабатываем ваш платеж...");

                await PaymentService.createPaymentWithTelegram(ctx, telegramId, paymentDetails);

                await createTelegramTransaction(ctx, userData, tariffData, InternationalSubscribeCallbacksEnum.SUBSCRIBE_10_REQUESTS, tariffData.price, transactionId);
            }
            else {
                await ctx.reply(`
🚧 *Произошла ошибка!*  
Мы не смогли обработать платеж.  
Попробуйте позже или обратитесь в поддержку. 🙏
`.trim(), { parse_mode: "Markdown" });
            }

            break;
        case InternationalSubscribeCallbacksEnum.SUBSCRIBE_30_REQUESTS:
            if(userData.subscriptionExpiry && getTimeRemainingInSeconds(userData.subscriptionExpiry) > 0) {
                await ctx.reply(`
🎉 У вас уже есть активная подписка!  
⏳ Время до окончания: ${getTimeRemainingInHMS(userData.subscriptionExpiry)}.
Вы можете продолжать использовать свои преимущества!
`.trim(), { parse_mode: "Markdown" });

                return;
            }

            transactionId = crypto.randomUUID()

            tariffData = await TariffService.getTariffByCallback(InternationalSubscribeCallbacksEnum.SUBSCRIBE_30_REQUESTS);

            if(tariffData) {
                paymentDetails = {
                    title: tariffData.name,
                    description: `Вы выбрали международную подписку: ${tariffData.name}`,
                    payload: transactionId,
                    currency: CurrencyEnum.TELEGRAM_STARS,
                    amount: Number(tariffData.price),
                };

                await ctx.reply("🌟 Пожалуйста, подождите, мы обрабатываем ваш платеж...");

                await PaymentService.createPaymentWithTelegram(ctx, telegramId, paymentDetails);

                await createTelegramTransaction(ctx, userData, tariffData, InternationalSubscribeCallbacksEnum.SUBSCRIBE_30_REQUESTS, tariffData.price, transactionId);
            }
            else {
                await ctx.reply(`
🚧 *Произошла ошибка!*  
Мы не смогли обработать платеж.  
Попробуйте позже или обратитесь в поддержку. 🙏
`.trim(), { parse_mode: "Markdown" });
            }

            break;
        case InternationalSubscribeCallbacksEnum.SUBSCRIBE_1_DAY:
            if(userData.subscriptionExpiry && getTimeRemainingInSeconds(userData.subscriptionExpiry) > 0) {
                await ctx.reply(`
🎉 У вас уже есть активная подписка!  
⏳ Время до окончания: ${getTimeRemainingInHMS(userData.subscriptionExpiry)}.
Вы можете продолжать использовать свои преимущества!
`.trim(), { parse_mode: "Markdown" });

                return;
            }

            transactionId = crypto.randomUUID()

            tariffData = await TariffService.getTariffByCallback(InternationalSubscribeCallbacksEnum.SUBSCRIBE_1_DAY);

            if(tariffData) {
                paymentDetails = {
                    title: tariffData.name,
                    description: `Вы выбрали международную подписку: ${tariffData.name}`,
                    payload: transactionId,
                    currency: CurrencyEnum.TELEGRAM_STARS,
                    amount: Number(tariffData.price),
                };

                await ctx.reply("🌟 Пожалуйста, подождите, мы обрабатываем ваш платеж...");

                await PaymentService.createPaymentWithTelegram(ctx, telegramId, paymentDetails);

                await createTelegramTransaction(ctx, userData, tariffData, InternationalSubscribeCallbacksEnum.SUBSCRIBE_1_DAY, tariffData.price, transactionId);
            }
            else {
                await ctx.reply(`
🚧 *Произошла ошибка!*  
Мы не смогли обработать платеж.  
Попробуйте позже или обратитесь в поддержку. 🙏
`.trim(), { parse_mode: "Markdown" });
            }

            break;
        case InternationalSubscribeCallbacksEnum.SUBSCRIBE_7_DAYS:
            if(userData.subscriptionExpiry && getTimeRemainingInSeconds(userData.subscriptionExpiry) > 0) {
                await ctx.reply(`
🎉 У вас уже есть активная подписка!  
⏳ Время до окончания: ${getTimeRemainingInHMS(userData.subscriptionExpiry)}.
Вы можете продолжать использовать свои преимущества!
`.trim(), { parse_mode: "Markdown" });

                return;
            }

            transactionId = crypto.randomUUID()

            tariffData = await TariffService.getTariffByCallback(InternationalSubscribeCallbacksEnum.SUBSCRIBE_7_DAYS);

            if(tariffData) {
                paymentDetails = {
                    title: tariffData.name,
                    description: `Вы выбрали международную подписку: ${tariffData.name}`,
                    payload: transactionId,
                    currency: CurrencyEnum.TELEGRAM_STARS,
                    amount: Number(tariffData.price),
                };

                await ctx.reply("🌟 Пожалуйста, подождите, мы обрабатываем ваш платеж...");

                await PaymentService.createPaymentWithTelegram(ctx, telegramId, paymentDetails);

                await createTelegramTransaction(ctx, userData, tariffData, InternationalSubscribeCallbacksEnum.SUBSCRIBE_7_DAYS, tariffData.price, transactionId);
            }
            else {
                await ctx.reply(`
🚧 *Произошла ошибка!*  
Мы не смогли обработать платеж.  
Попробуйте позже или обратитесь в поддержку. 🙏
`.trim(), { parse_mode: "Markdown" });
            }

            break;
        case InternationalSubscribeCallbacksEnum.SUBSCRIBE_30_DAYS:
            if(userData.subscriptionExpiry && getTimeRemainingInSeconds(userData.subscriptionExpiry) > 0) {
                await ctx.reply(`
🎉 У вас уже есть активная подписка!  
⏳ Время до окончания: ${getTimeRemainingInHMS(userData.subscriptionExpiry)}.
Вы можете продолжать использовать свои преимущества!
`.trim(), { parse_mode: "Markdown" });

                return;
            }

            transactionId = crypto.randomUUID()

            tariffData = await TariffService.getTariffByCallback(InternationalSubscribeCallbacksEnum.SUBSCRIBE_30_DAYS);

            if(tariffData) {
                paymentDetails = {
                    title: tariffData.name,
                    description: `Вы выбрали международную подписку: ${tariffData.name}`,
                    payload: transactionId,
                    currency: CurrencyEnum.TELEGRAM_STARS,
                    amount: Number(tariffData.price),
                };

                await ctx.reply("🌟 Пожалуйста, подождите, мы обрабатываем ваш платеж...");

                await PaymentService.createPaymentWithTelegram(ctx, telegramId, paymentDetails);

                await createTelegramTransaction(ctx, userData, tariffData, InternationalSubscribeCallbacksEnum.SUBSCRIBE_30_DAYS, tariffData.price, transactionId);
            }
            else {
                await ctx.reply(`
🚧 *Произошла ошибка!*  
Мы не смогли обработать платеж.  
Попробуйте позже или обратитесь в поддержку. 🙏
`.trim(), { parse_mode: "Markdown" });
            }

            break;
        default:
            await ctx.reply("Неизвестная команда для международной подписки.");
            break;
    }

    // Закрываем всплывающее уведомление
    await ctx.answerCallbackQuery();
};

export const createTelegramTransaction = async (ctx: Context, userData: UserInterface | UserStateInterface, tariffData: TariffInterface, callback: InternationalSubscribeCallbacksEnum, amount: string, transactionId: string) => {
    try {
        // Создаем транзакцию
        const createdTransactionData: TransactionInterface | null = await TransactionService.createTransaction(
            userData.id, amount, CurrencyEnum.TELEGRAM_STARS, getTransactionTypeByCallback(callback), TransactionStatusesEnum.PENDING, 2, tariffData.id, transactionId
        );

        if(!createdTransactionData) {
            await ctx.reply(`
🚧 *Произошла ошибка!*  
Мы не смогли создать транзакцию.  
Попробуйте позже или обратитесь в поддержку. 🙏
`.trim(), { parse_mode: "Markdown" });
                
            return null;
        }

        return transactionId;
    } catch (error) {
        await ctx.reply("Произошла ошибка при обработке вашего запроса. Попробуйте позже.");

        logger.error(`Ошибка при создании платежа: ${(error as Error).message}`);

        return null;
    }
}