import { Context } from "grammy";
import { ApiService } from "./apiService.service";
import { TelegramPaymentInterface } from "@interfaces/telegram/payment.interface";
import { LabeledPrice, SuccessfulPayment } from "grammy/types";
import { logger } from "./logger.service";
import { UserService } from "./user.service";
import { UserInterface } from "@interfaces/api/user.interface";
import { TariffInterface } from "@interfaces/api/tariff.interface";
import { TariffService } from "./tariffs.service";
import { TransactionStatusesEnum } from "../enums/transaction.enum";
import { TransactionService } from "./transaction.service";
import { TransactionInterface } from "@interfaces/api/transaction.interface";

export class PaymentService {
    // Создание платежа через ЮКасса
    static async createPaymentWithYooKassa(data: {amount: string, description: string}): Promise<any | null> {
        const response = await ApiService.postData<any>('/payments/yookassa', data);

        if (response.success && response.data) {
            return response.data;
        } else {
            return null;
        }
    }

    // Инициация платежа
    static async createPaymentWithTelegram(ctx: Context, telegramId: number, paymentDetails: TelegramPaymentInterface): Promise<void> {
        const { title, description, payload, currency, amount } = paymentDetails;

        if (!ctx.api) {
            throw new Error("Telegram API is not available in the context.");
        }

        const prices: LabeledPrice[] = [
            {
                label: title,
                amount: amount,
            }
        ];

        try {
            const invoiceLink: string = await ctx.api.createInvoiceLink(title, description, payload, "", currency, prices);

            if (invoiceLink) {
                const inlineKeyboard = {
                    inline_keyboard: [
                        [
                            {
                                text: "💳 Перейти к оплате",
                                url: invoiceLink,
                            }
                        ]
                    ]
                };

                await ctx.api.sendMessage(telegramId, "🌟 Для завершения оплаты нажмите на кнопку ниже:", {
                    reply_markup: inlineKeyboard,
                });
            } else {
                logger.error('Не удалось сформировать ссылку на оплату');
            }
        } catch (error) {
            logger.error("Не удалось произвести оплату:", error);
            throw new Error("Failed to send invoice.");
        }
    }

    // Обработка успешного платежа для ТГ
    static async handleSuccessfulPayment(ctx: Context, paymentInfo: SuccessfulPayment, telegramId: number): Promise<void> {
        const transactionId = paymentInfo.invoice_payload;

        // Найти транзакцию по paymentId
        const transactionData: TransactionInterface | null = await TransactionService.getTransactionByTransactionId(transactionId);
    
        if (!transactionData) {
            await ctx.reply(`
🚧 *Произошла ошибка!*  
Мы не смогли найти информацию о транзакции.  
Попробуйте позже или обратитесь в поддержку. 🙏
`.trim(), { parse_mode: "Markdown" });
            
            return;
        }
    
        // Обновление статуса транзакции
        const updateTransactionData = {
            id: transactionData.id,
            status: TransactionStatusesEnum.COMPLETED,
        };
    
        const updatedTransaction = await TransactionService.updateTransaction(transactionData.id, updateTransactionData);
    
        if(!updatedTransaction) {
            await ctx.reply(`
🚧 *Произошла ошибка!*  
Мы не смогли обновить информацию о транзакции.  
Попробуйте позже или обратитесь в поддержку. 🙏
`.trim(), { parse_mode: "Markdown" });
            
            return;
        }
    
        // Ищем необходимый тариф
        const tariffData: TariffInterface | null = await TariffService.getTariff(transactionData.tariffId ?? '');
    
        if (!tariffData) {
            await ctx.reply(`
🚧 *Произошла ошибка!*  
Мы не смогли найти информацию о тарифе.  
Попробуйте позже или обратитесь в поддержку. 🙏
`.trim(), { parse_mode: "Markdown" });
            
            return;
        }
    
        // Найти пользователя по userId
        const userData: UserInterface | null = await UserService.getUserById(transactionData.userId);
    
        if (!userData) {
            await ctx.reply(`
🚧 *Произошла ошибка!*  
Мы не смогли найти информацию о вас.  
Попробуйте позже или обратитесь в поддержку. 🙏
`.trim(), { parse_mode: "Markdown" });
            
            return;
        }
    
        // Создаем объект для обновления пользователя
        const updateUserData: Partial<UserInterface> = { id: userData.id };
    
        // Обновляем кол-во бесплатных запросов или статус подписки
        if (!tariffData.duration && tariffData.requestLimit) {
            updateUserData.requestsLeft = (userData.requestsLeft || 0) + tariffData.requestLimit;
        } else {
            const currentDate = new Date();
            const subscriptionExpiry = new Date(currentDate);
            subscriptionExpiry.setDate(currentDate.getDate() + (tariffData.duration || 0));
            updateUserData.subscriptionExpiry = subscriptionExpiry.toISOString();
        }
    
        // Обновляем пользователя
        await UserService.updateUser(userData.id, updateUserData);
    
        await ctx.reply("✅ Оплата успешно завершена! Спасибо за использование нашего сервиса.");
    }
}