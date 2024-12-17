import { backToMenu } from "@actions/menu.action";
import { TariffInterface } from "@interfaces/api/tariff.interface";
import { UserInterface } from "@interfaces/api/user.interface";
import { logger } from "@services/logger.service";
import { TariffService } from "@services/tariffs.service";
import { UserService } from "@services/user.service";
import { checkTelegramID } from "@utils/checkTelegramID.util";
import { getTimeRemainingInDays, getTimeRemainingInHMS, getTimeRemainingInSeconds } from "@utils/date.util";
import { pluralize } from "@utils/pluralize.util";
import { Context, InlineKeyboard } from "grammy";
import { PaymentMethodsEnum } from "../enums/paymentMethod.enum";
import { createSubscriptionButtons } from "@utils/generateSubscriptionButtons.util";

export const subscriptionCommand = async (ctx: Context) => {
    if(!await checkTelegramID(ctx)) {
        return;
    }

    // Данные пользователя
    const telegramId = ctx.from?.id!;
    
    // Данные необходимые для обработки команды
    const commandData = {
        hasActiveSubscription: false,
        subscriptionExpiry: '',
    };

    try {
        const userData: UserInterface | null = await UserService.getUserByTelegramId(telegramId);

        if(userData) {
            // Обновляем данные подписки
            if(userData.subscriptionExpiry) {
                const remainingSeconds = getTimeRemainingInSeconds(userData.subscriptionExpiry);

                if (remainingSeconds > 0) {
                    commandData.hasActiveSubscription = true;
                    commandData.subscriptionExpiry = userData.subscriptionExpiry;
                }
            }
        }
        else {
            logger.error(`Не удалось найти пользователя с telegram ID: ${telegramId}`);

            await ctx.reply("Произошла ошибка при обработке вашей команды, попробуйте нажать /start.");
        }
    } catch (error) {
        logger.error(`Ошибка при обработке пользователя: ${(error as Error).message}`);

        await ctx.reply("Произошла ошибка при обработке вашей команды. Попробуйте позже.");

        return;
    }

    if (!commandData.hasActiveSubscription) {
        let subscriptionKeyboard: InlineKeyboard;

        // Если подписки нет
        const subscriptionDescription = `
💳 **Международная оплата через TelegramStars**

После оплаты ваш баланс обновится в течение **1–2 минут**.

Если этого не произошло, свяжитесь с поддержкой.
        `;

        // Получение списка тарифов
        try {
            const tariffsData: TariffInterface[] | null = await TariffService.getTariffsByPaymentMethod(PaymentMethodsEnum.UKASSA);

            if(tariffsData && tariffsData.length > 0) {
                // Создаем клавиатуру на основе полученных данных
                subscriptionKeyboard = createSubscriptionButtons(tariffsData, PaymentMethodsEnum.UKASSA);

                await ctx.reply(subscriptionDescription, {
                    reply_markup: subscriptionKeyboard,
                    parse_mode: "Markdown",
                });
            }
            else {
                logger.error(`Не удалось найти тарифы по способу оплаты: ${PaymentMethodsEnum.UKASSA}`);

                await ctx.reply("Не удалось найти подходящие тарифы. Попробуйте позже.");
            }
        } catch (error) {
            logger.error(`Ошибка при поиске тарифов по способу оплаты: ${(error as Error).message}`);

            await ctx.reply("Произошла ошибка при обработке вашей команды. Попробуйте позже.");

            return;
        }

        await backToMenu(ctx);
    } else {
        const days = pluralize(getTimeRemainingInDays(commandData.subscriptionExpiry), "день", "дня", "дней");
        
        // Если подписка активна
        const subscriptionDescription = `
👤 **У вас уже есть активная подписка!**

⏳ **Осталось ${getTimeRemainingInDays(commandData.subscriptionExpiry) > 0 ? (getTimeRemainingInDays(commandData.subscriptionExpiry) + ' ' + days) : getTimeRemainingInHMS(commandData.subscriptionExpiry)} до её окончания.**
        `;

        await backToMenu(ctx, subscriptionDescription);
    }
}