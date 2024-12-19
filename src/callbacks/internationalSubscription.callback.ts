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
            
            await ctx.reply("🌟 Вы выбрали международную подписку: 10 запросов за 119 ⭐️. Ожидайте инструкций для оплаты.");
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

            await ctx.reply("🌟 Вы выбрали международную подписку: 30 запросов за 179 ⭐️. Ожидайте инструкций для оплаты.");
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

            await ctx.reply("🌟 Вы выбрали международную подписку: 1 день (безлимит) за 299 ⭐️. Ожидайте инструкций для оплаты.");
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

            await ctx.reply("🌟 Вы выбрали международную подписку: 7 дней (безлимит) за 399 ⭐️. Ожидайте инструкций для оплаты.");
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

            await ctx.reply("🌟 Вы выбрали международную подписку: 30 дней (безлимит) за 599 ⭐️. Ожидайте инструкций для оплаты.");
            break;
        default:
            await ctx.reply("Неизвестная команда для международной подписки.");
            break;
    }

    // Закрываем всплывающее уведомление
    await ctx.answerCallbackQuery();
};