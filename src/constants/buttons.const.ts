import { InlineKeyboard } from "grammy";

// Кнопка перехода в ТГ-канал
export const getMoreInfoButton = new InlineKeyboard().url("📚 Узнать больше в нашем канале", "https://t.me/Ske3y");

// Кнопка для перехода в канал поддержки
export const getSupportButton = new InlineKeyboard().url("Связаться с поддержкой", "https://t.me/bot_lovemyself");

// Кнопки для бонусов
export const bonusButtons = new InlineKeyboard()
    .add({ text: "🔗 Подписаться на канал", url: "https://t.me/Ske3y" }).row()
    .add({ text: "✅ Проверить подписку", callback_data: "check_subscription" });

// Кнопки для рефералки, когда ее нет
export const emptyReferralButtons = new InlineKeyboard()
    .add({ text: "🔗 Создать ссылку", callback_data: "generate_referral_link" }).row()
    .add({ text: "🎁 Мои бонусы", callback_data: "my_bonuses" });

// Кнопки для рефералки, когда она есть
export const hasReferralButtons = new InlineKeyboard()
    .add({ text: "🔗 Получить ссылку", callback_data: "get_referral_link" }).row()
    .add({ text: "🎁 Мои бонусы", callback_data: "my_bonuses" });