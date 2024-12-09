import { InlineKeyboard } from "grammy";

// Кнопка перехода в ТГ-канал
export const getMoreInfoButton = new InlineKeyboard().url("📚 Узнать больше в нашем канале", "https://t.me/Ske3y");

// Кнопка для перехода в канал поддержки
export const getSupportButton = new InlineKeyboard().url("Связаться с поддержкой", "https://t.me/bot_lovemyself");

// Кнопки для бонусов
export const bonusButtons = new InlineKeyboard()
    .add({ text: "🔗 Подписаться на канал", url: "https://t.me/Ske3y" }).row()
    .add({ text: "✅ Проверить подписку", callback_data: "check_subscription" });

// Кнопки для подписки
export const subscriptionButtons = new InlineKeyboard()
    .add({ text: "🔟 10 запросов – 199 рублей", callback_data: "subscribe_10_requests" }).row()
    .add({ text: "🔢 30 запросов – 349 рублей", callback_data: "subscribe_30_requests" }).row()
    .add({ text: "🌐 1 день (безлимит) – 499 рублей", callback_data: "subscribe_1_day" }).row()
    .add({ text: "🌐 7 дней (безлимит) – 699 рублей", callback_data: "subscribe_7_days" }).row()
    .add({ text: "🌐 30 дней (безлимит) – 999 рублей", callback_data: "subscribe_30_days" }).row()
    .add({ text: "🌍 Международная оплата", callback_data: "international_payment" });

// Кнопки для международной оплаты
export const internationalPaymentButtons = new InlineKeyboard()
    .add({ text: "🔟 10 запросов – 119 ⭐️", callback_data: "international_subscribe_10_requests" }).row()
    .add({ text: "🔢 30 запросов – 179 ⭐️", callback_data: "international_subscribe_30_requests" }).row()
    .add({ text: "🌐 1 день (безлимит) – 299 ⭐️", callback_data: "international_subscribe_1_day" }).row()
    .add({ text: "🌐 7 дней (безлимит) – 399 ⭐️", callback_data: "international_subscribe_7_days" }).row()
    .add({ text: "🌐 30 дней (безлимит) – 599 ⭐️", callback_data: "international_subscribe_30_days" });

// Кнопки для рефералки, когда ее нет
export const emptyReferralButtons = new InlineKeyboard()
    .add({ text: "🔗 Получить ссылку", callback_data: "generate_referral_link" }).row()
    .add({ text: "🎁 Мои бонусы", callback_data: "my_bonuses" });

// Кнопки для рефералки, когда она есть
export const hasReferralButtons = new InlineKeyboard()
    .add({ text: "🔗 Получить ссылку", callback_data: "generate_referral_link" }).row()
    .add({ text: "🎁 Мои бонусы", callback_data: "generate_new_referral_link" });