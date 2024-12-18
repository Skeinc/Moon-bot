import { checkTelegramID } from "@utils/checkTelegramID.util";
import { pluralize } from "@utils/pluralize.util";
import { Context } from "grammy";
import { referralStateManager } from "../states/referralState";
import { userStateManager } from "../states/userState";
import { logger } from "@services/logger.service";
import { ReferralService } from "@services/referral.service";
import { ReferralInterface } from "@interfaces/api/referral.interface";
import { UserInterface } from "@interfaces/api/user.interface";
import { UserService } from "@services/user.service";
import { UserStateInterface } from "@interfaces/states/userState.interface";

export const referralCallback = async (ctx: Context) => {
    const data = ctx.callbackQuery?.data;

    if(!await checkTelegramID(ctx)) {
        return;
    }
    
    // Данные пользователя
    const telegramId = ctx.from?.id!;
    let userData: UserInterface | UserStateInterface | undefined | null = userStateManager.getUserState(telegramId);

    // Данные необходимые для обработки команды
    const commandData = {
        referralQuantity: 0,
    };

    if(userData) {
        // Определяем сколько пользователей пригласил пользователь
        try {
            const referralsData: ReferralInterface[] | null = await ReferralService.getReferralsByReferrerId(userData.id);

            if(referralsData) {
                commandData.referralQuantity = referralsData.length;
            }
            else {
                logger.error(`Не удалось найти рефералов с ID: ${userData.id}`);

                await ctx.reply("Произошла ошибка при обработке вашей команды. Попробуйте позже.");
            }
        } catch (error) {
            logger.error(`Ошибка при обработке пользователя: ${(error as Error).message}`);

            await ctx.reply("Произошла ошибка при обработке вашей команды. Попробуйте позже.");

            return;
        }
    }
    else {
        userData = await UserService.getUserByTelegramId(telegramId);

        if (userData) {
            // Определяем сколько пользователей пригласил пользователь
            try {
                const referralsData: ReferralInterface[] | null = await ReferralService.getReferralsByReferrerId(userData.id);

                if(referralsData) {
                    commandData.referralQuantity = referralsData.length;
                }
                else {
                    logger.error(`Не удалось найти рефералов с ID: ${userData.id}`);

                    await ctx.reply("Произошла ошибка при обработке вашей команды. Попробуйте позже.");
                }
            } catch (error) {
                logger.error(`Ошибка при обработке пользователя: ${(error as Error).message}`);

                await ctx.reply("Произошла ошибка при обработке вашей команды. Попробуйте позже.");

                return;
            }
        } 
        else {
            logger.error(`Не удалось найти пользователя с telegram ID: ${telegramId}`);

            await ctx.reply("Произошла ошибка при обработке вашего расклада, попробуйте нажать /start.");

            return;
        }
    }

    switch (data) {
        case "generate_referral_link":
            // Создаем реферальную систему в storage
            referralStateManager.initReferralState(telegramId, true, userData.referralLink, commandData.referralQuantity);

            await ctx.reply(`Ваша реферальная ссылка: ${userData.referralLink}`);
            break;
        case "get_referral_link":
            // Обновляем реферальную систему в storage
            referralStateManager.updateReferralState(telegramId, { referredUsers: commandData.referralQuantity });

            await ctx.reply(`Ваша реферальная ссылка: ${userData.referralLink}`);
            break;
        case "my_bonuses":
            const invites = pluralize(commandData.referralQuantity, "приглашенный", "приглашенных", "приглашенных");
            const users = pluralize(commandData.referralQuantity, "пользователь", "пользователя", "пользователей");
            const requests = pluralize(commandData.referralQuantity, "запрос", "запроса", "запросов");
            const bonus = pluralize(commandData.referralQuantity, "бонусный", "бонусных", "бонусных");

            await ctx.reply(
                `У вас ${commandData.referralQuantity} ${invites} ${users}, вы получили ${commandData.referralQuantity} ${bonus} ${requests}.`
            );
            break;
        default:
            await ctx.reply("Неизвестная команда рефералки.");
            break;
    }

    await ctx.answerCallbackQuery();
}