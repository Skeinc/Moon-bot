import { Bot } from "grammy";
import { checkSubscriptionCallback } from "./bonus.callback";
import { referralCallback } from "./referral.callback";
import { subscribeCallback } from "./subscription.callback";
import { handleInternationalSubscription, internationalPaymentCallback } from "./internationalSubscription.callback";


export const registerCallbacks = (bot: Bot) => {
    // Обратный вызов для проверки подписки на канал
    bot.callbackQuery("check_subscription", checkSubscriptionCallback);
    // Обратные вызовы для команды "Подписка"
    bot.callbackQuery(/^subscribe_/, subscribeCallback);
    // Обратные вызовы для международной оплаты
    bot.callbackQuery("international_payment", internationalPaymentCallback);
    // Обратные вызовы для подписки международной оплаты
    bot.callbackQuery(/^international_subscribe_/, handleInternationalSubscription);
    // Обратные вызовы для команды "Реферальная программа"
    bot.callbackQuery(/^(generate_referral_link|get_referral_link|my_bonuses)$/, referralCallback);
};