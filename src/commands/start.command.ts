import { getMenuKeyboard } from "@constants/keyboards.const";
import { Context } from "grammy";
import { newSpreadCommand } from "./newSpread.command";
import { checkTelegramID } from "@utils/checkTelegramID.util";
import { UserService } from "@services/user.service";
import { CreateUserInterface, UserInterface } from "@interfaces/api/user.interface";
import { logger } from "@services/logger.service";
import { CreateReferralInterface } from "@interfaces/api/referral.interface";
import { ReferralService } from "@services/referral.service";
import { CreateBonusInterface } from "@interfaces/api/bonus.interface";
import { BonusService } from "@services/bonus.service";
import { BonusTypeEnum } from "../enums/bonus.enum";
import { sessionStateManager } from "../states/sessionState";
import { userStateManager } from "../states/userState";

export const startCommand = async (ctx: Context) => {
    if(!await checkTelegramID(ctx)) {
        return;
    }

    // Данные пользователя
    const telegramId = ctx.from?.id!;
    const username = ctx.from?.username || null;

    try {
        const userData: UserInterface | null = await UserService.getUserByTelegramId(telegramId);

        if (!userData) {
            const body = { telegramId, username };

            const createdUserData: CreateUserInterface | null = await UserService.createUser(body);

            const referralId = ctx.match ?? null;

            if(createdUserData) {
                logger.info(`Пользователь cоздан: ${createdUserData.username || createdUserData.telegramId}`);

                // Инициализируем сессию
                sessionStateManager.setSession(Number(createdUserData.telegramId));

                // Инициализируем пользователя
                userStateManager.initializeUser({
                    id: createdUserData.id,
                    telegramId: createdUserData.telegramId,
                    username: createdUserData.username,
                    roleId: createdUserData.role.id,
                    requestsLeft: createdUserData.requestsLeft,
                    subscriptionExpiry: createdUserData.subscriptionExpiry,
                    referrerId: createdUserData.referrerId,
                    referralLink: createdUserData.referralLink,
                })

                // Логика начисления бонусов рефереру
                if(referralId && referralId !== String(telegramId)) {
                    // Ищем пользователя, который пригласил пользователя
                    const referrerData: UserInterface | null = await UserService.getUserByTelegramId(Number(referralId));

                    if(referrerData) {
                        logger.info(`Пользователь найден по телеграм ID: ${referralId}`);

                        // Создаем реферальную систему
                        const body = { referrerId: referrerData.id, referredUserId: createdUserData.id, bonusCount: 1 };

                        const createdReferralData: CreateReferralInterface | null = await ReferralService.createReferral(body);

                        if(createdReferralData) {
                            logger.info(`Реферальная система создана с ID: ${createdReferralData?.id}`);

                            const body = { userId: createdReferralData.referrer.id, referralId: createdReferralData.id, bonusType: BonusTypeEnum.REQUESTS, bonusValue: createdReferralData.bonusCount };

                            // Создаем бонус
                            const createdBonusData: CreateBonusInterface | null = await BonusService.createBonus(body);

                            if(createdBonusData) {
                                logger.info(`Бонус создан с ID: ${createdBonusData.id}`);
                            }
                            else {
                                logger.error(`Не удалось создать бонус со следующими данными`, body);
                            }
                        }
                        else {
                            logger.error(`Не удалось создать реферальную программу со следующими данными`, body);
                        }

                    }
                    else {
                        logger.error(`Не удалось найти пользователя по телеграм ID: ${referralId}`);
                    }
                }
            }
        }
        else {
            logger.info(`Пользователь найден: ${userData?.username || userData?.telegramId}`);

            // Инициализируем сессию
            sessionStateManager.setSession(Number(userData.telegramId));

            // Обновляем пользователя
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
    } catch (error) {
        logger.error(`Ошибка при обработке пользователя: ${(error as Error).message}`);

        await ctx.reply("Произошла ошибка при обработке вашей команды. Попробуйте позже.");

        return;
    }

    // Первое сообщение
    await ctx.reply(
        "Привет! Я здесь, чтобы помочь тебе разобраться в твоем раскладе по колоде ТАРО МАНАРА.\n\n" +
        "✅ Напиши свой вопрос для расклада.\n" +
        "✅ Выбери карты.\n\n" +
        "🎁 Новым пользователям доступно 3 бесплатных запроса!\n\n" +
        "С любовью, твой персональный таролог Moon. 💫\n\n" +
        "P.S. Если что-то пошло не так, попробуй нажать /start.\n" +
        "Меню находится внизу, рядом с полем для ввода текста.\n\n" +
        "Для связи с техподдержкой: @bot_lovemyself.", {
            reply_markup: {
                keyboard: getMenuKeyboard().build(),
                resize_keyboard: true,
                is_persistent: true,
            },
        }
    );

    // Вызов newSpreadCommand после отправки приветственного сообщения
    await newSpreadCommand(ctx);
};