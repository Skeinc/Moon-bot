import { UserInterface } from "@interfaces/api/user.interface";
import { UserStateInterface } from "@interfaces/states/userState.interface";
import { logger } from "@services/logger.service";
import { UserService } from "@services/user.service";
import { checkTelegramID } from "@utils/checkTelegramID.util";
import { Context } from "grammy";
import { userStateManager } from "../states/userState";
import { BonusInterface, CreateBonusInterface } from "@interfaces/api/bonus.interface";
import { BonusService } from "@services/bonus.service";
import { BonusTypeEnum } from "../enums/bonus.enum";

export const checkSubscriptionCallback = async (ctx: Context) => {
    if (!await checkTelegramID(ctx)) {
        return;
    }

    // ID канала
    const channelId = "@tarobotik";

    // Данные пользователя
    const telegramId = ctx.from?.id!;
    let userData: UserInterface | UserStateInterface | undefined | null = userStateManager.getUserState(telegramId);

    try {
        await ctx.answerCallbackQuery({
            text: "Проверяем вашу подписку... ⏳",
        });

        // Проверяем статус пользователя в канале
        const chatMember = await ctx.api.getChatMember(channelId, telegramId);

        const isSubscribed = ['member', 'administrator', 'creator'].includes(chatMember.status);

        if (isSubscribed) {
            if (!userData) {
                userData = await UserService.getUserByTelegramId(telegramId);
            }

            // Если данные пользователя найдены
            if (userData) {
                const userBonuses: BonusInterface[] | null = await BonusService.getBonusesByUserId(userData.id);

                // Если есть бонусы у пользователя
                if (userBonuses) {
                    const subscriptionBonuses: BonusInterface[] = userBonuses.filter((bonus: BonusInterface) => {
                        return bonus.bonusType === BonusTypeEnum.SUBSCRIPTION_CHANNEL;
                    });

                    // Проверяем, есть ли у пользователя бонус за подписку
                    if (subscriptionBonuses.length === 0) {
                        const body = {
                            userId: userData.id,
                            referralId: null,
                            bonusType: BonusTypeEnum.SUBSCRIPTION_CHANNEL,
                            bonusValue: 3,
                        }

                        const createdBonus: CreateBonusInterface | null = await BonusService.createBonus(body);

                        if (createdBonus) {
                            await ctx.reply(`
🎉 *Поздравляем!*  
Вы подписаны на наш канал, и вам начислено *3 бесплатных запроса*.  
Используйте их, чтобы узнать ответы на свои вопросы! ✨
`.trim(), { parse_mode: "Markdown" });
                        }
                        else {
                            logger.error(`Ошибка при создании бонуса`);

                            await ctx.reply(`
🚧 *Что-то пошло не так!*  
К сожалению, мы не смогли начислить вам бонусы.  
Пожалуйста, свяжитесь с нашей поддержкой для решения проблемы. 🙏
`.trim(), { parse_mode: "Markdown" });
                        }
                    }
                    else {
                        await ctx.reply(`
✅ *Вы уже подписаны!*  
Ваш бонус за подписку на наш канал уже был начислен ранее.  
Спасибо, что остаетесь с нами! 🌟
`.trim(), { parse_mode: "Markdown" });
                    }
                }
                else {
                    await ctx.reply(`
🚧 *Ошибка проверки подписки!*  
Мы не смогли получить информацию о ваших бонусах.  
Попробуйте позже или обратитесь в поддержку. 🙏
`.trim(), { parse_mode: "Markdown" });
                }
            }
            else {
                await ctx.reply(`
🚧 *Ошибка авторизации!*  
Мы не смогли найти ваши данные в нашей системе.  
Пожалуйста, начните сначала, нажав команду /start. 🙏
`.trim(), { parse_mode: "Markdown" });
            }
        } else {
            await ctx.reply(`
🔔 *Вы не подписаны на наш канал!*  
Пожалуйста, подпишитесь на наш канал [@tarobotik](https://t.me/tarobotik) и попробуйте снова.  
После подписки вы получите 3 бесплатных запроса! ✨
`.trim(), { parse_mode: "Markdown" });
        }
    } catch (error) {
        logger.error(`Ошибка при проверке подписки: ${error}`);

        await ctx.reply(`
🚧 *Произошла ошибка!*  
Мы не смогли проверить вашу подписку.  
Попробуйте позже или обратитесь в поддержку. 🙏
`.trim(), { parse_mode: "Markdown" });
    }
}