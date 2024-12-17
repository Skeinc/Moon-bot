import { checkTelegramID } from "@utils/checkTelegramID.util";
import { pluralize } from "@utils/pluralize.util";
import { Context } from "grammy";
import { referralStateManager } from "../states/referralState";
import { userStateManager } from "../states/userState";
import { logger } from "@services/logger.service";
import { ReferralService } from "@services/referral.service";
import { ReferralInterface } from "@interfaces/api/referral.interface";
import { sessionStateManager } from "../states/sessionState";

export const referralCallback = async (ctx: Context) => {
    const data = ctx.callbackQuery?.data;

    if(!await checkTelegramID(ctx)) {
        return;
    }
    
    // Данные пользователя
    const telegramId = ctx.from?.id!;
    const userStateData = userStateManager.getUserState(telegramId);

    // Данные необходимые для обработки команды
    const commandData = {
        referralQuantity: 0,
    };

    if(userStateData) {
        // Определяем сколько пользователей пригласил пользователь
        try {
            const referralsData: ReferralInterface[] | null = await ReferralService.getReferralsByReferrerId(userStateData.id);

            if(referralsData) {
                commandData.referralQuantity = referralsData.length;
            }
            else {
                logger.error(`Не удалось найти рефералов с ID: ${userStateData.id}`);

                await ctx.reply("Произошла ошибка при обработке вашей команды. Попробуйте позже.");
            }
        } catch (error) {
            logger.error(`Ошибка при обработке пользователя: ${(error as Error).message}`);

            await ctx.reply("Произошла ошибка при обработке вашей команды. Попробуйте позже.");

            return;
        }
    }
    else {
        await ctx.reply("Произошла ошибка при обработке вашей команды, попробуйте нажать /start.");

        return;
    }

    switch (data) {
        case "generate_referral_link":
            // Создаем реферальную систему в storage
            referralStateManager.initReferralState(telegramId, true, userStateData.referralLink, commandData.referralQuantity);

            await ctx.reply(`Ваша реферальная ссылка: ${userStateData.referralLink}`);
            break;
        case "get_referral_link":
            // Обновляем реферальную систему в storage
            referralStateManager.updateReferralState(telegramId, { referredUsers: commandData.referralQuantity });

            await ctx.reply(`Ваша реферальная ссылка: ${userStateData.referralLink}`);
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