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

    // Получаем данные пользователя
    if (!userData) {
        try {
            userData = await UserService.getUserByTelegramId(telegramId);

            if (userData) {
                userStateManager.initializeUser({
                    id: userData.id,
                    telegramId: userData.telegramId,
                    username: userData.username,
                    roleId: userData.roleId,
                    requestsLeft: userData.requestsLeft,
                    subscriptionExpiry: userData.subscriptionExpiry,
                    referrerId: userData.referrerId,
                    referralLink: userData.referralLink,
                });
            } 
            else {
                await ctx.reply(`
🚧 *Пользователь не найден!*  
Мы не смогли найти ваш аккаунт в системе.  
Попробуйте нажать /start и начать сначала.
`.trim(), { parse_mode: "Markdown" });

                return;
            }
        } catch (error) {
            logger.error(`Ошибка получения данных пользователя: ${(error as Error).message}`);

            await ctx.reply(`
🚧 *Ошибка сервера!*  
Мы не смогли обработать ваш запрос. Попробуйте позже.
`.trim(), { parse_mode: "Markdown" });

            return;
        }
    }

    // Определяем количество рефералов
    let referralQuantity = 0;

    try {
        const referralsData: ReferralInterface[] | null = await ReferralService.getReferralsByReferrerId(userData.id);

        referralQuantity = referralsData ? referralsData.length : 0;
    } catch (error) {
        logger.error(`Ошибка получения рефералов пользователя: ${(error as Error).message}`);

        await ctx.reply(`
🚧 *Ошибка сервера!*  
Мы не смогли проверить ваши рефералы. Попробуйте позже.
`.trim(), { parse_mode: "Markdown" });

        return;
    }

    switch (data) {
        case "generate_referral_link":
            // Инициализируем реферальную систему в storage
            referralStateManager.initReferralState(telegramId, true, userData.referralLink, referralQuantity);

            await ctx.reply(`
🔗 Ваша реферальная ссылка:
${userData.referralLink}  
Приглашайте друзей, чтобы получать бонусы! 🎉
`.trim());

            break;
        case "get_referral_link":
            // Обновляем реферальную систему в storage
            referralStateManager.updateReferralState(telegramId, { referredUsers: referralQuantity });

            await ctx.reply(`
🔗 Ваша реферальная ссылка:  
${userData.referralLink}  
Поделитесь ею, чтобы получать бонусы за приглашенных пользователей! 🎉
`.trim());

            break;
        case "my_bonuses":
            const invites = pluralize(referralQuantity, "приглашенный", "приглашенных", "приглашенных");
            const users = pluralize(referralQuantity, "пользователь", "пользователя", "пользователей");
            const requests = pluralize(referralQuantity, "запрос", "запроса", "запросов");
            const bonus = pluralize(referralQuantity, "бонусный", "бонусных", "бонусных");

            await ctx.reply(`
🎁 *Ваши бонусы:*  
- Вы пригласили: *${referralQuantity}* ${invites} ${users}.  
- Получено бонусов: *${referralQuantity}* ${bonus} ${requests}.  
                
Спасибо за использование нашей реферальной программы! 🌟
`.trim(), { parse_mode: "Markdown" });

            break;
        default:
            await ctx.reply(`
❓ *Неизвестная команда!*  
Пожалуйста, попробуйте снова или обратитесь в поддержку, если проблема сохраняется.
`.trim(), { parse_mode: "Markdown" });

            break;
    }

    await ctx.answerCallbackQuery();
}